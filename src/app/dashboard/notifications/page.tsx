import { DashboardHeader } from "@/components/dashboard-header";
import { NotificationForm } from "./components/notification-form";
import { HistoryTable } from "./components/history-table";
import { notifications } from "@/lib/data";
import { users } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";


export default function NotificationsPage() {

  return (
    <>
      <DashboardHeader title="Send Notification" />
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
            <NotificationForm users={users.filter(u => u.role === 'student' || u.role === 'instructor')} />
        </div>
        <div className="lg:col-span-3">
             <Card>
                <CardHeader>
                    <CardTitle>Notification History</CardTitle>
                    <CardDescription>A log of all previously sent notifications.</CardDescription>
                </CardHeader>
                <CardContent>
                    <HistoryTable data={notifications} />
                </CardContent>
             </Card>
        </div>
      </div>
    </>
  );
}
