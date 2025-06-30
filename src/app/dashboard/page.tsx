
import { DashboardClientPage, type Stats } from "./components/client-page";
import { serverFetch } from "@/lib/server-api";

export const dynamic = "force-dynamic";

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
        const response = await serverFetch('/admin/stats');

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
