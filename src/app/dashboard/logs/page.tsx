import { DashboardHeader } from "@/components/dashboard-header"
import { LogsClientPage } from "./components/client-page"
import type { ActivityLog } from "@/lib/types"
import api from "@/lib/api"
import { cookies } from "next/headers"

async function getLogs(): Promise<ActivityLog[]> {
    try {
        const token = cookies().get('auth_token')?.value;
        const response = await api.get('/admin/logs', {
            headers: { Authorization: `Bearer ${token}` }
        });
        // The API might return { logs: [...] } or just an array [...]
        return response.data.logs || response.data || [];
    } catch (error) {
        console.error("Failed to fetch activity logs:", error);
        return []; // Return empty array on error
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
