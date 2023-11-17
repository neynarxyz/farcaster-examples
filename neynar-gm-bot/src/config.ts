import dotenv from "dotenv";
dotenv.config();

export const FARCASTER_DEVELOPER_MNEMONIC =
  process.env.FARCASTER_DEVELOPER_MNEMONIC!;
export const SIGNER_UUID = process.env.SIGNER_UUID!;
export const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY!;
export const USERNAME_OR_FID = process.env.USERNAME_OR_FID!;
export const PUBLISH_CAST_TIME = process.env.PUBLISH_CAST_TIME || "09:00";
export const TIME_ZONE = process.env.TIME_ZONE || "UTC";
