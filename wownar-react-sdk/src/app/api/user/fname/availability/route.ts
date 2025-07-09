import { NextRequest, NextResponse } from "next/server";
import neynarClient from "@/clients/neynar";
import { isApiErrorResponse } from "@neynar/nodejs-sdk";

export async function GET(request: NextRequest) {
  const fname = request.nextUrl.searchParams.get("fname");
  try {
    const res = await neynarClient.isFnameAvailable({ fname: fname! });
    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    console.log("GET - /api/user", error);
    if (isApiErrorResponse(error)) {
      return NextResponse.json(
        { ...error.response.data },
        { status: error.response.status }
      );
    } else
      return NextResponse.json(
        { message: "Something went wrong" },
        { status: 500 }
      );
  }
}
