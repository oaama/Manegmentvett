
import { DashboardClientPage } from "./components/client-page";
import type { Stats } from "./components/client-page";
import { serverFetch } from '@/lib/server-api';

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


// جلب الإحصائيات من بيانات حقيقية (users, courses, carnets)

async function getStats(): Promise<Stats> {
    try {
        // جلب كل المستخدمين
        const usersRes = await serverFetch('/users');
        const usersData = await usersRes.json();
        const users = usersData.users || [];
        // جلب كل الكورسات
        const coursesRes = await serverFetch('/api/courses');
        const coursesData = await coursesRes.json();
        const courses = coursesData.courses || coursesData || [];
        // جلب كل طلبات الكارنيهات (لو فيه endpoint)
        let carnetRequests: any[] = [];
        try {
            const carnetRes = await serverFetch('/api/carnets');
            const carnetData = await carnetRes.json();
            carnetRequests = carnetData.carnets || carnetData || [];
        } catch {}
        // حساب الإحصائيات
        const rolesCount = { student: 0, instructor: 0, admin: 0 };
        users.forEach((u: any) => {
            if (u.role === 'student') rolesCount.student++;
            else if (u.role === 'teacher' || u.role === 'instructor') rolesCount.instructor++;
            else if (u.role === 'admin') rolesCount.admin++;
        });
        const carnetStats = { total: 0, pending: 0, approved: 0, rejected: 0 };
        carnetStats.total = carnetRequests.length;
        carnetRequests.forEach((c: any) => {
            if (c.status === 'pending') carnetStats.pending++;
            else if (c.status === 'approved') carnetStats.approved++;
            else if (c.status === 'rejected') carnetStats.rejected++;
        });
        // حساب عدد السيكشنات
        let totalSections = 0;
        courses.forEach((c: any) => {
            if (Array.isArray(c.sections)) totalSections += c.sections.length;
            else if (typeof c.sections === 'number') totalSections += c.sections;
        });
        return {
            totalUsers: users.length,
            totalCourses: courses.length,
            carnetRequests: carnetStats,
            rolesCount,
            totalSections,
        };
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
