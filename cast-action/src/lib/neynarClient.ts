import { NeynarAPIClient, Configuration } from "@neynar/nodejs-sdk";
import { config } from "dotenv";

config();

if (!process.env.NEYNAR_API_KEY) {
  throw new Error("Make sure you set NEYNAR_API_KEY in your .env file");
}

const neynarConfig = new Configuration({
  apiKey: process.env.NEYNAR_API_KEY,
  baseOptions: {
    headers: {
      "x-neynar-experimental": true,
    },
  },
});

const neynarClient = new NeynarAPIClient(neynarConfig);

export default neynarClient;
