import {
  Kafka,
  Consumer,
  EachMessagePayload,
  KafkaMessage,
  logLevel,
} from "kafkajs";
import { createClient } from "redis";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

import { FarcasterEvent } from "./types";

dotenv.config();

if (!process.env.KAFKA_BROKERS) {
  console.error("KAFKA_BROKERS environment variable is required");
  process.exit(1);
}

if (!process.env.KAFKA_USERNAME) {
  console.error("KAFKA_USERNAME environment variable is required");
  process.exit(1);
}

if (!process.env.KAFKA_PASSWORD) {
  console.error("KAFKA_PASSWORD environment variable is required");
  process.exit(1);
}

if (!process.env.KAFKA_CONSUMER_GROUP) {
  console.error("KAFKA_CONSUMER_GROUP environment variable is required");
  process.exit(1);
}

const is_production = process.env.NODE_ENV === "production";

const KAFKA_USERNAME = process.env.KAFKA_USERNAME;
const KAFKA_PASSWORD = process.env.KAFKA_PASSWORD;
const brokers = process.env.KAFKA_BROKERS
  ? process.env.KAFKA_BROKERS.split(",")
  : ["localhost:9092"];

// https://kafka.js.org/docs/configuration
const kafka = new Kafka({
  clientId: `neynar-webhook-consumer-${uuidv4()}`,
  brokers,
  logLevel: logLevel.INFO,
  connectionTimeout: 3000,
  ssl: is_production,
  sasl:
    is_production && KAFKA_USERNAME && KAFKA_PASSWORD
      ? {
          mechanism: "scram-sha-512",
          username: KAFKA_USERNAME,
          password: KAFKA_PASSWORD,
        }
      : undefined,
});

// Consider fine-tuning the consumer configuration based on your application’s load
// https://kafka.js.org/docs/consuming#a-name-options-a-options
const consumer: Consumer = kafka.consumer({
  groupId: process.env.KAFKA_CONSUMER_GROUP,
});

// Create Redis client to store processed messagesIds to avoid duplicate processing of messages
// You can use any other database or storage solution for this purpose
const redis_client = createClient({
  url: "redis://localhost:6379", // Replace with your Redis connection string
});

// Connect to Redis
redis_client.connect().catch(console.error);

async function is_message_processed(message_id: string): Promise<boolean> {
  const result = await redis_client.get(`kafka:message:${message_id}`);
  return result !== null;
}

async function mark_message_processed(message_id: string): Promise<void> {
  await redis_client.set(`kafka:message:${message_id}`, "1", {
    EX: 24 * 60 * 60, // Expire after 24 hours (adjust as needed)
  });
}

async function process_event(event: FarcasterEvent): Promise<void> {
  switch (event.event_type) {
    case "user.created":
      console.log(`New user created: ${event.data.fid}`);
      // Handle user creation logic and commit the offset
      break;
    case "user.updated":
      console.log(`User updated: ${event.data.fid}`);
      // Handle user update logic and commit the offset
      break;
    case "cast.created":
      console.log(`New cast created: ${event.data.hash}`);
      // Handle cast creation logic and commit the offset
      break;
    case "reaction.created":
      console.log(`New reaction: ${event.data.reaction_type}`);
      // Handle reaction creation logic and commit the offset
      break;
    case "reaction.deleted":
      console.log(`Reaction deleted: ${event.data.reaction_type}`);
      // Handle reaction deletion logic and commit the offset
      break;
    case "follow.created":
      console.log(`New follow: ${event.data.target_user.fid}`);
      // Handle follow creation logic and commit the offset
      break;
    case "follow.deleted":
      console.log(`Follow deleted: ${event.data.target_user.fid}`);
      // Handle follow deletion logic and commit the offset
      break;
  }
}

function exponential_backoff(
  attempt: number,
  base_delay: number = 500
): number {
  const max_delay = 30000;
  const delay = Math.min(base_delay * Math.pow(2, attempt), max_delay);
  return delay;
}

