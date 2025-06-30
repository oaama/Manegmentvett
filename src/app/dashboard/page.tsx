
import { cookies } from "next/headers";
import { DashboardClientPage, type Stats } from "./components/client-page";
import api from "@/lib/api";

const mockStats: Stats = {
    totalUsers: 8,
    totalCourses: 5,
    carnetRequests: {
        total: 4,
        pending: 2,
        approved: 1,
        rejected: 1,
    },
    rolesCount: {
        student: 5,
        instructor: 2,
        admin: 1,
    },
    totalSections: 65,
};

async function getStats(): Promise<Stats> {
    try {
        const token = cookies().get('auth_token')?.value;
        if (!token) {
            throw new Error("Authentication token not found in server component.");
        }
        
        const response = await api.get('/admin/stats', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        
        return response.data;

    } catch (error: any) {
        console.error("Failed to fetch dashboard stats on server:", error.response?.data?.message || error.message);
        console.warn("Dashboard is falling back to mock data due to API connection failure.");
        return mockStats;
    }
}


export default async function DashboardPage() {
    const stats = await getStats();

    return <DashboardClientPage initialStats={stats} />;
}
