import { NeynarAPIClient } from "@neynar/nodejs-sdk";
import { NEYNAR_API_KEY } from "./config";

const neynarClient = new NeynarAPIClient(NEYNAR_API_KEY);

export default neynarClient;
