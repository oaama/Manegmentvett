
import { DashboardHeader } from "@/components/dashboard-header"
import { CarnetClientPage } from "./components/client-page"
import { CarnetStatusFilter } from "./components/carnet-status-filter"
import type { CarnetRequest, User } from "@/lib/types"
import { serverFetch } from "@/lib/server-api"

export const dynamic = "force-dynamic";

async function getCarnetRequests(): Promise<CarnetRequest[]> {
    try {
        const response = await serverFetch('/admin/users');
        
        if (!response.ok) {
            const errorBody = await response.json().catch(() => response.text());
            console.error("API Error fetching users for carnets:", errorBody);
            return [];
        }

        const data = await response.json();
        const users: User[] = data.users || [];
        
        const requests: CarnetRequest[] = users
          .filter(u => u.role === 'student' && u.carnetStatus)
          .map(u => ({
            _id: u._id,
            user: { _id: u._id, name: u.name, email: u.email, academicYear: u.academicYear },
            carnetImage: u.carnetImage || 'https://placehold.co/400x250.png',
            status: u.carnetStatus,
            rejectionReason: u.rejectionReason,
            requestedAt: u.createdAt,
          }));
          
        return requests;
    } catch (error: any) {
        console.error("Failed to fetch and process carnet requests:", error.message);
        return [];
    }
}

type CarnetsPageProps = {
  searchParams: {
    status?: 'pending' | 'approved' | 'rejected' | 'all';
  }
}

export default async function CarnetsPage({ searchParams }: CarnetsPageProps) {
  const status = searchParams.status || 'pending';
  const allRequests = await getCarnetRequests();
  
  const data = status === 'all'
    ? allRequests
    : allRequests.filter(c => (c.status || '').toLowerCase().trim() === status);

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
