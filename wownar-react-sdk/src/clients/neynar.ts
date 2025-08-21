import { NeynarAPIClient, Configuration } from "@neynar/nodejs-sdk";

const client = new NeynarAPIClient(new Configuration({
  apiKey: process.env.NEYNAR_API_KEY!
}));

export default client;
