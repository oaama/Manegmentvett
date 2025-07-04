
"use client"

import * as React from 'react';
import { DashboardHeader } from '@/components/dashboard-header';
import { StatCard } from '@/components/stat-card';
import { Users, Book, CreditCard, Library } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

export type Stats = {
  totalUsers: number;
  totalCourses: number;
  carnetRequests: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  rolesCount: {
    student: number;
    instructor: number;
    admin: number;
  };
  totalSections: number;
}

type DashboardClientPageProps = {
    initialStats: Stats | null;
}

import api from '@/lib/api';

export function DashboardClientPage({ initialStats }: DashboardClientPageProps) {
  const [stats, setStats] = React.useState<Stats | null>(initialStats);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        // جلب كل المستخدمين
        const usersRes = await api.get('/users');
        const users = usersRes.data.users || [];
        // جلب كل الكورسات
        const coursesRes = await api.get('/api/courses');
        const courses = coursesRes.data.courses || coursesRes.data || [];
        // جلب كل طلبات الكارنيهات (لو فيه endpoint)
        let carnetRequests: any[] = [];
        try {
          const carnetRes = await api.get('/api/carnets');
          carnetRequests = carnetRes.data.carnets || carnetRes.data || [];
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
        setStats({
          totalUsers: users.length,
          totalCourses: courses.length,
          carnetRequests: carnetStats,
          rolesCount,
          totalSections,
        });
      } catch (err) {
        // fallback: لا تعدل stats
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  // Fallbacks for missing or malformed data
  const safeStats: Stats = {
    totalUsers: stats?.totalUsers ?? 0,
    totalCourses: stats?.totalCourses ?? 0,
    carnetRequests: {
      total: stats?.carnetRequests?.total ?? 0,
      pending: stats?.carnetRequests?.pending ?? 0,
      approved: stats?.carnetRequests?.approved ?? 0,
      rejected: stats?.carnetRequests?.rejected ?? 0,
    },
    rolesCount: {
      student: stats?.rolesCount?.student ?? 0,
      instructor: stats?.rolesCount?.instructor ?? 0,
      admin: stats?.rolesCount?.admin ?? 0,
    },
    totalSections: stats?.totalSections ?? 0,
  };

  const getPercentage = (part: number, total: number) => {
    if (total === 0) return 0;
    return (part / total) * 100;
  }

  if (!stats || loading) {
    return (
      <>
        <DashboardHeader title="Dashboard" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-6">
          <Skeleton className="lg:col-span-4 h-64" />
          <Skeleton className="lg:col-span-3 h-64" />
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader title="Dashboard" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          description={`${stats.rolesCount.student || 0} students, ${stats.rolesCount.instructor || 0} instructors`}
        />
        <StatCard
          title="Total Courses"
          value={stats.totalCourses}
          icon={Book}
          description="Across all academic years"
        />
        <StatCard
          title="Carnet Requests"
          value={stats.carnetRequests.total}
          icon={CreditCard}
          description={`${stats.carnetRequests.pending} pending`}
        />
        <StatCard
          title="Total Sections"
          value={stats.totalSections}
          icon={Library}
          description="In all available courses"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-6">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>User Roles Distribution</CardTitle>
            <CardDescription>A breakdown of user roles across the platform.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-2">
                <div className="flex justify-between text-sm font-medium">
                    <span>Students</span>
                    <span>{stats.rolesCount.student || 0} / {stats.totalUsers}</span>
                </div>
                <Progress value={getPercentage(stats.rolesCount.student, stats.totalUsers)} />
            </div>
             <div className="flex flex-col space-y-2">
                <div className="flex justify-between text-sm font-medium">
                    <span>Instructors</span>
                    <span>{stats.rolesCount.instructor || 0} / {stats.totalUsers}</span>
                </div>
                <Progress value={getPercentage(stats.rolesCount.instructor, stats.totalUsers)} />
            </div>
             <div className="flex flex-col space-y-2">
                <div className="flex justify-between text-sm font-medium">
                    <span>Admins</span>
                    <span>{stats.rolesCount.admin || 0} / {stats.totalUsers}</span>
                </div>
                <Progress value={getPercentage(stats.rolesCount.admin, stats.totalUsers)} />
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Carnet Status Overview</CardTitle>
            <CardDescription>Current status of all carnet requests.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-2">
                <div className="flex justify-between text-sm font-medium">
                    <span>Approved</span>
                    <span className="text-chart-2">{stats.carnetRequests.approved}</span>
                </div>
                <Progress value={getPercentage(stats.carnetRequests.approved, stats.carnetRequests.total)} className="[&>div]:bg-chart-2" />
            </div>
             <div className="flex flex-col space-y-2">
                <div className="flex justify-between text-sm font-medium">
                    <span>Pending</span>
                    <span className="text-chart-4">{stats.carnetRequests.pending}</span>
                </div>
                <Progress value={getPercentage(stats.carnetRequests.pending, stats.carnetRequests.total)} className="[&>div]:bg-chart-4" />
            </div>
             <div className="flex flex-col space-y-2">
                <div className="flex justify-between text-sm font-medium">
                    <span>Rejected</span>
                     <span className="text-destructive">{stats.carnetRequests.rejected}</span>
                </div>
                <Progress value={getPercentage(stats.carnetRequests.rejected, stats.carnetRequests.total)} className="[&>div]:bg-destructive"/>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
