import { DashboardHeader } from "@/components/dashboard-header"
import { carnetRequests } from "@/lib/data"
import { CarnetClientPage } from "./components/client-page"
import { CarnetStatusFilter } from "./components/carnet-status-filter"

type CarnetsPageProps = {
  searchParams: {
    status?: 'pending' | 'approved' | 'rejected' | 'all';
  }
}

export default async function CarnetsPage({ searchParams }: CarnetsPageProps) {
  const status = searchParams.status || 'pending';
  
  const data = status === 'all'
    ? carnetRequests
    : carnetRequests.filter(c => c.status === status);

  return (
    <>
      <DashboardHeader title="Carnet Requests">
        <CarnetStatusFilter />
      </DashboardHeader>
      <div className="p-1">
        <CarnetClientPage data={data} />
      </div>
    </>
  )
}
