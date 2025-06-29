import { DashboardHeader } from "@/components/dashboard-header"
import { courses } from "@/lib/data"
import { CourseClientPage } from "./components/client-page"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default async function CoursesPage() {
  const data = courses

  return (
    <>
      <DashboardHeader title="Courses Management">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Course
        </Button>
      </DashboardHeader>
      <div className="p-1">
        <CourseClientPage data={data} />
      </div>
    </>
  )
}
