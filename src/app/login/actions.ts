
"use server"

import { cookies } from "next/headers"
import { redirect } from 'next/navigation'
import axios from "axios"

export async function login(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const response = await axios.post(
      'https://mrvet-production.up.railway.app/api/auth/login', 
      { email, password },
      { headers: { 'Content-Type': 'application/json' } }
    );
    
    const data = response.data;

    if (data.token) {
        cookies().set("auth_token", data.token, {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/",
        });
        redirect('/dashboard');
    } else {
         return {
            success: false,
            message: data.msg || "Login successful, but no token was provided by the server.",
        }
    }
  } catch(error: any) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("--- LOGIN ACTION FAILED (axios) ---");
      console.error("Response Data:", JSON.stringify(error.response.data, null, 2));
      console.error("Response Status:", error.response.status);
      return {
          success: false,
          message: `Login failed. The server responded with status ${error.response.status}: ${error.response.data.msg || 'Check credentials.'}.`,
      };
    } else if (error.request) {
      // The request was made but no response was received
      console.error("--- LOGIN ACTION FAILED (axios) ---");
      console.error("No response received:", error.request);
       return {
          success: false,
          message: "The server did not respond. Please check your network connection.",
      };
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("--- LOGIN ACTION FAILED (axios) ---");
      console.error('Error setting up request:', error.message);
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
        await axios.post('https://mrvet-production.up.railway.app/api/auth/logout', {}, {
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
