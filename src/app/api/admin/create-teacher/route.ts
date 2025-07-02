import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiUrl) {
    return NextResponse.json({ message: 'API base URL not configured.' }, { status: 500 });
  }

  const token = cookies().get('auth_token')?.value;
  const formData = await req.formData();

  // Forward the form data to the backend
  const response = await fetch(`${apiUrl}/api/admin/create-teacher`, {
    method: 'POST',
    headers: {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}
