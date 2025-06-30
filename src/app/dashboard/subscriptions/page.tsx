
import { DashboardHeader } from "@/components/dashboard-header"
import { AddSubscriptionDialog } from "./components/add-subscription-dialog"
import { SubscriptionsClientPage } from "./components/client-page"
import type { Subscription } from "@/lib/types"
import { cookies } from "next/headers"

const API_BASE_URL = 'https://mrvet-production.up.railway.app/api';

async function getSubscriptions(): Promise<Subscription[]> {
    try {
        const token = cookies().get('auth_token')?.value;
        if (!token) {
            console.error("Authentication token not found for getSubscriptions.");
            return [];
        }

        const response = await fetch(`${API_BASE_URL}/admin/subscriptions`, {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            cache: 'no-store',
        });
        
        if (!response.ok) {
            const errorBody = await response.json().catch(() => response.text());
            console.error("API Error fetching subscriptions:", errorBody);
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
