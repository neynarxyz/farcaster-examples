# Kafka Consumer Example

This repository provides an example of a Kafka consumer that interacts with Neynar's Kafka stream. With Neynar's Kafka stream, developers can ingest hydrated events from a hosted Kafka stream (as compared to dehydrated events from gRPC hub)

With Kafka, you can subscribe to the same data that we use for sending webhook notifications

## Documentation

For detailed information on how the Kafka stream works, please refer to the [Neynar Kafka Stream Documentation](https://docs.neynar.com/docs/from-kafka-stream).

## Project Setup

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or later)
- [Redis](https://redis.io/downloads/) (Redis is used only for this example, you can you any other storage solution)

### Step 1: Clone the Repository

Clone the repository to your local machine:

```sh
git clone https://github.com/neynarxyz/farcaster-examples.git && cd neynar-webhook-kafka-consumer
```

### Step 2: Configure Environment Variables

Copy the contents of the `.env.example` file into a new `.env` file:

```sh
cp .env.example .env
```

Then, open the `.env` file and update the placeholders with your actual configuration:

```env
NODE_ENV=production

KAFKA_BROKERS=<your_kafka_brokers>

# Contact Neynar to get the following credentials

KAFKA_USERNAME=<your_kafka_username>
KAFKA_PASSWORD=<your_kafka_password>
KAFKA_CONSUMER_GROUP=<your_kafka_consumer_group>
```

### Step 3: Install Dependencies

For yarn

```bash
yarn install
```

For npm

```bash
npm install
```

### Step 4: Start the Kafka Consumer

For yarn

```bash
yarn start
```

For npm

```bash
npm run start
```

## License

`kafka_consumer_example` is released under the MIT License. This license permits free use, modification, and distribution of the software, with the requirement that the original copyright and license notice are included in any substantial portion of the work.

## Author

Developed by [Neynar](https://neynar.com/).
