'use server';

import {NextRequest, NextResponse} from 'next/server';
import {cookies} from 'next/headers';

async function handler(req: NextRequest) {
  const path = req.nextUrl.pathname.replace('/api', '');
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiUrl) {
    return NextResponse.json(
      { message: "API route is not configured. Please set NEXT_PUBLIC_API_BASE_URL in your .env file." },
      { status: 500 }
    );
  }

  const url = new URL(path, apiUrl);

  // Copy search params
  req.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.append(key, value);
  });

  const token = cookies().get('auth_token')?.value;

  const headers = new Headers(req.headers);
  headers.set('Host', url.host);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  // To prevent loops and other issues
  headers.delete('x-forwarded-host');
  headers.delete('x-forwarded-port');
  headers.delete('x-forwarded-proto');
  headers.delete('cookie'); // Don't forward browser cookies
  
  try {
    const response = await fetch(url.toString(), {
      method: req.method,
      headers: headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
      // @ts-ignore
      duplex: 'half',
      cache: 'no-store',
    });

    return response;

  } catch (error) {
    console.error(`API proxy error for path ${path}:`, error);
    return NextResponse.json(
      { message: 'Error proxying to API' },
      { status: 500 }
    );
  }
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE, handler as PATCH };
