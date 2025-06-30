
import { DashboardHeader } from "@/components/dashboard-header"
import { CourseClientPage } from "./components/client-page"
import { AddCourseDialog } from "./components/add-course-dialog"
import { CourseFilters } from "./components/course-filters"
import type { Course, User } from "@/lib/types"
import { cookies } from "next/headers"

const API_BASE_URL = 'https://mrvet-production.up.railway.app/api';

async function getCourses(year?: string): Promise<Course[]> {
    try {
        const token = cookies().get('auth_token')?.value;
        if (!token) return [];
        const endpoint = year ? `/courses/filter/by-year?year=${year}` : '/courses';
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
             headers: { Authorization: `Bearer ${token}` },
             cache: 'no-store',
        });
        
        if (!response.ok) {
            const errorBody = await response.json().catch(() => response.text());
            console.error("API Error fetching courses:", errorBody);
            throw new Error(`Failed to fetch courses. Status: ${response.status}`);
        }
        const data = await response.json();
        return data.courses || [];
    } catch (error) {
        console.error("Failed to fetch courses:", error);
        return [];
    }
}

async function getInstructors(): Promise<Pick<User, '_id' | 'name'>[]> {
    try {
        const token = cookies().get('auth_token')?.value;
        if (!token) return [];

        const response = await fetch(`${API_BASE_URL}/user/instructors`, {
             headers: { Authorization: `Bearer ${token}` },
             cache: 'no-store',
        });
        
        if (!response.ok) {
            const errorBody = await response.json().catch(() => response.text());
            console.error("API Error fetching instructors:", errorBody);
            throw new Error(`Failed to fetch instructors. Status: ${response.status}`);
        }
        const data = await response.json();
        return data.instructors || [];
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
  const instructors: Pick<User, '_id'|'name'>[] = await getInstructors();
  let data: Course[] = await getCourses(searchParams.year);

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
