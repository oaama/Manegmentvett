"use server"

import api from "@/lib/api"
import { cookies } from "next/headers"
import { redirect } from 'next/navigation'

export async function login(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const response = await api.post('/auth/login', { email, password });
    
    // Assuming the token is in response.data.token
    const token = response.data.token; 

    if (token) {
        cookies().set("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/",
        });
        // Redirect is handled in middleware and client-side, but for server action we can force it
        redirect('/dashboard');
    } else {
         return {
            success: false,
            message: "Login successful, but no token received.",
        }
    }
  } catch(error: any) {
    console.error("Login failed:", error);
    const errorMessage = error.response?.data?.message || "Invalid email or password";
    return {
        success: false,
        message: errorMessage,
    }
  }
}

export async function logout() {
  try {
     // Notify the backend about the logout
    const token = cookies().get('auth_token')?.value;
    if (token) {
        await api.post('/auth/logout', {}, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    }
  } catch (error) {
    console.error("Backend logout failed, proceeding with client-side logout:", error);
  } finally {
    // Always clear the cookie and redirect
    cookies().delete('auth_token');
    redirect('/login');
  }
}
