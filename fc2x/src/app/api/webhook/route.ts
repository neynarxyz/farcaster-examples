import { NextRequest, NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';
import pool from '@/lib/db';
import axios from 'axios';
import { verifyWebhookSignature } from '@/lib/webhook';

export async function POST(request: NextRequest) {
  try {
    const body = await verifyWebhookSignature(request);
    const payload = JSON.parse(body);
    const type = payload.type;
    const data = payload.data;

    if (type !== 'cast.created' || !data) {
      console.error('Invalid webhook payload:', payload);
      return new NextResponse('Invalid webhook payload', { status: 400 });
    }

    const text = data.text || '';
    const linkEmbeds = (data.embeds || []).map((embed: any) => embed.url).filter((url: string) => url);
    const castEmbeds = (data.embeds || [])
      .filter((embed: any) => embed.cast_id && 
        typeof embed.cast_id.fid === 'number' && 
        embed.cast_id.hash && 
        embed.cast_id.hash.length > 1 && 
        embed.cast_id.hash.startsWith('0x'))
      .map((embed: any) => `https://client.warpcast.com/v2/cast-image?castHash=${embed.cast_id.hash}`);

    const embeds = castEmbeds.concat(linkEmbeds);

    const fid = data.author?.fid;
    const parent_hash = data.parent_hash;

    if (parent_hash !== null) {
      return new NextResponse('Parent hash is not null', { status: 400 });
    }

    if (!fid) {
      return new NextResponse('Farcaster user ID (fid) not found in payload', { status: 400 });
    }

    const { rows } = await pool.query(
      'SELECT is_online, twitter_access_token, twitter_access_token_secret FROM users WHERE fid = $1',
      [fid]
    );

    if (rows.length === 0) {
      return new NextResponse('No linked Twitter account for this Farcaster user', { status: 404 });
    }

    const { is_online, twitter_access_token, twitter_access_token_secret } = rows[0];

    console.log("is online?", is_online);
    if(!is_online){
      return new NextResponse('User is not online', { status: 401 })
    }

    if (!twitter_access_token || !twitter_access_token_secret) {
      console.error('Twitter OAuth 1.0a tokens not found:', { twitter_access_token, twitter_access_token_secret });
      return new NextResponse('Twitter OAuth 1.0a tokens not found', { status: 401 });
    }

    const client = new TwitterApi({
      appKey: process.env.TWITTER_CONSUMER_KEY!,
      appSecret: process.env.TWITTER_CONSUMER_SECRET!,
      accessToken: twitter_access_token,
      accessSecret: twitter_access_token_secret
    });

    console.log('raw cast text before process', text);

    let tweetContent = text;
    const maxTweetLength = 280;
    let warpcastUrl = '';

    if (tweetContent.length > maxTweetLength) {
        tweetContent = tweetContent.substring(0, maxTweetLength - 3) + '...';
    }

    let mediaIds: string[] = [];
    if (embeds.length > 0) {
      for (const embedUrl of embeds) {
        try {
          const response = await axios.get(embedUrl, { responseType: 'arraybuffer' });
          const mediaType = response.headers['content-type'];
          const mediaId = await client.v1.uploadMedia(Buffer.from(response.data), {
            mimeType: mediaType,
          });
          mediaIds.push(mediaId);
          console.log('Uploaded media ID:', mediaId);
        } catch (error) {
          console.error('Error uploading media:', error);
        }
      }
    }

    const tweetParams: any = { text: tweetContent };
    if (mediaIds.length > 0) {
      tweetParams.media = {
          media_ids: mediaIds
      };
    }
    console.log('Tweet params:', tweetParams);

    const tweet = await client.v2.tweet(tweetContent, tweetParams)
    console.log('Tweet response:', tweet);

    return NextResponse.json({ message: 'Tweet posted successfully', tweet });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return new NextResponse('Error handling webhook', { status: 500 });
  }
}