# ClawdTalk Voice Agent

## Introduction

`clawdtalk-voice-agent` is a Farcaster agent that can receive voice calls and SMS messages through a real phone number. It connects to [ClawdTalk](https://clawdtalk.com) via WebSocket, enabling any AI agent to have telephony capabilities without running a server.

This example demonstrates how to build a voice-accessible Farcaster bot that can:
- Answer inbound voice calls
- Read out recent casts to callers
- Receive SMS messages
- Post casts triggered by voice interactions

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- A [ClawdTalk](https://clawdtalk.com) account with an assigned phone number
- A [Neynar](https://neynar.com) API key
- A Farcaster signer UUID (optional, for posting casts)

## Installation

### 1. Install Dependencies

```bash
cd clawdtalk-voice-agent
yarn install
# or
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

| Variable | Description |
|----------|-------------|
| `CLAWDTALK_PHONE_NUMBER` | Your ClawdTalk-assigned phone number (e.g., `+1234567890`) |
| `NEYNAR_API_KEY` | Your Neynar API key from [neynar.com](https://neynar.com) |
| `SIGNER_UUID` | Your Farcaster signer UUID (for posting casts) |

### 3. Run the Agent

```bash
yarn start
# or
npm run start
```

## How It Works

1. **WebSocket Connection**: The agent connects to `wss://clawdtalk.com/ws` and registers your phone number
2. **Incoming Calls**: When someone calls your number, ClawdTalk streams the call to your agent
3. **Speech Handling**: The agent can respond with text-to-speech and receive transcribed speech from the caller
4. **Farcaster Integration**: Use Neynar's API to fetch casts, post new casts, or interact with the Farcaster network

## Example Use Cases

- **Voice-Activated Casting**: Let users post casts by calling your bot
- **Cast Reader**: Read recent casts to callers
- **Notification Bot**: Receive SMS alerts for Farcaster mentions
- **Interactive Voice Bot**: Build conversational AI that interacts with Farcaster

## ClawdTalk Events

The WebSocket connection receives these event types:

| Event | Description |
|-------|-------------|
| `call.incoming` | Incoming voice call |
| `call.speech` | Transcribed speech from caller |
| `sms.incoming` | Incoming SMS message |

## Resources

- [ClawdTalk Documentation](https://github.com/team-telnyx/clawdtalk-client)
- [Neynar API Docs](https://docs.neynar.com/)
- [Farcaster Protocol](https://docs.farcaster.xyz/)

## License

MIT
