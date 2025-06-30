
import { DashboardHeader } from "@/components/dashboard-header"
import { UserClientPage } from "./components/client-page"
import { AddUserDialog } from "./components/add-user-dialog"
import type { User } from "@/lib/types"
import { cookies } from "next/headers"
import api from "@/lib/api"

async function getUsers(): Promise<User[]> {
    try {
        const token = cookies().get('auth_token')?.value;
        if (!token) return [];

        const response = await api.get('/admin/users', {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data.users || [];
    } catch (error) {
        console.error("Failed to fetch users:", error);
        return [];
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
