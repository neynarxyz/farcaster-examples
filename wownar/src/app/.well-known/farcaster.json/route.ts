import { NextResponse } from 'next/server';

const appUrl = process.env.NEXT_PUBLIC_URL;

const config = {
  "accountAssociation": {
    "header": "eyJmaWQiOjE1NjgsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHhiMmUyMDZmMTU0MDcxYmFjMjljMzVkNzcyNjU2MDBlYmNhMzhhMjgxIn0",
    "payload": "eyJkb21haW4iOiJsb2NhbGhvc3Q6NDUwMCJ9",
    "signature": ""
  },
  "frame": {
    "name": "Wownar",
    "version": "1",
    "iconUrl": `${appUrl}/logos/neynar.svg`,
    "homeUrl": `${appUrl}`,
    "imageUrl": `${appUrl}/logos/powered-by-neynar.png`,
    "buttonTitle": "Launch Wownar",
    "splashImageUrl": `${appUrl}/logos/powered-by-neynar.png`,
    "splashBackgroundColor": "#000000",
    "webhookUrl": `${appUrl}/api/webhook`
  }
};

export async function GET() {
  try {
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error generating metadata:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
