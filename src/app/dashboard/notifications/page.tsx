
import { DashboardHeader } from "@/components/dashboard-header";
import { NotificationForm } from "./components/notification-form";
import { HistoryTable } from "./components/history-table";
import type { Notification } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { NotificationHistoryFilters } from "./components/history-filters";
import { cookies } from "next/headers";

const API_BASE_URL = 'https://mrvet-production.up.railway.app/api';

async function getNotificationHistory(): Promise<Notification[]> {
    try {
        const token = cookies().get('auth_token')?.value;
        if (!token) {
            console.error("Authentication token not found for getNotificationHistory.");
            return [];
        }

        const response = await fetch(`${API_BASE_URL}/notifications/my`, {
             headers: { 
                 Authorization: `Bearer ${token}`,
                 'Content-Type': 'application/json',
                 'Accept': 'application/json',
             },
             cache: 'no-store',
        });

        if (!response.ok) {
            const errorBody = await response.json().catch(() => response.text());
            console.error("API Error fetching notification history:", errorBody);
            return [];
        }
        const data = await response.json();
        return data.notifications || data || [];
    } catch (error) {
        console.warn("Could not fetch notification history, returning empty list.", error);
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
