
"use client"

import * as React from "react"
import type { Subscription } from "@/lib/types"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import api from "@/lib/api"

const DateCell = ({ dateValue, formatString }: { dateValue: Date | string, formatString: string }) => {
  const [formattedDate, setFormattedDate] = React.useState("")

  React.useEffect(() => {
    setFormattedDate(format(new Date(dateValue), formatString))
  }, [dateValue, formatString])

  return <>{formattedDate || null}</>
}

const SubscriptionActions = ({ subscription }: { subscription: Subscription }) => {
    const { toast } = useToast()
    const router = useRouter()
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)

    const handleDelete = async () => {
        try {
            await api.delete(`/admin/subscriptions/${subscription.id}`);
            toast({
                title: "Subscription Deleted",
                description: "The subscription has been removed.",
            });
            setIsDeleteDialogOpen(false);
            router.refresh();
        } catch (error: any) {
            toast({
                title: "Error Deleting Subscription",
                description: error.response?.data?.message || "An unexpected error occurred.",
                variant: "destructive",
            });
        }
    }

    return (
        <>
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                    This will permanently remove the subscription for <span className="font-semibold">{subscription.user.name}</span> from the course <span className="font-semibold">"{subscription.course.name}"</span>.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                        Delete Subscription
                    </AlertDialogAction>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
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
                    className="text-destructive focus:text-destructive focus:bg-destructive/10"
                    onSelect={() => setIsDeleteDialogOpen(true)}
                >
                    Delete subscription
                </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

export const columns: ColumnDef<Subscription>[] = [
  {
    id: "user.name",
    accessorFn: row => row.user.name,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Student Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.original.user.name}</div>,
  },
  {
    accessorKey: "user.email",
    header: "Student Email",
    cell: ({ row }) => row.original.user.email,
  },
  {
    accessorKey: "course.name",
    header: "Course Name",
     cell: ({ row }) => row.original.course.name,
  },
  {
    accessorKey: "subscribedAt",
    header: "Subscription Date",
    cell: ({ row }) => {
      const date = row.getValue("subscribedAt") as Date
      return <DateCell dateValue={date} formatString="MMM d, yyyy" />
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <SubscriptionActions subscription={row.original} />,
  },
]
