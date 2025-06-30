
import { DashboardHeader } from "@/components/dashboard-header"
import { AddSubscriptionDialog } from "./components/add-subscription-dialog"
import { SubscriptionsClientPage } from "./components/client-page"
import type { Subscription } from "@/lib/types"
import { cookies } from "next/headers"

const API_BASE_URL = 'https://mrvet-production.up.railway.app/api';

async function getSubscriptions() {
    try {
        const token = cookies().get('auth_token')?.value;
        if (!token) return [];

        const response = await fetch(`${API_BASE_URL}/admin/subscriptions`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
        });

        if (!response.ok) {
            console.error("Failed to fetch subscriptions:", response.status, await response.text());
            return [];
        }

        const data = await response.json();
        return data.subscriptions || data || [];
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
