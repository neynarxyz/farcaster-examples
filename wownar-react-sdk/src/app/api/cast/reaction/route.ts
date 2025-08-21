import { NextRequest, NextResponse } from "next/server";
import neynarClient from "@/clients/neynar";
import { ReactionType } from "@neynar/nodejs-sdk/build/api";
import { Cast } from "@neynar/nodejs-sdk/build/api";
import { isApiErrorResponse } from "@neynar/nodejs-sdk/build/utils/is-api-error-response";

export async function POST(request: NextRequest) {
  const { signerUuid, reaction, castOrCastHash } = (await request.json()) as {
    signerUuid: string;
    reaction: ReactionType
    castOrCastHash: string | Cast;
  };

  try {
    // Convert Cast object to string if needed
    const target = typeof castOrCastHash === 'string' ? castOrCastHash : castOrCastHash.hash;
    
    const response = await neynarClient.publishReaction({
      signerUuid,
      reactionType: reaction,
      target
    });
    
    return NextResponse.json(
      { message: `Cast ${reaction} with hash ${target} published successfully` },
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
