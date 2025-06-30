import { DashboardHeader } from "@/components/dashboard-header"
import { AddSubscriptionDialog } from "./components/add-subscription-dialog"
import { SubscriptionsClientPage } from "./components/client-page"
import type { Subscription } from "@/lib/types"

async function getSubscriptions() {
    // NOTE: The provided swagger specification does not include an endpoint for fetching subscriptions (e.g., /admin/subscriptions).
    // This feature cannot be implemented without a corresponding backend API.
    // Returning empty data to prevent application crashes.
    console.warn("Feature Sidelined: The API for fetching subscriptions is not available in the swagger specification. The 'Subscriptions' table will be empty.");
    return [];
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
