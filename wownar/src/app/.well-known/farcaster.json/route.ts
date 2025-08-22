import { NextResponse } from 'next/server';

const appUrl = process.env.NEXT_PUBLIC_URL;

const config = {
  "accountAssociation": {
    "header": "eyJmaWQiOjU0OTEzOSwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDIxRDgyMkQ4QkUwNERGRTYwN0FmMTY3MzE5OTZBYzBGZmI5M0QxY2EifQ",
    "payload": "eyJkb21haW4iOiJkZW1vLm5leW5hci5jb20ifQ",
    "signature": "MHg3MzIwNmEwOGI5ZWMyMjUzODY5ZWUyNjNlZDE0NjA0N2I4Njc1YTVhMTAxNzZmYWI5OTE5OTU2MjBmYmQ0NWIyN2JjYTZmZjU5ZTk0MGY1MWY3M2Y2ZmUwYjlmZDU2YjRjMmE2Y2VjOTBiYWJlN2U2MTg2YjQ5NjNkYTMyZWNjYjFj"
  },
  "miniapp": {
    "name": "Wownar",
    "version": "1",
    "iconUrl": `${appUrl}/logos/neynar.svg`,
    "homeUrl": `${appUrl}`,
    "imageUrl": `${appUrl}/logos/powered-by-neynar.png`,
    "buttonTitle": "Launch Wownar",
    "splashImageUrl": `${appUrl}/logos/powered-by-neynar.png`,
    "splashBackgroundColor": "#000000",
    "webhookUrl": "https://api.neynar.com/f/app/a1092b41-629f-45e0-b196-b3ff3a8f193f/event"
  }
};

export async function GET() {
  try {
    return NextResponse.json(config);
  } catch (error: unknown) {
    console.error('Error generating metadata:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
