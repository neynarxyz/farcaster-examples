import { NextRequest, NextResponse } from "next/server";
import neynarClient from "@/clients/neynar";
import { isApiErrorResponse } from "@neynar/nodejs-sdk";

export async function GET(request: NextRequest) {
  const res = await neynarClient.getFreshAccountFID();
  return NextResponse.json(res, { status: 200 });
}

export async function POST(request: NextRequest) {
  const {
    fid,
    signature,
    requestedUserCustodyAddress,
    deadline,
    fname,
    metadata,
  } = await request.json();

  try {
    const response = await neynarClient.registerAccount({
      fid,
      signature,
      requestedUserCustodyAddress,
      deadline,
      fname,
      metadata,
    });
    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    console.log("/api/user", err);
    if (isApiErrorResponse(err)) {
      return NextResponse.json(
        { ...err.response.data },
        { status: err.response.status }
      );
    } else
      return NextResponse.json(
        { message: "Something went wrong" },
        { status: 500 }
      );
  }
}
