
import { DashboardHeader } from "@/components/dashboard-header"
import { UserClientPage } from "./components/client-page"
import { AddUserDialog } from "./components/add-user-dialog"
import type { User } from "@/lib/types"
import { cookies } from "next/headers"

const API_BASE_URL = 'https://mrvet-production.up.railway.app/api';

async function getUsers(): Promise<User[]> {
    try {
        const token = cookies().get('auth_token')?.value;
        if (!token) return [];

        const response = await fetch(`${API_BASE_URL}/admin/users`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
        });

        if (!response.ok) {
            const errorBody = await response.json().catch(() => response.text());
            console.error("API Error fetching users:", errorBody);
            throw new Error(`Failed to fetch users. Status: ${response.status}`);
        }

        const data = await response.json();
        return data.users || [];
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
