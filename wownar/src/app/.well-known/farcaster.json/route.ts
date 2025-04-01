import { NextResponse } from 'next/server';

const appUrl = process.env.NEXT_PUBLIC_URL;

const config = {
  "accountAssociation": {
    "header": "eyJmaWQiOjE1NjgsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHhiMkUyMDZGMTU0MDcxYmFDMjlDMzVENzcyNjU2MDBlYkNhMzhBMjgxIn0",
    "payload": "eyJkb21haW4iOiJkZW1vLm5leW5hci5jb20ifQ",
    "signature": "MHg2ZTA1M2YwNzViODVjY2UwMDQxNmMzYWQwZGQ0NzQ2ZGNhMTM3OWUxYmE4OTI1OGFjMjFjYWFkMTc1MDMzYzMxMzk1NzU2YzBjYjNmMGU0MzZmOWRmZTYyYjNkMjcwYWZmYzg3ZDZlYmQ2YmMyMmUyMGZkYTc1ZjU5YzhmNjMxZDFi"
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
}

export async function GET() {
  try {
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error generating metadata:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
