import { NextRequest, NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const twitter_oauth_token = url.searchParams.get('oauth_token');
  const oauth_verifier = url.searchParams.get('oauth_verifier');

  const twitter_oauth_token_cookie = request.cookies.get('oauth_token')?.value;
  const twitter_oauth_token_secret = request.cookies.get('oauth_token_secret')?.value;

  if (!twitter_oauth_token || !oauth_verifier || !twitter_oauth_token_cookie || !twitter_oauth_token_secret) {
    console.error('Invalid authentication request', { twitter_oauth_token, oauth_verifier, twitter_oauth_token_cookie, twitter_oauth_token_secret });
    return new NextResponse('Invalid authentication request', { status: 400 });
  }

  try {
    const client = new TwitterApi({
      appKey: process.env.TWITTER_CONSUMER_KEY!,
      appSecret: process.env.TWITTER_CONSUMER_SECRET!,
      accessToken: twitter_oauth_token,
      accessSecret: twitter_oauth_token_secret,
    });

    const { accessToken, accessSecret, userId } = await client.login(oauth_verifier);

    const userClient = new TwitterApi({
      appKey: process.env.TWITTER_CONSUMER_KEY!,
      appSecret: process.env.TWITTER_CONSUMER_SECRET!,
      accessToken: accessToken,
      accessSecret: accessSecret,
    });

    console.log("user id before verifying credentials", userId);
    const userData = await userClient.v1.verifyCredentials();
    console.log("user details after verifying credentails", userData);

    const insertQuery = `
      INSERT INTO users (
        twitter_user_id, display_name, twitter_username, profile_image_url, twitter_access_token
      ) VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (twitter_user_id)
      DO UPDATE SET
        display_name = EXCLUDED.display_name,
        twitter_username = EXCLUDED.twitter_username,
        profile_image_url = EXCLUDED.profile_image_url,
        twitter_access_token = EXCLUDED.twitter_access_token
      `;

      const result = await pool.query(insertQuery, [
        userId,
        userData.name,
        userData.screen_name,
        userData.profile_image_url_https,
        accessToken
      ]);

      if(result){
        const updateSecretQuery = `
        UPDATE users
        SET twitter_access_token_secret = $2::text
        WHERE twitter_user_id = $1
        `;
        const updateResult = await pool.query(updateSecretQuery, [userId, accessSecret]);
      }

      const response = NextResponse.redirect(new URL('/', request.url));

      response.cookies.set('twitter_user_id', userId, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
      });

      response.cookies.delete('oauth_token');
      response.cookies.delete('oauth_token_secret');

      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');

      return response;
  } catch (error) {
    console.error('Error during callback:', error);
    return new NextResponse('Error during authentication callback', { status: 500 });
  }
}