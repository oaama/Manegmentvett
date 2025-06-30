import { DashboardHeader } from "@/components/dashboard-header"
import { LogsClientPage } from "./components/client-page"
import type { ActivityLog } from "@/lib/types"

async function getLogs(): Promise<ActivityLog[]> {
    // NOTE: The provided swagger specification does not include an endpoint for fetching admin activity logs (e.g., /admin/logs).
    // This feature cannot be implemented without a corresponding backend API.
    // Returning empty data to prevent application crashes.
    console.warn("Feature Sidelined: The API for fetching activity logs is not available in the swagger specification. The 'Activity Logs' table will be empty.");
    return [];
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
