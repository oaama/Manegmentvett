
import { DashboardHeader } from "@/components/dashboard-header"
import { AddSubscriptionDialog } from "./components/add-subscription-dialog"
import { SubscriptionsClientPage } from "./components/client-page"
import type { Subscription } from "@/lib/types"
import { cookies } from "next/headers"
import api from "@/lib/api"

async function getSubscriptions(): Promise<Subscription[]> {
    try {
        const token = cookies().get('auth_token')?.value;
        if (!token) return [];

        const response = await api.get('/admin/subscriptions', {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data.subscriptions || response.data || [];
    } catch (error) {
        console.error("Failed to fetch subscriptions:", error);
        return [];
    }
}

export default async function SubscriptionsPage() {
  const data: Subscription[] = await getSubscriptions();

  return (
    <>
      <DashboardHeader title="Subscriptions Management">
        <AddSubscriptionDialog />
      </DashboardHeader>
      <div className="p-1">
        <SubscriptionsClientPage data={data} />
      </div>
    </>
  )
}
