
import { DashboardHeader } from "@/components/dashboard-header"
import { LogsClientPage } from "./components/client-page"
import type { ActivityLog } from "@/lib/types"
import { serverFetch } from "@/lib/server-api"

export const dynamic = "force-dynamic";

async function getLogs(): Promise<ActivityLog[]> {
    try {
        const response = await serverFetch('/admin/logs');

        if (!response.ok) {
            const errorBody = await response.json().catch(() => response.text());
            console.error("API Error fetching logs:", errorBody);
            return [];
        }
        const data = await response.json();
        return data.logs || data || [];
    } catch (error: any) {
        console.error("Failed to fetch activity logs:", error.message);
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
