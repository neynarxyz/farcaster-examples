import neynarClient from "@/lib/neynarClient";
import { getSignedKey } from "@/utils/getSignedKey";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const signedKey = await getSignedKey(true);

    return NextResponse.json(signedKey, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const signer_uuid = searchParams.get("signer_uuid");

  if (!signer_uuid) {
    return NextResponse.json(
      { error: "signer_uuid is required" },
      { status: 400 }
    );
  }

  try {
    const signer = await neynarClient.lookupSigner(signer_uuid);

    return NextResponse.json(signer, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
