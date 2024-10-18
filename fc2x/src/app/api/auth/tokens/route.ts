import { NextRequest, NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';

export const revalidate = 0;

export async function GET(request: NextRequest) {
  const generateAuthTokens = async () => {
    const client = new TwitterApi({
      appKey: process.env.TWITTER_CONSUMER_KEY!,
      appSecret: process.env.TWITTER_CONSUMER_SECRET!,
    });
    return await client.generateAuthLink(process.env.TWITTER_CALLBACK_URL, {
      authAccessType: "write",
      linkMode: "authorize",
      forceLogin: false
    });
  };

  try {
    const { oauth_token, oauth_token_secret, url } = await generateAuthTokens();
    const response = NextResponse.json({ oauth_token, oauth_token_secret, url });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  } catch (error) {
    const errorResponse = NextResponse.json({ error: 'Error generating authentication link' }, { status: 500 });
    errorResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    errorResponse.headers.set('Pragma', 'no-cache');
    errorResponse.headers.set('Expires', '0');
    return errorResponse;
  }
}