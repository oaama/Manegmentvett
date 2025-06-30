
import { cookies } from "next/headers";
import { DashboardHeader } from '@/components/dashboard-header';
import { DashboardClientPage, type Stats } from "./components/client-page";

const API_BASE_URL = 'https://mrvet-production.up.railway.app/api';

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
        
        const response = await fetch(`${API_BASE_URL}/admin/stats`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            cache: 'no-store', 
        });

        if (!response.ok) {
            throw new Error(`Request failed on server with status ${response.status}`);
        }
        
        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Failed to fetch dashboard stats on server:", error);
        console.warn("Dashboard is falling back to mock data due to API connection failure.");
        return mockStats;
    }
}


export default async function DashboardPage() {
    const stats = await getStats();

    return <DashboardClientPage initialStats={stats} />;
}
