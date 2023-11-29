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
   - Edit `.env` to add your `NEYNAR_API_KEY` and `FARCASTER_DEVELOPER_MNEMONIC`. Optionally, you can also specify `PUBLISH_CAST_TIME` and `TIME_ZONE` for custom scheduling.

### Generating a Signer

Before running the bot, you need to generate a signer and get it approved via an onchain transaction. To execute the transaction, you'll need a browser extension wallet with funded roughly $2 worth of OP ETH on the Optimism mainnet. This is crucial for the bot's operation. Run the following command:

```bash
yarn get-approved-signer
```

### Approving a signer
In order to get an approved signer you need to do an on-chain transaction on OP mainnet.
Go to Farcaster KeyGateway optimism explorer
https://optimistic.etherscan.io/address/0x00000000fc56947c7e7183f8ca4b62398caadf0b#writeContract

Connect to Web3.

Navigate to `addFor` function and add following values inside the respective placeholders. You will see values for fidOwner, keyType, key, metadataType, metadata, deadline, sig in your terminal logs. 

Press "Write" to execute the transaction. This will create a signer for your mnemonic on the OP mainnet.

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

`gm_bot` is released under the MIT License. This license permits free use, modification, and distribution of the software, with the requirement that the original copyright and license notice are included in any substantial portion of the work.

## FAQs/Troubleshooting

- **Q1**: What if `gm_bot` stops sending messages?
  - **A1**: Check the PM2 logs for any errors and ensure your system's time settings align with the specified `TIME_ZONE`, also ensure that the process is running.
