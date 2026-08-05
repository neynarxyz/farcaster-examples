import WebSocket from "ws";
import { config } from "dotenv";
import { NeynarAPIClient, isApiErrorResponse } from "@neynar/nodejs-sdk";

config();

const CLAWDTALK_WS_URL = "wss://clawdtalk.com/ws";
const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;
const CLAWDTALK_PHONE_NUMBER = process.env.CLAWDTALK_PHONE_NUMBER;

if (!NEYNAR_API_KEY) throw new Error("NEYNAR_API_KEY is required");
if (!CLAWDTALK_PHONE_NUMBER) throw new Error("CLAWDTALK_PHONE_NUMBER is required");

const neynarClient = new NeynarAPIClient(NEYNAR_API_KEY);

async function getFarcasterUser(phoneNumber: string): Promise<string> {
  // In production, you'd look up the user by phone in your database
  // For this example, we'll search casts for mentions of the phone number
  return "unknown_user";
}

async function handleIncomingCall(callerId: string): Promise<string> {
  console.log(`Incoming call from: ${callerId}`);
  
  // Example: Fetch recent casts to share with caller
  try {
    const { casts } = await neynarClient.fetchFeed({
      feedType: "following",
      limit: 5,
      fid: 3, // Example FID - replace with your bot's FID
    });
    
    const recentCast = casts[0]?.text || "No recent casts";
    return `Hello! I'm your Farcaster voice agent. Here's my latest cast: "${recentCast.substring(0, 100)}"`;
  } catch (err) {
    if (isApiErrorResponse(err)) {
      console.error("Neynar API error:", err.response.data);
    }
    return "Hello! I'm your Farcaster voice agent. How can I help you today?";
  }
}

async function postCastFromCall(message: string, signerUuid: string): Promise<void> {
  try {
    await neynarClient.publishCast({
      signerUuid,
      text: message.substring(0, 320), // Farcaster character limit
    });
    console.log("Cast posted from voice call");
  } catch (err) {
    if (isApiErrorResponse(err)) {
      console.error("Failed to post cast:", err.response.data);
    }
  }
}

function connectToClawdtalk(): void {
  const ws = new WebSocket(CLAWDTALK_WS_URL);

  ws.on("open", () => {
    console.log("Connected to ClawdTalk");
    ws.send(JSON.stringify({
      type: "register",
      phoneNumber: CLAWDTALK_PHONE_NUMBER,
    }));
  });

  ws.on("message", async (data) => {
    const event = JSON.parse(data.toString());
    
    switch (event.type) {
      case "call.incoming":
        const response = await handleIncomingCall(event.callerId);
        ws.send(JSON.stringify({
          type: "call.answer",
          callId: event.callId,
          message: response,
        }));
        break;
        
      case "call.speech":
        // Handle speech from caller - could post to Farcaster
        console.log("Caller said:", event.transcript);
        break;
        
      case "sms.incoming":
        console.log(`SMS from ${event.from}: ${event.body}`);
        // Could post SMS content as a cast
        break;
    }
  });

  ws.on("close", () => {
    console.log("Disconnected from ClawdTalk, reconnecting in 5s...");
    setTimeout(connectToClawdtalk, 5000);
  });

  ws.on("error", (err) => {
    console.error("WebSocket error:", err.message);
  });
}

console.log(`ClawdTalk Voice Agent starting...`);
console.log(`Phone Number: ${CLAWDTALK_PHONE_NUMBER}`);
connectToClawdtalk();
