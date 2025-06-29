"use client"

import type { ActivityLog } from "@/lib/types"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

const actionVariant: Record<string, "default" | "destructive" | "secondary"> = {
    LOGIN: "default",
    UPDATE_USER: "secondary",
    CREATE_COURSE: "secondary",
    APPROVE_CARNET: "default",
    DELETE_USER: "destructive",
}

export const columns: ColumnDef<ActivityLog>[] = [
  {
    accessorKey: "user",
    header: "User",
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      const action = row.getValue("action") as string
      return (
        <Badge variant={actionVariant[action] || 'secondary'}>
          {action}
        </Badge>
      )
    },
  },
  {
    accessorKey: "details",
    header: "Details",
    cell: ({ row }) => <div className="max-w-xs truncate">{row.getValue("details")}</div>
  },
  {
    accessorKey: "timestamp",
    header: "Timestamp",
    cell: ({ row }) => {
      const date = row.getValue("timestamp") as Date
      return format(date, "MMM d, yyyy, h:mm:ss a")
    },
  },
]
