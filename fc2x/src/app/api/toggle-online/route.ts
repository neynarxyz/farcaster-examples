import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  const twitter_user_id = request.cookies.get('twitter_user_id')?.value;

  if (!twitter_user_id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const body = await request.json();
  const { is_online } = body;

  try {
    await pool.query(
      `UPDATE users SET is_online = $1 WHERE twitter_user_id = $2`,
      [is_online, twitter_user_id]
    );

    return new NextResponse(JSON.stringify({ success: true, is_online }), { status: 200 });
  } catch (error) {
    console.error('Error updating online status:', error);
    return new NextResponse('Failed to update status', { status: 500 });
  }
}
