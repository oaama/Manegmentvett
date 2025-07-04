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

  const token = (await cookies()).get('auth_token')?.value;

  // Create a new Headers object, selectively forwarding only necessary headers.
  // This prevents forwarding potentially problematic headers from the browser (like User-Agent, etc)
  // which might be causing the backend to reject the request.
  const headers = new Headers();
  
  // Forward essential headers only
  if (req.headers.get('Content-Type')) {
    headers.set('Content-Type', req.headers.get('Content-Type')!);
  }
  if (req.headers.get('Accept')) {
    headers.set('Accept', req.headers.get('Accept')!);
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
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
