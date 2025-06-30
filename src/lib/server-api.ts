import { cookies } from "next/headers";

function getApiUrl() {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!apiUrl) {
        throw new Error("The API base URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL in your .env file.");
    }
    return apiUrl;
}

export async function serverFetch(path: string, options: RequestInit = {}) {
    const apiUrl = getApiUrl();
    const token = cookies().get('auth_token')?.value;

    const headers = new Headers(options.headers);
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }
    if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }
    if (!headers.has('Accept')) {
        headers.set('Accept', 'application/json');
    }
    
    const url = `${apiUrl}${path}`;
    
    return fetch(url, {
        ...options,
        headers,
        cache: 'no-store',
    });
}
