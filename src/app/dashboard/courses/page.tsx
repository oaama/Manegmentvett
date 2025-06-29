import { DashboardHeader } from "@/components/dashboard-header"
import { courses, users } from "@/lib/data"
import { CourseClientPage } from "./components/client-page"
import { AddCourseDialog } from "./components/add-course-dialog"
import { CourseFilters } from "./components/course-filters"

type CoursesPageProps = {
  searchParams: {
    year?: string;
    instructor?: string;
  }
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const instructors = users.filter(u => u.role === 'instructor')

  let data = courses;
  if (searchParams.year) {
    data = data.filter(course => course.year === Number(searchParams.year));
  }
  if (searchParams.instructor) {
    data = data.filter(course => course.instructor === searchParams.instructor);
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
