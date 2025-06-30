import { DashboardHeader } from "@/components/dashboard-header"
import { AddSubscriptionDialog } from "./components/add-subscription-dialog"
import { SubscriptionsClientPage } from "./components/client-page"
import api from "@/lib/api"
import type { Subscription, User, Course } from "@/lib/types"
import { cookies } from "next/headers"

async function getSubscriptions() {
    try {
        const token = cookies().get('auth_token')?.value;
        const response = await api.get('/admin/subscriptions', {
             headers: { Authorization: `Bearer ${token}` }
        });
        // NOTE: The swagger file doesn't specify the structure for subscriptions.
        // Assuming it's an array under a 'subscriptions' key.
        return response.data.subscriptions || [];
    } catch (error) {
        console.error("Failed to fetch subscriptions. The API endpoint might not exist or the server is down.", error);
        return []; // Return empty array on error to prevent crashing
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
