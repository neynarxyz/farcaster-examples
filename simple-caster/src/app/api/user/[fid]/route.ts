import { NextRequest, NextResponse } from "next/server";
import neynarClient from "@/clients/neynar";
import { isApiErrorResponse } from "@neynar/nodejs-sdk";

export async function GET(
  request: NextRequest,
  { params }: { params: { fid: string } }
) {
  try {
    const fid = parseInt(params.fid);
    const {
      result: { user },
    } = await neynarClient.lookupUserByFid(fid);
    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    console.log("/api/user/[fid]", err);
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
