"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

async function getApiUrl() {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!apiUrl) {
        throw new Error("The API base URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL in your .env file.");
    }
    return apiUrl;
}

export async function updateAdminCredentials(prevState: any, formData: FormData) {
  const _id = formData.get("_id") as string;
  const email = formData.get("email") as string;
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;

  if (!_id) {
    return { success: false, message: "User ID is missing. Cannot update credentials." };
  }

  if (!email || !currentPassword) {
    return { success: false, message: "Email and Current Password are required." };
  }

  const payload: { email: string, currentPassword: string, newPassword?: string } = {
    email,
    currentPassword,
  };

  if (newPassword) {
    payload.newPassword = newPassword;
  }

  try {
    const apiUrl = await getApiUrl();
    const token = (await cookies()).get('auth_token')?.value;
    if (!token) {
        return { success: false, message: "Authentication failed. Please log in again." };
    }
    const response = await fetch(`${apiUrl}/api/admin/users/${_id}`, {
        method: 'PUT',
        headers: { 
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
    });
    
    const responseData = await response.json();

    if (!response.ok) {
        throw new Error(responseData.msg || "Failed to update credentials.");
    }

    revalidatePath('/dashboard/settings');
    return { success: true, message: responseData.msg || "Your credentials have been updated successfully." };

  } catch (error: any) {
    console.error("Failed to update credentials:", error);
    return {
      success: false,
      message: error.message || "An unexpected error occurred.",
    };
  }
}
