import { NextRequest, NextResponse } from "next/server";
import neynarClient from "@/clients/neynar";
import { isApiErrorResponse } from "@neynar/nodejs-sdk/build/utils/is-api-error-response";

export async function GET(request: NextRequest) {
  const fid = (await await request.json()) as { fid: number };
  return NextResponse.json({ fid }, { status: 200 });
}

export async function POST(request: NextRequest) {
  const { signerUuid, text } = (await request.json()) as {
    signerUuid: string;
    text: string;
  };

  try {
    const response = await neynarClient.publishCast({
      signerUuid,
      text
    });
    const hash = response.cast.hash;
    return NextResponse.json(
      { message: `Cast with hash ${hash} published successfully` },
      { status: 200 }
    );
  } catch (err) {
    console.log("/api/cast", err);
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
