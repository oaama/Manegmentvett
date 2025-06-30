import { DashboardHeader } from "@/components/dashboard-header"
import { LogsClientPage } from "./components/client-page"
import api from "@/lib/api"
import type { ActivityLog } from "@/lib/types"
import { cookies } from "next/headers"

async function getLogs(): Promise<ActivityLog[]> {
    try {
        const token = cookies().get('auth_token')?.value;
        // NOTE: This assumes an endpoint /admin/logs exists to fetch activity logs.
        const response = await api.get('/admin/logs', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.logs || [];
    } catch (error) {
        console.error("Failed to fetch activity logs. The API endpoint might not exist.", error);
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
