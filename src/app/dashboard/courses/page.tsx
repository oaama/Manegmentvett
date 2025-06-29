import { DashboardHeader } from "@/components/dashboard-header"
import { courses, users } from "@/lib/data"
import { CourseClientPage } from "./components/client-page"
import { AddCourseDialog } from "./components/add-course-dialog"

export default async function CoursesPage() {
  const data = courses
  const instructors = users.filter(u => u.role === 'instructor')

  return (
    <>
      <DashboardHeader title="Courses Management">
        <AddCourseDialog instructors={instructors} />
      </DashboardHeader>
      <div className="p-1">
        <CourseClientPage data={data} />
      </div>
    </>
  )
}
