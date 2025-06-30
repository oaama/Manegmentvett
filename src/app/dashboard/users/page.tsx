
import { DashboardHeader } from "@/components/dashboard-header"
import { UserClientPage } from "./components/client-page"
import { AddUserDialog } from "./components/add-user-dialog"
import type { User } from "@/lib/types"
import { serverFetch } from "@/lib/server-api"

async function getUsers(): Promise<User[]> {
    try {
        const response = await serverFetch('/admin/users');

        if (!response.ok) {
            const errorBody = await response.json().catch(() => response.text());
            console.error("API Error fetching users:", errorBody);
            return [];
        }

        const data = await response.json();
        return data.users || [];
    } catch (error: any) {
        console.error("Failed to fetch users:", error.message);
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
