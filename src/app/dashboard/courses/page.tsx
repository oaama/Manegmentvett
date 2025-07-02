
import { DashboardHeader } from "@/components/dashboard-header"
import { CourseClientPage } from "./components/client-page"
import { AddCourseDialog } from "./components/add-course-dialog"
import { CourseFilters } from "./components/course-filters"
import type { Course, User } from "@/lib/types"
import { serverFetch } from "@/lib/server-api"



async function getTeachers(): Promise<Pick<User, '_id' | 'name'>[]> {
    try {
        const response = await serverFetch('/users');
        let data: any = null;
        try {
            data = await response.json();
        } catch {
            data = null;
        }
        if (!response.ok) {
            console.error("API Error fetching users:", data);
            return [];
        }
        // فلترة المعلمين فقط بناءً على خاصية role === 'teacher' أو type === 'instructor'
        return Array.isArray(data?.users)
            ? data.users.filter((u: any) => u.role === 'teacher' || u.type === 'instructor').map((u: any) => ({ _id: u._id, name: u.name }))
            : [];
    } catch (error: any) {
        console.error("Failed to fetch users:", error.message);
        return [];
    }
}


type CoursesPageProps = {
  searchParams: {
    year?: string;
    teacher?: string;
    category?: string;
  }
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const teachers: Pick<User, '_id'|'name'>[] = await getTeachers();
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
  if (searchParams.teacher) {
    data = data.filter(course => course.teacherId === searchParams.teacher);
  }
  return (
    <>
      <DashboardHeader title="Courses Management">
        <div className="flex flex-wrap items-center gap-2">
          <CourseFilters teachers={teachers} />
          <AddCourseDialog teachers={teachers} />
        </div>
      </DashboardHeader>
      <div className="p-1">
        <CourseClientPage data={data} teachers={teachers} />
      </div>
    </>
  )
}
