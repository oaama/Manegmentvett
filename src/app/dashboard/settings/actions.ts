"use server"

import api from "@/lib/api"
import { revalidatePath } from "next/cache"

export async function updateAdminCredentials(prevState: any, formData: FormData) {
  const id = formData.get("id") as string;
  const email = formData.get("email") as string;
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;

  if (!id) {
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
    // Using the endpoint provided by the user
    await api.put(`/admin/users/${id}`, payload);

    revalidatePath('/dashboard/settings');
    return { success: true, message: "Your credentials have been updated successfully." };

  } catch (error: any) {
    console.error("Failed to update credentials:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update credentials. Please check your current password.",
    };
  }
}
