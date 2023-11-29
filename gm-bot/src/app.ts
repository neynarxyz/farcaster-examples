import cron from "node-cron";
import { MESSAGE } from "./utils";
import neynarClient from "./neynarClient";
import {
  PUBLISH_CAST_TIME,
  SIGNER_UUID,
  TIME_ZONE,
  NEYNAR_API_KEY,
  FARCASTER_BOT_MNEMONIC,
} from "./config";
import { isApiErrorResponse } from "@neynar/nodejs-sdk";

// Validating necessary environment variables or configurations.
if (!FARCASTER_BOT_MNEMONIC) {
  throw new Error("FARCASTER_BOT_MNEMONIC is not defined");
}
if (!SIGNER_UUID) {
  throw new Error("SIGNER_UUID is not defined");
}

if (!NEYNAR_API_KEY) {
  throw new Error("NEYNAR_API_KEY is not defined");
}

/**
 * Function to publish a message (cast) using neynarClient.
 * @param msg - The message to be published.
 */
const publishCast = async (msg: string) => {
  try {
    // Using the neynarClient to publish the cast.
    await neynarClient.publishCast(SIGNER_UUID, msg);
    console.log("Cast published successfully");
  } catch (err) {
    // Error handling, checking if it's an API response error.
    if (isApiErrorResponse(err)) {
      console.log(err.response.data);
    } else console.log(err);
  }
};

// Initial call to publish a motivational message.
publishCast(
  `gm! I'm here to brighten your day with daily cheer. Look forward to a warm 'gm' everyday!`
);

// Extracting hour and minute from the PUBLISH_CAST_TIME configuration.
const [hour, minute] = PUBLISH_CAST_TIME.split(":");

// Scheduling a cron job to publish a message at a specific time every day.
cron.schedule(
  `${minute} ${hour} * * *`, // Cron time format
  function () {
    publishCast(MESSAGE); // Function to execute at the scheduled time.
  },
  {
    scheduled: true, // Ensure the job is scheduled.
    timezone: TIME_ZONE, // Set the timezone for the schedule.
  }
);

// Logging to inform that the cron job is scheduled.
console.log(
  `Cron job scheduled at ${PUBLISH_CAST_TIME} ${TIME_ZONE}, please don't restart your system before the scheduled time.`
);
