
"use server"

import api from "@/lib/api"
import { cookies } from "next/headers"
import { redirect } from 'next/navigation'

export async function login(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const response = await api.post('/auth/login', { email, password });
    
    const token = response.data.token; 

    if (token) {
        cookies().set("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/",
        });
        redirect('/dashboard');
    } else {
         return {
            success: false,
            message: "Login successful, but no token received.",
        }
    }
  } catch(error: any) {
    console.error("Login failed:", error.message);
    
    // Check if it's a network error vs. a bad credentials error from the server
    if (error.response) {
      // The server responded with an error (e.g., 401 Unauthorized)
      return {
        success: false,
        message: error.response.data?.message || "Invalid email or password.",
      };
    } else {
      // A network error occurred (e.g., server not running, wrong URL)
      return {
        success: false,
        message: "Could not connect to the server. Please check the API URL and ensure the server is running.",
      };
    }
  }
}

export async function logout() {
  try {
    const token = cookies().get('auth_token')?.value;
    if (token) {
        await api.post('/auth/logout', {}, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    }
  } catch (error) {
    console.error("Backend logout failed, proceeding with client-side logout:", error);
  } finally {
    cookies().delete('auth_token');
    redirect('/login');
  }
}
