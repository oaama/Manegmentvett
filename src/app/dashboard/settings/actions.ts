
"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import api from "@/lib/api";

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
    const response = await api.put(`/admin/users/${_id}`, payload, {
        headers: { 
            'Authorization': `Bearer ${token}` 
        },
    });
    
    revalidatePath('/dashboard/settings');
    return { success: true, message: response.data.msg || "Your credentials have been updated successfully." };

  } catch (error: any) {
    console.error("Failed to update credentials:", error);
    return {
      success: false,
      message: error.response?.data?.msg || "An unexpected error occurred.",
    };
  }
}
