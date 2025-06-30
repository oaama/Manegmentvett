
import { DashboardHeader } from "@/components/dashboard-header"
import { LogsClientPage } from "./components/client-page"
import type { ActivityLog } from "@/lib/types"
import api from "@/lib/api"
import { cookies } from "next/headers"

async function getLogs(): Promise<ActivityLog[]> {
    try {
        const token = cookies().get('auth_token')?.value;
        const response = await api.get('/api/admin/logs', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.logs || response.data || [];
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
