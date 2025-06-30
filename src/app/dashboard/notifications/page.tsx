import { DashboardHeader } from "@/components/dashboard-header";
import { NotificationForm } from "./components/notification-form";
import { HistoryTable } from "./components/history-table";
import type { Notification } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { NotificationHistoryFilters } from "./components/history-filters";
import { cookies } from "next/headers";
import api from "@/lib/api";

async function getNotificationHistory() {
    try {
        const token = cookies().get('auth_token')?.value;
        // NOTE: The swagger file doesn't specify an endpoint for fetching all sent notifications.
        // Assuming the endpoint is GET /admin/notifications
        const response = await api.get('/admin/notifications', {
             headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.notifications || [];
    } catch (error) {
        console.error("Failed to fetch notification history. The API endpoint might not exist or the server is down.", error);
        return [];
    }
}

type NotificationsPageProps = {
  searchParams: {
    target?: 'all' | 'students' | 'instructors';
  }
}

export default async function NotificationsPage({ searchParams }: NotificationsPageProps) {
  const target = searchParams.target || 'all';

  const allNotifications: Notification[] = await getNotificationHistory();

  const filteredNotifications = target === 'all' 
    ? allNotifications 
    : allNotifications.filter(n => n.target === target);

  return (
    <>
      <DashboardHeader title="Send Notification" />
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
            <NotificationForm />
        </div>
        <div className="lg:col-span-3">
             <Card>
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                        <CardTitle>Notification History</CardTitle>
                        <CardDescription>A log of all previously sent notifications.</CardDescription>
                    </div>
                    <NotificationHistoryFilters />
                </CardHeader>
                <CardContent>
                    <HistoryTable data={filteredNotifications} />
                </CardContent>
             </Card>
        </div>
      </div>
    </>
  );
}
