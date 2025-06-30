
import { DashboardHeader } from "@/components/dashboard-header"
import { CarnetClientPage } from "./components/client-page"
import { CarnetStatusFilter } from "./components/carnet-status-filter"
import api from "@/lib/api"
import type { CarnetRequest, User } from "@/lib/types"
import { cookies } from "next/headers"

async function getCarnetRequests() {
    try {
        const token = cookies().get('auth_token')?.value;
        const response = await api.get('/api/admin/users', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const users: User[] = response.data.users || [];
        
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
    } catch (error) {
        console.error("Failed to fetch users for carnet requests:", error);
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
