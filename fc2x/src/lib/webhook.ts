import { NextRequest } from 'next/server';
import { createHmac } from 'crypto';
import axios from 'axios';
import { NEYNAR_API_BASE_URL, VERCEL_URL } from './constants';

export async function verifyWebhookSignature(req: NextRequest): Promise<any> {
  const body = await req.text();
  
  const sig = req.headers.get("X-Neynar-Signature");
  if (!sig) {
    throw new Error("Neynar signature missing from request headers");
  }

  const webhookSecret = process.env.NEYNAR_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error("Make sure you set NEYNAR_WEBHOOK_SECRET in your .env file");
  }

  const hmac = createHmac("sha512", webhookSecret);
  hmac.update(body);

  const generatedSignature = hmac.digest("hex");

  const isValid = generatedSignature === sig;
if (!isValid) {
    throw new Error("Invalid Neynar webhook signature");
  }
  return body
}

export async function updateNeynarWebhook(author_fids: (string | number)[]) {
  const webhookId = process.env.NEYNAR_WEBHOOK_ID;
  const neynarApiKey = process.env.NEYNAR_API_KEY;

  if (!webhookId || !neynarApiKey) {
    console.error('Neynar webhook ID or API key not set in environment variables');
    throw new Error('Neynar webhook ID or API key not set in environment variables');
  }

  const numericAuthorFids = author_fids.map(fid => typeof fid === 'string' ? parseInt(fid, 10) : fid);

  const subscription = {
    "cast.created": {
      author_fids: numericAuthorFids
    },
  };
  
  try {
    const response = await axios.put(
      `${NEYNAR_API_BASE_URL}/v2/farcaster/webhook`,
      {
        name: 'Neynar Twitter Cross-Post Webhook',
        webhook_id: webhookId,  
        subscription,
        url: `${process.env.NEXT_PUBLIC_VERCEL_URL ?? VERCEL_URL}/api/webhook`,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'api_key': `${neynarApiKey}`,
        },
      }
    );

  } catch (error: any) {
    console.log("Update neynar webhook error", error);
    console.error('Error updating Neynar webhook:', error.response?.data || error.message);
    throw new Error('Failed to update Neynar webhook');
  }
}