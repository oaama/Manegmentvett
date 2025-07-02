import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// إضافة اشتراك جديد (POST)
export async function POST(req: NextRequest) {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiUrl) {
    return NextResponse.json({ message: 'API base URL not configured.' }, { status: 500 });
  }
  const token = cookies().get('auth_token')?.value;
  const body = await req.json();

  const response = await fetch(`${apiUrl}/api/admin/subscriptions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}

// حذف اشتراك (DELETE)
export async function DELETE(req: NextRequest) {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiUrl) {
    return NextResponse.json({ message: 'API base URL not configured.' }, { status: 500 });
  }
  const token = cookies().get('auth_token')?.value;
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ message: 'Subscription ID is required.' }, { status: 400 });
  }
  const response = await fetch(`${apiUrl}/api/admin/subscriptions/${id}`, {
    method: 'DELETE',
    headers: {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
  });
  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}
