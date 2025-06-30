import { DashboardHeader } from "@/components/dashboard-header"
import { AddSubscriptionDialog } from "./components/add-subscription-dialog"
import { SubscriptionsClientPage } from "./components/client-page"
import api from "@/lib/api"
import type { Subscription, User, Course } from "@/lib/types"
import { cookies } from "next/headers"

// NOTE: Since there are no endpoints for subscriptions yet, we will use mock data.
// We'll also fetch users and courses to pass to the add dialog,
// although the dialog will primarily use IDs for now.

async function getSubscriptions() {
    // This is a mock function. Replace with actual API call when ready.
    try {
        // const response = await api.get('/admin/subscriptions');
        // return response.data.subscriptions || [];
        const { subscriptions } = await import("@/lib/data");
        return subscriptions;
    } catch (error) {
        console.error("Failed to fetch subscriptions:", error);
        return [];
    }
}

async function getUsers() {
    try {
        const token = cookies().get('auth_token')?.value;
        const response = await api.get('/admin/users', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.users || [];
    } catch (error) {
        console.error("Failed to fetch users:", error);
        return [];
    }
}

async function getCourses() {
    try {
        const token = cookies().get('auth_token')?.value;
        const response = await api.get('/courses', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.courses || [];
    } catch (error) {
        console.error("Failed to fetch courses:", error);
        return [];
    }
}


export default async function SubscriptionsPage() {
  const data: Subscription[] = await getSubscriptions();
  const users: User[] = await getUsers();
  const courses: Course[] = await getCourses();

  const studentList = users.filter(u => u.role === 'student').map(s => ({ id: s.id, name: s.name }));
  const courseList = courses.map(c => ({ id: c.id, name: c.name }));

  return (
    <>
      <DashboardHeader title="Subscriptions Management">
        {/* Pass lists to dialog for potential future use (e.g., validation) */}
        <AddSubscriptionDialog students={studentList} courses={courseList} />
      </DashboardHeader>
      <div className="p-1">
        <SubscriptionsClientPage data={data} />
      </div>
    </>
  )
}
