import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import pool from '@/lib/db';
import { updateNeynarWebhook } from '@/lib/webhook';

export async function POST(request: NextRequest) {
  
  const twitterUserId = request.cookies.get('twitter_user_id')?.value;
  if (!twitterUserId) {
    console.error('Twitter user not authenticated');
    return NextResponse.json({ error: 'Twitter user not authenticated' }, { status: 401 });
  }

  const { fid } = await request.json();
  if (!fid) {
    console.error('Farcaster user not authenticated');
    return NextResponse.json({ error: 'Farcaster user not authenticated' }, { status: 401 });
  }

  try {
    const { rows: fcUserRows } = await pool.query('SELECT * FROM users WHERE fid = $1', [fid]);
    const { rows: twitterUserRows } = await pool.query('SELECT * FROM users WHERE twitter_user_id = $1', [twitterUserId]);

    // if the FID is already linked to the twitterUserId, return this object 
    if (twitterUserRows.length > 0 && twitterUserRows[0].fid !== null) {
      console.error('Fid already linked');
      return NextResponse.json({ message: "fid already linked" }, { status: 200 });
    }

    // if this FID is already linked to *another row in the table*, delete this current row and merge its contents with the existing row
    if(fcUserRows.length > 0 && fcUserRows[0].fid !== null){
      await pool.query('DELETE FROM users WHERE id = $1', [twitterUserRows[0].id]);
      await pool.query(
        'UPDATE users SET twitter_user_id = $1, profile_image_url = $2, twitter_access_token = $3, twitter_oauth_token = $4, twitter_oauth_token_secret = $5, twitter_username = $6 WHERE fid = $7 AND id = $8',
        [
          twitterUserId,
          twitterUserRows[0].profile_image_url,
          twitterUserRows[0].twitter_access_token,
          twitterUserRows[0].twitter_oauth_token,
          twitterUserRows[0].twitter_oauth_token_secret,
          twitterUserRows[0].twitter_username,
          fid,
          fcUserRows[0].id
        ]
      );
    } else{
      await pool.query(
        'UPDATE users SET fid = $1 WHERE twitter_user_id = $2',
        [fid, twitterUserId]
      );
    }

    const { rows } = await pool.query('SELECT fid FROM users WHERE fid IS NOT NULL AND twitter_user_id IS NOT NULL');
    const authorFids = Array.from(new Set(rows.map((row: { fid: number }) => row.fid)));
    
    await updateNeynarWebhook(authorFids);

    return NextResponse.json({ message: 'Fid linked successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error linking fid:', error);
    return NextResponse.json({ error: 'Error linking fid' }, { status: 500 });
  }
}