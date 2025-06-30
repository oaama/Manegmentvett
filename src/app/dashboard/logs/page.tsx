
import { DashboardHeader } from "@/components/dashboard-header"
import { LogsClientPage } from "./components/client-page"
import type { ActivityLog } from "@/lib/types"
import { cookies } from "next/headers"

const API_BASE_URL = 'https://mrvet-production.up.railway.app/api';

async function getLogs(): Promise<ActivityLog[]> {
    try {
        const token = cookies().get('auth_token')?.value;
        if (!token) {
            console.error("Authentication token not found for getLogs.");
            return [];
        }

        const response = await fetch(`${API_BASE_URL}/admin/logs`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
        });

        if (!response.ok) {
            const errorBody = await response.json().catch(() => response.text());
            console.error("API Error fetching logs:", errorBody);
            return [];
        }
        const data = await response.json();
        return data.logs || data || [];
    } catch (error) {
        console.error("Failed to fetch activity logs:", error);
        return [];
    }
}


export default async function LogsPage() {
  const data = await getLogs()

  return (
    <>
      <DashboardHeader title="Activity Logs" />
      <div className="p-1">
        <LogsClientPage data={data} />
      </div>
    </>
  )
}
