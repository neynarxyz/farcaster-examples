import { NextRequest, NextResponse } from "next/server";
import neynarClient from "@/clients/neynar";
import { isApiErrorResponse } from "@neynar/nodejs-sdk";

export async function GET(
  request: NextRequest,
  { params }: { params: { fid: string } }
) {
  try {
    const fid = parseInt(params.fid);
    const { users } = await neynarClient.fetchBulkUsers({ fids: [fid] });
    return NextResponse.json({ user: users[0] }, { status: 200 });
  } catch (err) {
    console.log("/api/user/[fid]", err);
    if (isApiErrorResponse(err)) {
      const apiError = err as { response: { data: any; status: number } };
      return NextResponse.json(
        { ...apiError.response.data },
        { status: apiError.response.status }
      );
    } else
      return NextResponse.json(
        { message: "Something went wrong" },
        { status: 500 }
      );
  }
}
