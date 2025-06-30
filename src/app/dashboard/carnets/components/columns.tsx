"use client"

import * as React from "react"
import type { CarnetRequest } from "@/lib/types"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, CheckCircle, XCircle, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Image from "next/image"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import api from "@/lib/api"

const DateCell = ({ dateValue, formatString }: { dateValue: Date | string, formatString: string }) => {
  const [formattedDate, setFormattedDate] = React.useState("")

  React.useEffect(() => {
    // This runs only on the client, after hydration, preventing mismatch.
    setFormattedDate(format(new Date(dateValue), formatString))
  }, [dateValue, formatString])

  // Return the formatted date, or a placeholder/empty string during SSR and initial client render.
  return <>{formattedDate || null}</>
}

const ActionButtons = ({ row }: { row: { original: CarnetRequest } }) => {
    const request = row.original
    const { toast } = useToast()
    const [rejectionReason, setRejectionReason] = React.useState("");

    const handleApprove = async () => {
        try {
            await api.put(`/admin/approve-carnet/${request.id}`);
            toast({
                title: "Carnet Approved",
                description: `The carnet for ${request.user.name} has been approved.`,
            })
            // Here you would typically refetch the data or optimistically update the UI
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to approve the carnet. Please try again.",
                variant: "destructive",
            })
        }
    }

    const handleReject = async () => {
        if (!rejectionReason.trim()) {
            toast({
                title: "Rejection Failed",
                description: "Please provide a reason for rejection.",
                variant: "destructive",
            })
            return;
        }
        try {
            await api.put(`/admin/reject-carnet/${request.id}`, { rejectionReason });
            toast({
                title: "Carnet Rejected",
                description: `The carnet for ${request.user.name} has been rejected.`,
            })
            // Here you would typically refetch the data or optimistically update the UI
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to reject the carnet. Please try again.",
                variant: "destructive",
            })
        }
    }

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
                        fill
                        style={{ objectFit: "contain" }}
                        data-ai-hint="id card"
                    />
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" size="sm" onClick={handleApprove}>
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Approve
            </Button>
            
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                        <XCircle className="mr-2 h-4 w-4" /> Reject
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Carnet Request</DialogTitle>
                        <DialogDescription>
                            Please provide a reason for rejecting the carnet for {request.user.name}. This will be shown to the user.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="reason" className="text-left">Rejection Reason</Label>
                            <Textarea 
                                id="reason" 
                                placeholder="e.g., Image is blurry, name does not match."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Cancel
                            </Button>
                        </DialogClose>
                         <DialogClose asChild>
                            <Button type="button" onClick={handleReject} variant="destructive">Confirm Rejection</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
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
      return <DateCell dateValue={date} formatString="MMM d, yyyy" />
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
    cell: ({ row }) => <ActionButtons row={row} />,
  },
]
