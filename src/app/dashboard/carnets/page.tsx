import { DashboardHeader } from "@/components/dashboard-header"
import { CarnetClientPage } from "./components/client-page"
import { CarnetStatusFilter } from "./components/carnet-status-filter"
import api from "@/lib/api"
import type { CarnetRequest, User } from "@/lib/types"

async function getCarnetRequests() {
    try {
        const response = await api.get('/admin/users');
        const users: User[] = response.data.users || [];
        
        // Transform user data into carnet requests, similar to the mock data structure
        const requests: CarnetRequest[] = users
          .filter(u => u.role === 'student' && u.carnetStatus)
          .map(u => ({
            id: u.id,
            user: { id: u.id, name: u.name, email: u.email, academicYear: u.academicYear },
            carnetImage: u.carnetImage || 'https://placehold.co/400x250.png',
            status: u.carnetStatus,
            rejectionReason: u.rejectionReason,
            requestedAt: u.createdAt,
          }));
          
        return requests;
    } catch (error) {
        console.error("Failed to fetch users for carnet requests:", error);
        return []; // Return empty array on error
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
    : allRequests.filter(c => c.status === status);

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
