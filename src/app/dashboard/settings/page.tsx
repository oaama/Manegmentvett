import { DashboardHeader } from "@/components/dashboard-header";
import { AccountForm } from "./components/account-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <>
      <DashboardHeader title="Account Settings" />
      <div className="grid gap-6">
          <Card>
            <CardHeader>
                <CardTitle>Update Credentials</CardTitle>
                <CardDescription>
                    Manage your admin account email and password here. To save changes, you must enter your current password.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <AccountForm />
            </CardContent>
          </Card>
      </div>
    </>
  );
}
