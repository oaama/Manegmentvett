
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

export default function DashboardPage() {
  const [stats, setStats] = React.useState<Stats | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const token = document.cookie.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1];
        const response = await api.get('/api/admin/stats', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        console.warn("Dashboard is falling back to mock data due to API connection failure.");
        setStats(mockStats);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const getPercentage = (part: number, total: number) => {
    if (total === 0) return 0;
    return (part / total) * 100;
  }

  if (loading || !stats) {
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
