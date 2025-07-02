import { DashboardHeader } from "@/components/dashboard-header";
import { AccountForm } from "./components/account-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { serverFetch } from "@/lib/server-api";
import type { User } from "@/lib/types";

async function getAdminProfile(): Promise<User | null> {
  try {
    const response = await serverFetch('/users/me');
    const data = await response.json();
    return data.user || data;
  } catch {
    return null;
  }
}

export default async function SettingsPage() {
  const admin = await getAdminProfile();
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
                <AccountForm admin={admin} />
            </CardContent>
          </Card>
      </div>
    </>
  );
}
