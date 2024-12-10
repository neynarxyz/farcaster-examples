import { NextRequest, NextResponse } from "next/server";
import neynarClient from "@/clients/neynar";
import { isApiErrorResponse } from "@neynar/nodejs-sdk";

export async function GET(request: NextRequest) {
  const res = await neynarClient.getFreshAccountFID();
  return NextResponse.json(res, { status: 200 });
}