async function handle_message_with_backoff(
  message_id: string,
  message: KafkaMessage,
  attempt: number = 0
): Promise<void> {
  if (!message.value) {
    console.error("Received message with empty value");
    return;
  }

  try {
    if (await is_message_processed(message_id)) {
      console.log(`Skipping duplicate message: ${message_id}`);
      return;
    }

    const event: FarcasterEvent = JSON.parse(message.value.toString());
    await process_event(event);
    await mark_message_processed(message_id);
  } catch (error) {
    console.error(`Error processing message (attempt ${attempt + 1}):`, error);

    const delay = exponential_backoff(attempt);
    console.log(`Retrying in ${delay} ms...`);

    await new Promise((resolve) => setTimeout(resolve, delay));

    if (attempt < 5) {
      // Maximum of 5 retries
      await handle_message_with_backoff(message_id, message, attempt + 1);
    } else {
      console.error(`Max retry attempts reached for message: ${message_id}`);
      // Optionally, handle the failure case (e.g., send to a dead-letter queue)
    }
  }
}

async function connect_with_retry() {
  while (true) {
    try {
      await consumer.connect();
      console.log("Successfully connected to Kafka");
      break;
    } catch (error) {
      console.error(
        "Failed to connect to Kafka, retrying in 5 seconds:",
        error
      );
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

async function subscribe_with_retry() {
  while (true) {
    try {
      await consumer.subscribe({
        topic: "farcaster-mainnet-events", // All webhook events are published to this topic
      });
      console.log("Successfully subscribed to topic");
      break;
    } catch (error) {
      console.error(
        "Failed to subscribe to topic, retrying in 5 seconds:",
        error
      );
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

async function main() {
  while (true) {
    try {
      await connect_with_retry();
      await subscribe_with_retry();

      let isRebalancing = false;

      consumer.on(consumer.events.GROUP_JOIN, () => {
        console.log("Consumer has joined the group");
        isRebalancing = false;
      });

      consumer.on(consumer.events.REBALANCING, () => {
        console.log("Rebalance in progress");
        isRebalancing = true;
      });

      consumer.on(consumer.events.DISCONNECT, async () => {
        console.error("Consumer disconnected, attempting to reconnect...");
        await connect_with_retry(); // Reconnect logic
      });

      await consumer.run({
        autoCommit: false,
        eachMessage: async ({
          topic,
          partition,
          message,
          heartbeat,
        }: EachMessagePayload) => {
          if (isRebalancing) {
            console.log("Skipping message processing due to ongoing rebalance");
            return;
          }
          try {
            const message_id = `${topic}-${partition}-${message.offset}`;
            await handle_message_with_backoff(message_id, message);
            // Commit the offset manually after processing the message successfully.
            // This should happen in process_event based on your use case.
            // For simplicity in this example, we commit the offset here.
            await consumer.commitOffsets([
              {
                topic,
                partition,
                offset: (Number(message.offset) + 1).toString(),
              },
            ]);
            // If process_event could potentially be blocking,
            // consider offloading heavy processing to a separate thread or process
            // to keep the main event loop free and allow heartbeats to be sent.
            // rely on KafkaJS's built-in heartbeat mechanism. i.e. heartbeatInterval config in kafka.consumer()
            // or manually sending heartbeats if needed.
            await heartbeat();
          } catch (error) {
            console.error("Error processing message:", error);
          }
        },
      });

      break;
    } catch (error) {
      console.error("Kafka consumer encountered an error:", error);
      console.log("Attempting to reconnect in 5 seconds...");
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

let shutdown_in_progress = false;

async function graceful_shutdown() {
  if (shutdown_in_progress) return;
  shutdown_in_progress = true;

  console.log("Shutting down gracefully...");
  try {
    await consumer.disconnect();
    await redis_client.disconnect();
    console.log("Consumer and Redis client disconnected");
    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
}

// Run the consumer
main().catch((error) => {
  console.error("Error running main:", error);
  graceful_shutdown();
});

// Handle graceful shutdown
process.on("SIGINT", graceful_shutdown);
process.on("SIGTERM", graceful_shutdown);
