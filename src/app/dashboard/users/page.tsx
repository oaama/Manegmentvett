
import { DashboardHeader } from "@/components/dashboard-header"
import { UserClientPage } from "./components/client-page"
import { AddUserDialog } from "./components/add-user-dialog"
import api from "@/lib/api"
import type { User } from "@/lib/types"
import { cookies } from "next/headers"

async function getUsers() {
    try {
        const token = cookies().get('auth_token')?.value;
        const response = await api.get('/admin/users', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.users || [];
    } catch (error) {
        console.error("Failed to fetch users:", error);
        return []; // Return empty array on error
    }
}

export default async function UsersPage() {
  const data: User[] = await getUsers();

  return (
    <>
      <DashboardHeader title="Users Management">
        <AddUserDialog />
      </DashboardHeader>
      <div className="p-1">
        <UserClientPage data={data} />
      </div>
    </>
  )
}
