"use server"

import { cookies } from "next/headers"

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
    return {
      success: true,
      message: "Login successful",
    }
  }

  return {
    success: false,
    message: "Invalid email or password",
  }
}
