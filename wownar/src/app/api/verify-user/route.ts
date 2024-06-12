import { NextRequest, NextResponse } from "next/server";
import neynarClient from "@/clients/neynar";
import { isApiErrorResponse } from "@neynar/nodejs-sdk";

export async function POST(request: NextRequest) {
  const { signerUuid, fid } = (await request.json()) as {
    signerUuid: string;
    fid: string;
  };

  let isVerifiedUser = false;
  try {
    const { fid: userFid } = await neynarClient.lookupSigner(signerUuid);

    if (userFid) {
      if (userFid == parseInt(fid)) {
        isVerifiedUser = true;
      }
    } else isVerifiedUser = false;
    return NextResponse.json({ isVerifiedUser }, { status: 200 });
  } catch (err) {
    console.log("/api/verify-user", err);
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
