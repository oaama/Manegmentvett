
import { cookies } from "next/headers";
import { DashboardClientPage, type Stats } from "./components/client-page";

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
    const API_BASE_URL = 'https://mrvet-production.up.railway.app/api';
    try {
        const token = cookies().get('auth_token')?.value;
        if (!token) {
            throw new Error("Authentication token not found in server component.");
        }
        
        const response = await fetch(`${API_BASE_URL}/admin/stats`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            cache: 'no-store', // Ensure fresh data on every request
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(errorBody.message || `Request failed with status ${response.status}`);
        }
        
        return await response.json();

    } catch (error: any) {
        console.error("Failed to fetch dashboard stats on server:", error.message);
        console.warn("Dashboard is falling back to mock data due to API connection failure.");
        return mockStats;
    }
}


export default async function DashboardPage() {
    const stats = await getStats();

    return <DashboardClientPage initialStats={stats} />;
}
