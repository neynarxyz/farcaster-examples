# gm_bot

## Introduction

`gm_bot` is an automated messaging bot designed to cast a 'gm 🪐' message in Warpcast every day at a scheduled time. The bot operates continuously as long as the system remains online. It leverages [Neynar API](https://docs.neynar.com/) and is built using [@neynar/nodejs-sdk](https://www.npmjs.com/package/@neynar/nodejs-sdk).

## Prerequisites

- [Node.js](https://nodejs.org/en/): A JavaScript runtime built on Chrome's V8 JavaScript engine. Ensure you have Node.js installed on your system.

## Installation

### Setting Up the Environment

1. **Install PM2**: PM2 is a process manager for Node.js applications. Install it globally using npm:

   ```bash
   npm install -g pm2
   ```

2. **Install Project Dependencies**: Navigate to the project directory and run one of the following commands to install all required dependencies:

   ```bash
   yarn install
   # or
   npm install
   ```

3. **Configure Environment Variables**:
   - Copy the example environment file:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` to add your `NEYNAR_API_KEY`. Optionally, you can also specify `PUBLISH_CAST_TIME` and `TIME_ZONE` for custom scheduling.

### Generating and Approving a Signer

Before running the bot, you need to generate a signer and get it approved. This is crucial for the bot's operation. Run the following command:

```bash
yarn get-approved-signer
```

## Running the Bot

1. **Start the Bot**: Launch the bot using the following command:

   ```bash
   yarn start
   # or
   npm run start
   ```

2. **Verify the Process**: Ensure that the bot is running correctly with:

   ```bash
   pm2 status
   ```

3. **View Logs**: To check the bot's activity logs, use:

   ```bash
   pm2 logs
   ```

4. **Stopping the Bot**: If you need to stop the bot, use:
   ```bash
   pm2 kill
   ```

## License

`gm_bot` is released under the ISC License. This license allows for the free use, modification, and distribution of the software.

## FAQs/Troubleshooting

- **Q1**: What if `gm_bot` stops sending messages?
  - **A1**: Check the PM2 logs for any errors and ensure your system's time settings align with the specified `TIME_ZONE`, also ensure that the process is running.
