import { NeynarAPIClient } from "@neynar/nodejs-sdk";

const client = new NeynarAPIClient({
    apiKey: process.env.NEYNAR_API_KEY!
});

export default client;
