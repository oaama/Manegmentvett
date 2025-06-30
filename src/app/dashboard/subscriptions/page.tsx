
import { DashboardHeader } from "@/components/dashboard-header"
import { AddSubscriptionDialog } from "./components/add-subscription-dialog"
import { SubscriptionsClientPage } from "./components/client-page"
import type { Subscription } from "@/lib/types"
import api from "@/lib/api"
import { cookies } from "next/headers"

async function getSubscriptions() {
    try {
        const token = cookies().get('auth_token')?.value;
        const response = await api.get('/admin/subscriptions', {
            headers: { Authorization: `Bearer ${token}` }
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
