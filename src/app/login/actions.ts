"use server"

import { cookies } from "next/headers"
import { redirect } from 'next/navigation'

export async function login(prevState: any, formData: FormData) {
  const email = formData.get("email")
  const password = formData.get("password")

  // Hardcoded credentials for demonstration
  if (email === "admin@elearn.com" && password === "admin123") {
    cookies().set("auth_token", "mock_jwt_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })
    redirect('/dashboard')
  }

  return {
    success: false,
    message: "Invalid email or password",
  }
}

export async function logout() {
  cookies().delete('auth_token');
  redirect('/login');
}
