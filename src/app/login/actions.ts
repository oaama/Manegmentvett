
"use server"

import { cookies } from "next/headers"
import { redirect } from 'next/navigation'

export async function login(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  let loginSuccessful = false;

  try {
    const response = await fetch('https://mrvet-production.up.railway.app/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();

    if (response.ok && data.token) {
        cookies().set("auth_token", data.token, {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/",
        });
        loginSuccessful = true;
    } else {
        return {
            success: false,
            message: data.msg || `Login failed. Server responded with status ${response.status}.`,
        }
    }
  } catch(error) {
    console.error("--- LOGIN ACTION FAILED ---");
    console.error(error); // Log the full error object for debugging
    return {
        success: false,
        message: "An unexpected network error occurred. Please check your connection or contact support.",
    };
  }
  
  if(loginSuccessful) {
    redirect('/dashboard');
  }
  
  // This part should not be reached if login fails and returns, but as a fallback.
  return {
    success: false,
    message: "An unknown error occurred during login.",
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
