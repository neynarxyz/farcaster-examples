import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/login/authorize?api_key=${process.env
        .NEYNAR_API_KEY!}&response_type=code&client_id=${
        process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID
      }`,
      { cache: "no-store", next: { revalidate: 0 } }
    );

    if (!response.ok)
      throw new Error("Something went wrong fetching the authorization URL");

    const { authorization_url } = await response.json();

    return NextResponse.json({ authorization_url }, { status: 200 });
  } catch (err) {
    console.log("/api/get-auth-url", err);
    return NextResponse.json({ err }, { status: 500 });
  }
}
