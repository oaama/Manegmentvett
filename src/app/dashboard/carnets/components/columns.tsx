"use client"

import type { CarnetRequest } from "@/lib/types"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown, CheckCircle, XCircle, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Image from "next/image"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

const ActionButtons = ({ row }: { row: any }) => {
    const request = row.original as CarnetRequest
    return (
        <div className="space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Eye className="mr-2 h-4 w-4" /> View Carnet
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Carnet for {request.user.name}</DialogTitle>
                  <DialogDescription>
                    Review the uploaded carnet image.
                  </DialogDescription>
                </DialogHeader>
                <div className="relative mt-4 h-64 w-full">
                    <Image
                        src={request.carnetImage}
                        alt={`Carnet for ${request.user.name}`}
                        layout="fill"
                        objectFit="contain"
                        data-ai-hint="id card"
                    />
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" size="sm" className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200" style={{'--accent': 'hsl(122 39% 76%)'} as React.CSSProperties}>
                <CheckCircle className="mr-2 h-4 w-4" /> Approve
            </Button>
            <Button variant="destructive" size="sm">
                <XCircle className="mr-2 h-4 w-4" /> Reject
            </Button>
        </div>
    )
}

export const columns: ColumnDef<CarnetRequest>[] = [
  {
    accessorKey: "user.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          User Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.original.user.name}</div>,
  },
  {
    accessorKey: "user.email",
    header: "Email",
  },
  {
    accessorKey: "user.academicYear",
    header: "Year",
    cell: ({ row }) => `Year ${row.original.user.academicYear}`,
  },
  {
    accessorKey: "requestedAt",
    header: "Request Date",
    cell: ({ row }) => {
      const date = row.getValue("requestedAt") as Date
      return format(date, "MMM d, yyyy")
    },
  },
   {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return <Badge variant="secondary" className="capitalize">{row.getValue("status")}</Badge>
    }
  },
  {
    id: "actions",
    header: "Actions",
    cell: ActionButtons,
  },
]
