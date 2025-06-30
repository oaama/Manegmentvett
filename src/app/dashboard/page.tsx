
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
    try {
        const token = cookies().get('auth_token')?.value;
        if (!token) {
            console.error("Authentication token not found in server component for getStats.");
            return mockStats;
        }
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/admin/stats`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            const errorBody = await response.json().catch(() => response.text());
            console.error(`API Error fetching stats. Status: ${response.status}`, errorBody);
            return mockStats;
        }
        
        return await response.json();

    } catch (error: any) {
        console.error("Fatal error fetching dashboard stats on server:", error.message);
        console.warn("Dashboard is falling back to mock data due to API connection failure.");
        return mockStats;
    }
}


export default async function DashboardPage() {
    const stats = await getStats();

    return <DashboardClientPage initialStats={stats} />;
}
