import { DashboardHeader } from "@/components/dashboard-header"
import { subscriptions, courses } from "@/lib/data"
import { SubscriptionClientPage } from "./components/client-page"
import { AddSubscriptionDialog } from "./components/add-subscription-dialog"

export default async function SubscriptionsPage() {
  const data = subscriptions

  return (
    <>
      <DashboardHeader title="Subscriptions Management">
        <AddSubscriptionDialog courses={courses} />
      </DashboardHeader>
      <div className="p-1">
        <SubscriptionClientPage data={data} />
      </div>
    </>
  )
}
