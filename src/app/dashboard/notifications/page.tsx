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
        // NOTE: The swagger file specifies /notifications/my which fetches notifications for the authenticated user (admin).
        // This might not be what's expected (i.e., all notifications sent to everyone).
        // Using /notifications/my as it's the only available endpoint.
        const token = cookies().get('auth_token')?.value;
        const response = await api.get('/notifications/my', {
             headers: { Authorization: `Bearer ${token}` }
        });
        // The API might return { notifications: [...] } or just an array [...]
        return response.data.notifications || response.data || [];
    } catch (error) {
        console.warn("Could not fetch notification history. The API endpoint `/notifications/my` may be unavailable or you have no notifications.", error);
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
