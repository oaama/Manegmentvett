import { DashboardHeader } from "@/components/dashboard-header"
import { carnetRequests } from "@/lib/data"
import { CarnetClientPage } from "./components/client-page"

export default async function CarnetsPage() {
  const data = carnetRequests.filter(c => c.status === 'pending');

  return (
    <>
      <DashboardHeader title="Carnet Requests" />
      <div className="p-1">
        <CarnetClientPage data={data} />
      </div>
    </>
  )
}
