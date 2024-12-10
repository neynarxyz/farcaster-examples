import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const response = new NextResponse('Logged out');
  response.cookies.set({
    name: 'twitter_user_id',
    value: '',
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 0,
  });
  return response;
}
