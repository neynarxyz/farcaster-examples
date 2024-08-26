import { NextRequest, NextResponse } from "next/server";
import neynarClient from "@/clients/neynar";
import { ReactionType, isApiErrorResponse } from "@neynar/nodejs-sdk";
import { Cast } from "@neynar/nodejs-sdk/build/neynar-api/v2";

export async function POST(request: NextRequest) {
  const { signerUuid, reaction, castOrCastHash } = (await request.json()) as {
    signerUuid: string;
    reaction: ReactionType
    castOrCastHash: string | Cast;
  };

  try {
    const { success, message } = await neynarClient.publishReactionToCast(signerUuid, reaction, castOrCastHash);
    return NextResponse.json(
      { message: `Cast ${reaction} with hash ${castOrCastHash} published successfully` },
      { status: 200 }
    );
  } catch (err) {
    console.log("/api/cast/reaction", err);
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
