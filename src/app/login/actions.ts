
"use server"

import api from "@/lib/api"
import { cookies } from "next/headers"
import { redirect } from 'next/navigation'

export async function login(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const response = await api.post('/api/auth/login', { email, password });
    
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
            message: "Login successful, but no token was provided by the server.",
        }
    }
  } catch(error: any) {
    console.error("--- LOGIN ACTION FAILED ---");
    if (error.response) {
      console.error("API Error Response:", JSON.stringify(error.response.data, null, 2));
      console.error("API Error Status:", error.response.status);
      return {
        success: false,
        message: `Login failed. The server responded with status ${error.response.status}: ${error.response.data.msg || 'Check credentials'}.`,
      };
    } else if (error.request) {
      console.error("API No Response. Is the server running at the specified URL?", error.config.url);
      return {
        success: false,
        message: "Could not connect to the server. Please check the API URL and ensure the server is running.",
      };
    } else {
      console.error('Error during request setup:', error.message);
       return {
        success: false,
        message: "An unexpected error occurred while preparing the login request.",
      };
    }
  }
}

export async function logout() {
  try {
    const token = cookies().get('auth_token')?.value;
    if (token) {
        await api.post('/api/auth/logout', {}, {
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
