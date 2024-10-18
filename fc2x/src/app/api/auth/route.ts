import { NextRequest, NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';

export async function GET(request: NextRequest) {
  const generateAuthTokens = async () => {
    const client = new TwitterApi({
      appKey: process.env.TWITTER_CONSUMER_KEY!,
      appSecret: process.env.TWITTER_CONSUMER_SECRET!,
    });
    return await client.generateAuthLink(process.env.TWITTER_CALLBACK_URL, {authAccessType: "write", linkMode: "authorize", forceLogin: false});
  };

  try {
    const { oauth_token, oauth_token_secret, url } = await generateAuthTokens();
    if (!oauth_token || !oauth_token_secret || !url) {
      console.error('Invalid authentication request', { oauth_token, oauth_token_secret, url });
      return new NextResponse('Invalid authentication request', { status: 400 });
    }
    const response = NextResponse.redirect(url);

    response.cookies.set('oauth_token', oauth_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 3600,
      path: '/',
    });

    response.cookies.set('oauth_token_secret', oauth_token_secret, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 3600,
      path: '/',
    });

    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error) {
    console.error('Error handling OAuth token generation:', error);
    return new NextResponse('Error generating authentication link', { status: 500 });
  }
}