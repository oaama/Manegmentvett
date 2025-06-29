import { DashboardHeader } from "@/components/dashboard-header"
import { users } from "@/lib/data"
import { UserClientPage } from "./components/client-page"
import { AddUserDialog } from "./components/add-user-dialog"

export default async function UsersPage() {
  const data = users

  return (
    <>
      <DashboardHeader title="Users Management">
        <AddUserDialog />
      </DashboardHeader>
      <div className="p-1">
        <UserClientPage data={data} />
      </div>
    </>
  )
}
