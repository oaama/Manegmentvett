"use client"

import type { User } from "@/lib/types"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"

const statusVariant: Record<User["carnetStatus"], "default" | "secondary" | "destructive"> = {
    approved: "default",
    pending: "secondary",
    rejected: "destructive",
}


export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
        const role = row.getValue("role") as User["role"]
        const variant: Record<User["role"], "default" | "outline"> = {
            admin: "default",
            instructor: "default",
            student: "outline"
        }
        return <Badge variant={variant[role]}>{role}</Badge>
    }
  },
  {
    accessorKey: "academicYear",
    header: "Year",
    cell: ({ row }) => {
        const year = row.getValue("academicYear")
        return year ? `Year ${year}`: 'N/A'
    }
  },
  {
    accessorKey: "carnetStatus",
    header: "Carnet Status",
    cell: ({ row }) => {
        const status = row.getValue("carnetStatus") as User["carnetStatus"]
        return <Badge variant={statusVariant[status] || "secondary"} className="capitalize">{status}</Badge>
    }
  },
  {
    accessorKey: "createdAt",
    header: "Joined Date",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date
      return format(date, "MMM d, yyyy")
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.id)}
            >
              Copy user ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View user details</DropdownMenuItem>
            <DropdownMenuItem>Edit user</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">Delete user</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
