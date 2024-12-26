import { NeynarAPIClient, Configuration } from "@neynar/nodejs-sdk";
import { NEYNAR_API_KEY } from "./config";

const config = new Configuration({
  apiKey: NEYNAR_API_KEY!,
});

const neynarClient = new NeynarAPIClient(config);

export default neynarClient;
