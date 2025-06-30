import { DashboardHeader } from "@/components/dashboard-header"
import { AddSubscriptionDialog } from "./components/add-subscription-dialog"
import { SubscriptionsClientPage } from "./components/client-page"
import api from "@/lib/api"
import type { Subscription, User, Course } from "@/lib/types"
import { cookies } from "next/headers"

// NOTE: The data fetching for this page has been temporarily switched to
// mock data to prevent the app from crashing while the API is unavailable.

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
    // MOCK: Returning mock data to prevent app crash while API is unavailable.
    // The real implementation is commented out below.
    console.warn("Subscriptions Page: Using mock user data. Please ensure your API server is running.");
    const { users } = await import("@/lib/data");
    return users;
    /*
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
    */
}

async function getCourses() {
    // MOCK: Returning mock data to prevent app crash while API is unavailable.
    // The real implementation is commented out below.
    console.warn("Subscriptions Page: Using mock course data. Please ensure your API server is running.");
    const { courses } = await import("@/lib/data");
    return courses;
    /*
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
    */
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
