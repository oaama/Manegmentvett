
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
        // The API returns the user object on successful login.
        // We must verify the user is an admin before creating the session.
        if (data.user && data.user.role === 'admin') {
            cookies().set("auth_token", data.token, {
                // httpOnly should be true for security. Server-side code can still access it.
                httpOnly: true, 
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 24 * 7, // 1 week
                path: "/",
            });
            loginSuccessful = true;
        } else {
             return {
                success: false,
                message: data.msg || "Login failed: You do not have administrator privileges.",
            }
        }
    } else {
        return {
            success: false,
            message: data.msg || `Login failed. Server responded with status ${response.status}.`,
        }
    }
  } catch(error) {
    console.error("--- LOGIN ACTION FAILED ---");
    console.error(error);
    return {
        success: false,
        message: "An unexpected error occurred. Please check your network connection.",
    };
  }
  
  if(loginSuccessful) {
    redirect('/dashboard');
  }
  
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
