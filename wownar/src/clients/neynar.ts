import { NeynarAPIClient } from "@neynar/nodejs-sdk";

const client = new NeynarAPIClient(process.env.NEXT_PUBLIC_NEYNAR_API_KEY!);

export default client;
