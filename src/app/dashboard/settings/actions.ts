
"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

const API_BASE_URL = 'https://mrvet-production.up.railway.app/api';

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
    const token = cookies().get('auth_token')?.value;
    const response = await fetch(`${API_BASE_URL}/admin/users/${_id}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
    });
    
    const responseData = await response.json();

    if (!response.ok) {
       return {
          success: false,
          message: responseData.msg || "Failed to update credentials. Please check your current password.",
       };
    }

    revalidatePath('/dashboard/settings');
    return { success: true, message: "Your credentials have been updated successfully." };

  } catch (error: any) {
    console.error("Failed to update credentials:", error);
    return {
      success: false,
      message: "An unexpected network error occurred.",
    };
  }
}
