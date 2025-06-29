import { DashboardHeader } from '@/components/dashboard-header';
import { StatCard } from '@/components/stat-card';
import { users, courses, carnetRequests } from '@/lib/data';
import { Users, Book, CreditCard, Library } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function DashboardPage() {
  const totalUsers = users.length;
  const totalCourses = courses.length;
  const totalCarnets = carnetRequests.length;
  const pendingCarnets = carnetRequests.filter(c => c.status === 'pending').length;
  const approvedCarnets = users.filter(u => u.carnetStatus === 'approved').length;
  const rejectedCarnets = carnetRequests.filter(c => c.status === 'rejected').length;

  const rolesCount = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalSections = courses.reduce((sum, course) => sum + course.sections, 0);

  return (
    <>
      <DashboardHeader title="Dashboard" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={totalUsers}
          icon={Users}
          description={`${rolesCount.student || 0} students, ${rolesCount.instructor || 0} instructors`}
        />
        <StatCard
          title="Total Courses"
          value={totalCourses}
          icon={Book}
          description="Across all academic years"
        />
        <StatCard
          title="Carnet Requests"
          value={totalCarnets}
          icon={CreditCard}
          description={`${pendingCarnets} pending`}
        />
        <StatCard
          title="Total Sections"
          value={totalSections}
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
                    <span>{rolesCount.student || 0} / {totalUsers}</span>
                </div>
                <Progress value={((rolesCount.student || 0) / totalUsers) * 100} />
            </div>
             <div className="flex flex-col space-y-2">
                <div className="flex justify-between text-sm font-medium">
                    <span>Instructors</span>
                    <span>{rolesCount.instructor || 0} / {totalUsers}</span>
                </div>
                <Progress value={((rolesCount.instructor || 0) / totalUsers) * 100} />
            </div>
             <div className="flex flex-col space-y-2">
                <div className="flex justify-between text-sm font-medium">
                    <span>Admins</span>
                    <span>{rolesCount.admin || 0} / {totalUsers}</span>
                </div>
                <Progress value={((rolesCount.admin || 0) / totalUsers) * 100} />
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
                    <span className="text-green-600">{approvedCarnets}</span>
                </div>
                <Progress value={(approvedCarnets / totalUsers) * 100} className="[&>div]:bg-green-500" />
            </div>
             <div className="flex flex-col space-y-2">
                <div className="flex justify-between text-sm font-medium">
                    <span>Pending</span>
                    <span className="text-yellow-600">{pendingCarnets}</span>
                </div>
                <Progress value={(pendingCarnets / totalUsers) * 100} className="[&>div]:bg-yellow-500" />
            </div>
             <div className="flex flex-col space-y-2">
                <div className="flex justify-between text-sm font-medium">
                    <span>Rejected</span>
                     <span className="text-red-600">{rejectedCarnets}</span>
                </div>
                <Progress value={(rejectedCarnets / totalUsers) * 100} className="[&>div]:bg-red-500"/>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
