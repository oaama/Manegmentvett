
import { DashboardHeader } from "@/components/dashboard-header"
import { AddSubscriptionDialog } from "./components/add-subscription-dialog"
import { SubscriptionsClientPage } from "./components/client-page"
import type { Subscription } from "@/lib/types"
import { serverFetch } from "@/lib/server-api"

export const dynamic = "force-dynamic";

async function getSubscriptions(): Promise<Subscription[]> {
    try {
        const response = await serverFetch('/admin/subscriptions');
        
        if (!response.ok) {
            const errorBody = await response.json().catch(() => response.text());
            console.error("API Error fetching subscriptions:", errorBody);
            return [];
        }
        const data = await response.json();
        return data.subscriptions || data || [];
    } catch (error: any) {
        console.error("Failed to fetch subscriptions:", error.message);
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
