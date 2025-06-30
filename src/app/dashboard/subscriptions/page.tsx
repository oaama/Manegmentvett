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

async function getUsers() {
    try {
        const token = cookies().get('auth_token')?.value;
        const response = await api.get('/admin/users', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.users || [];
    } catch (error) {
        console.error("Failed to fetch users for subscriptions page:", error);
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
        console.error("Failed to fetch courses for subscriptions page:", error);
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
        <AddSubscriptionDialog students={studentList} courses={courseList} />
      </DashboardHeader>
      <div className="p-1">
        <SubscriptionsClientPage data={data} />
      </div>
    </>
  )
}
