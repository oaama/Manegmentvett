
"use server"

import { cookies } from "next/headers"
import { redirect } from 'next/navigation'

export async function login(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const response = await fetch(
      'https://mrvet-production.up.railway.app/api/auth/login', 
      { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      }
    );
    
    const data = await response.json();

    if (!response.ok) {
        console.error("--- LOGIN ACTION FAILED ---");
        console.error("API Error Response:", JSON.stringify(data, null, 2));
        console.error("API Error Status:", response.status);
        return {
            success: false,
            message: `Login failed. The server responded with status ${response.status}: ${data.msg || 'Check credentials.'}.`,
        };
    }

    const token = data.token; 
    const msg = data.msg;

    if (token) {
        cookies().set("auth_token", token, {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/",
        });
        redirect('/dashboard');
    } else {
         return {
            success: false,
            message: msg || "Login successful, but no token was provided by the server.",
        }
    }
  } catch(error: any) {
    console.error("--- LOGIN ACTION FAILED ---");
    console.error('Error during request setup:', error.message);
    return {
        success: false,
        message: "An unexpected error occurred. Please check your network connection.",
    };
  }
}

export async function logout() {
  try {
    const token = cookies().get('auth_token')?.value;
    if (token) {
        await fetch('https://mrvet-production.up.railway.app/api/auth/logout', {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    }
  } catch (error) {
    console.error("Backend logout failed, proceeding with client-side logout:", error);
  } finally {
    cookies().delete('auth_token');
    redirect('/login');
  }
}
