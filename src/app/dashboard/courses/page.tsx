
import { DashboardHeader } from "@/components/dashboard-header"
import { CourseClientPage } from "./components/client-page"
import { AddCourseDialog } from "./components/add-course-dialog"
import { CourseFilters } from "./components/course-filters"
import type { Course, User } from "@/lib/types"
import { serverFetch } from "@/lib/server-api"



async function getInstructors(): Promise<Pick<User, '_id' | 'name'>[]> {
    try {
        const response = await serverFetch('/user/instructors');
        
        if (!response.ok) {
            const errorBody = await response.json().catch(() => response.text());
            console.error("API Error fetching instructors:", errorBody);
            return [];
        }
        const data = await response.json();
        return data.instructors || [];
    } catch (error: any) {
        console.error("Failed to fetch instructors:", error.message);
        return [];
    }
}


type CoursesPageProps = {
  searchParams: {
    year?: string;
    instructor?: string;
    category?: string;
  }
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const instructors: Pick<User, '_id'|'name'>[] = await getInstructors();
  // بناء endpoint حسب الفلاتر
  let endpoint = '/courses';
  if (searchParams.year && searchParams.category) {
    endpoint = `/courses/filter/by-year?year=${searchParams.year}&category=${searchParams.category}`;
  } else if (searchParams.year) {
    endpoint = `/courses/filter/by-year?year=${searchParams.year}`;
  } else if (searchParams.category) {
    endpoint = `/courses?category=${searchParams.category}`;
  }
  let data: Course[] = [];
  try {
    const response = await serverFetch(endpoint);
    if (response.ok) {
      const resData = await response.json();
      data = resData.courses || resData || [];
    }
  } catch (e) {
    // ignore
  }
  if (searchParams.instructor) {
    data = data.filter(course => course.instructorId === searchParams.instructor);
  }
  return (
    <>
      <DashboardHeader title="Courses Management">
        <div className="flex flex-wrap items-center gap-2">
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
