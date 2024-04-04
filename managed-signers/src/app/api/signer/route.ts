import neynarClient from "@/lib/neynarClient";
import { generate_signature } from "@/utils/generateSignature";
import { getFid } from "@/utils/getFid";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const createSigner = await neynarClient.createSigner();

    const { deadline, signature } = await generate_signature(
      createSigner.public_key
    );

    const fid = await getFid();

    const signedKey = await neynarClient.registerSignedKey(
      createSigner.signer_uuid,
      Number(fid),
      deadline,
      signature
    );

    return NextResponse.json(signedKey, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  try {
    const signer = await neynarClient.lookupSigner(
      searchParams.get("signer_uuid")!
    );

    return NextResponse.json(signer, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
