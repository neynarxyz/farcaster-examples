import neynarClient from "@/lib/neynarClient";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const fid = searchParams.get("fid");

  if (!fid) {
    return NextResponse.json({ error: "fid is required" }, { status: 400 });
  }

  try {
    const user = await neynarClient.fetchBulkUsers({ fids: [Number(fid)] });

    return NextResponse.json(user.users[0], { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
