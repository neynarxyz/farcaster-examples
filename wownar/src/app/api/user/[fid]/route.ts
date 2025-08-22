import { NextRequest, NextResponse } from "next/server";
import neynarClient from "@/clients/neynar";
import { isApiErrorResponse } from "@neynar/nodejs-sdk";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fid: string }> }
) {
  try {
    const resolvedParams = await params;
    const fid = parseInt(resolvedParams.fid);
    const {
      users
    } = await neynarClient.fetchBulkUsers({ fids: [fid] });
    return NextResponse.json({ user: users[0] }, { status: 200 });
  } catch (err: unknown) {
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
