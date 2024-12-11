import { NextRequest, NextResponse } from "next/server";
import neynarClient from "@/clients/neynar";
import { isApiErrorResponse } from "@neynar/nodejs-sdk";

export async function POST(request: NextRequest) {
  const { signer_uuid, castHash, action } = (await request.json()) as {
    signer_uuid: string;
    castHash: string;
    action: any;
  };

  try {
    const response = await neynarClient.postFrameAction({
      signerUuid: signer_uuid,
      castHash,
      action,
    });

    if (response) {
      return NextResponse.json(response, { status: 200 });
    } else {
      return NextResponse.json(response, { status: 500 });
    }
  } catch (err) {
    console.log("/api/frame/action", err);
    if (isApiErrorResponse(err)) {
      return NextResponse.json(
        { ...err.response.data },
        { status: err.response.status }
      );
    } else {
      return NextResponse.json(
        { message: "Something went wrong" },
        { status: 500 }
      );
    }
  }
}
