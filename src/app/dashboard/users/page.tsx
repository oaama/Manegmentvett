import { DashboardHeader } from "@/components/dashboard-header"
import { users } from "@/lib/data"
import { UserClientPage } from "./components/client-page"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default async function UsersPage() {
  const data = users

  return (
    <>
      <DashboardHeader title="Users Management">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </DashboardHeader>
      <div className="p-1">
        <UserClientPage data={data} />
      </div>
    </>
  )
}
