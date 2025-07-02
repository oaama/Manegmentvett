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
        let data: any = null;
        try {
            data = await response.json();
        } catch {
            data = null;
        }
        if (response.ok && data) {
            return {
                totalUsers: data.totalUsers ?? 0,
                totalCourses: data.totalCourses ?? 0,
                carnetRequests: {
                    total: data.carnetRequests?.total ?? 0,
                    pending: data.carnetRequests?.pending ?? 0,
                    approved: data.carnetRequests?.approved ?? 0,
                    rejected: data.carnetRequests?.rejected ?? 0,
                },
                rolesCount: {
                    student: data.rolesCount?.student ?? 0,
                    instructor: data.rolesCount?.instructor ?? 0,
                    admin: data.rolesCount?.admin ?? 0,
                },
                totalSections: data.totalSections ?? 0,
            };
        } else {
            console.error(`API Error fetching stats. Status: ${response.status}`, data);
            return {
                totalUsers: 0,
                totalCourses: 0,
                carnetRequests: { total: 0, pending: 0, approved: 0, rejected: 0 },
                rolesCount: { student: 0, instructor: 0, admin: 0 },
                totalSections: 0,
            };
        }
    } catch (error: any) {
        console.error("Fatal error fetching dashboard stats on server:", error.message);
        return {
            totalUsers: 0,
            totalCourses: 0,
            carnetRequests: { total: 0, pending: 0, approved: 0, rejected: 0 },
            rolesCount: { student: 0, instructor: 0, admin: 0 },
            totalSections: 0,
        };
    }
}


export default async function DashboardPage() {
    const stats = await getStats();
    if (
        stats.totalUsers === 0 &&
        stats.totalCourses === 0 &&
        stats.carnetRequests.total === 0 &&
        stats.rolesCount.student === 0 &&
        stats.rolesCount.instructor === 0 &&
        stats.rolesCount.admin === 0 &&
        stats.totalSections === 0
    ) {
        return <div className="p-8 text-center text-destructive">تعذر تحميل إحصائيات الداشبورد من السيرفر. تأكد من اتصال الباك اند أو صلاحيات الدخول.</div>;
    }
    return <DashboardClientPage initialStats={stats} />;
}
