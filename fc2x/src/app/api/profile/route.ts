import { NextRequest, NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  const twitterUserId = request.cookies.get('twitter_user_id')?.value;
  if (!twitterUserId) {
    return new NextResponse('User not authenticated', { status: 401 });
  }

  const { rows } = await pool.query(
    'SELECT * FROM users WHERE twitter_user_id = $1',
    [twitterUserId]
  );

  if (rows.length === 0) {
    return new NextResponse('User not authenticated', { status: 401 });
  }

  const userProfile = rows[0];

  return NextResponse.json(userProfile);
}