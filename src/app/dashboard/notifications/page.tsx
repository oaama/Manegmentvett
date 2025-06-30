
import { DashboardHeader } from "@/components/dashboard-header";
import { NotificationForm } from "./components/notification-form";
import { HistoryTable } from "./components/history-table";
import type { Notification } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { NotificationHistoryFilters } from "./components/history-filters";
import { serverFetch } from "@/lib/server-api";

async function getNotificationHistory(): Promise<Notification[]> {
    try {
        const response = await serverFetch('/notifications/my');

        if (!response.ok) {
            const errorBody = await response.json().catch(() => response.text());
            console.error("API Error fetching notification history:", errorBody);
            return [];
        }
        const data = await response.json();
        return data.notifications || data || [];
    } catch (error: any) {
        console.warn("Could not fetch notification history, returning empty list.", error.message);
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
