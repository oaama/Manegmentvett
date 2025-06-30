import { DashboardHeader } from "@/components/dashboard-header"
import { CourseClientPage } from "./components/client-page"
import { AddCourseDialog } from "./components/add-course-dialog"
import { CourseFilters } from "./components/course-filters"
import api from "@/lib/api"
import type { Course, User } from "@/lib/types"
import { cookies } from "next/headers"

async function getCourses(year?: string) {
    try {
        const token = cookies().get('auth_token')?.value;
        const endpoint = year ? `/courses/filter/by-year?year=${year}` : '/courses';
        const response = await api.get(endpoint, {
             headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.courses || [];
    } catch (error) {
        console.error("Failed to fetch courses:", error);
        return [];
    }
}

async function getInstructors() {
    try {
        const token = cookies().get('auth_token')?.value;
        const response = await api.get('/user/instructors', {
             headers: { Authorization: `Bearer ${token}` }
        });
        // Assuming the endpoint returns an array of objects with { id, name }
        return response.data.instructors || [];
    } catch (error) {
        console.error("Failed to fetch instructors:", error);
        return [];
    }
}

type CoursesPageProps = {
  searchParams: {
    year?: string;
    instructor?: string;
  }
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const instructors: Pick<User, 'id'|'name'>[] = await getInstructors();
  let data: Course[] = await getCourses(searchParams.year);

  // Instructor filter is done on the client-side as there is no dedicated backend endpoint
  if (searchParams.instructor) {
    data = data.filter(course => course.instructorId === searchParams.instructor);
  }

  return (
    <>
      <DashboardHeader title="Courses Management">
        <div className="flex items-center gap-4">
          <CourseFilters instructors={instructors} />
          <AddCourseDialog instructors={instructors} />
        </div>
      </DashboardHeader>
      <div className="p-1">
        <CourseClientPage data={data} instructors={instructors} />
      </div>
    </>
  )
}
