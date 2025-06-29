import { DashboardHeader } from "@/components/dashboard-header"
import { activityLogs } from "@/lib/data"
import { LogsClientPage } from "./components/client-page"

export default async function LogsPage() {
  const data = activityLogs

  return (
    <>
      <DashboardHeader title="Activity Logs" />
      <div className="p-1">
        <LogsClientPage data={data} />
      </div>
    </>
  )
}
