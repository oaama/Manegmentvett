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
import api from '@/lib/api';

type Stats = {
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

export default function DashboardPage() {
  const [stats, setStats] = React.useState<Stats | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // We assume the response structure from /admin/stats matches our UI needs based on the swagger file.
        const response = await api.get('/admin/stats');
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        // On error, stats will remain null, and the UI will show a clear error message.
        // The mock data fallback has been removed to make API issues more obvious.
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
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

  if (!stats) {
    return (
        <>
            <DashboardHeader title="Dashboard" />
            <div className="text-center p-8 border rounded-lg bg-card text-card-foreground">
                <h3 className="text-xl font-semibold mb-2">Could not load dashboard data.</h3>
                <p className="text-muted-foreground">
                    Please ensure the API server is running and the `NEXT_PUBLIC_API_BASE_URL` in your `.env` file is correct.
                </p>
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
                <Progress value={((stats.rolesCount.student || 0) / stats.totalUsers) * 100} />
            </div>
             <div className="flex flex-col space-y-2">
                <div className="flex justify-between text-sm font-medium">
                    <span>Instructors</span>
                    <span>{stats.rolesCount.instructor || 0} / {stats.totalUsers}</span>
                </div>
                <Progress value={((stats.rolesCount.instructor || 0) / stats.totalUsers) * 100} />
            </div>
             <div className="flex flex-col space-y-2">
                <div className="flex justify-between text-sm font-medium">
                    <span>Admins</span>
                    <span>{stats.rolesCount.admin || 0} / {stats.totalUsers}</span>
                </div>
                <Progress value={((stats.rolesCount.admin || 0) / stats.totalUsers) * 100} />
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
                    <span className="text-green-600">{stats.carnetRequests.approved}</span>
                </div>
                <Progress value={(stats.carnetRequests.approved / stats.totalUsers) * 100} className="[&>div]:bg-green-500" />
            </div>
             <div className="flex flex-col space-y-2">
                <div className="flex justify-between text-sm font-medium">
                    <span>Pending</span>
                    <span className="text-yellow-600">{stats.carnetRequests.pending}</span>
                </div>
                <Progress value={(stats.carnetRequests.pending / stats.totalUsers) * 100} className="[&>div]:bg-yellow-500" />
            </div>
             <div className="flex flex-col space-y-2">
                <div className="flex justify-between text-sm font-medium">
                    <span>Rejected</span>
                     <span className="text-red-600">{stats.carnetRequests.rejected}</span>
                </div>
                <Progress value={(stats.carnetRequests.rejected / stats.totalUsers) * 100} className="[&>div]:bg-red-500"/>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
