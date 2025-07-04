
"use client"

import * as React from "react"
import type { CarnetRequest } from "@/lib/types"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, CheckCircle, XCircle, Eye, AlertTriangle } from "lucide-react"
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
import { useToast } from "@/hooks/use-toast"
import api from "@/lib/api"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const DateCell = ({ dateValue, formatString }: { dateValue: Date | string, formatString: string }) => {
  const [formattedDate, setFormattedDate] = React.useState("")

  React.useEffect(() => {
    setFormattedDate(format(new Date(dateValue), formatString))
  }, [dateValue, formatString])

  return <>{formattedDate || null}</>
}

const ActionButtons = ({ row }: { row: { original: CarnetRequest } }) => {
    const request = row.original
    const router = useRouter()
    const { toast } = useToast()

    const handleApprove = async () => {
        try {
            await api.post(`/admin/approve-carnet`, { userId: request.user._id });
            toast({
                title: "Carnet Approved",
                description: `The carnet for ${request.user.name} has been approved.`,
            })
            router.refresh()
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.msg || "Failed to approve the carnet.",
                variant: "destructive",
            })
        }
    }

    const handleReject = async () => {
        try {
            await api.post(`/admin/reject-carnet`, { userId: request.user._id });
            toast({
                title: "Carnet Rejected",
                description: `The carnet for ${request.user.name} has been rejected.`,
            })
            router.refresh();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.msg || "Failed to reject the carnet.",
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
                {request.status === 'rejected' && request.rejectionReason && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Rejection Reason</AlertTitle>
                    <AlertDescription>{request.rejectionReason}</AlertDescription>
                  </Alert>
                )}
              </DialogContent>
            </Dialog>

            <Button variant="success" size="sm" onClick={handleApprove}>
                <CheckCircle className="mr-2 h-4 w-4" /> Approve
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
                            Are you sure you want to reject the carnet for {request.user.name}? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
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
    id: "user.name",
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
    accessorFn: row => row.user?.name || "",
    cell: ({ row }) => <div className="font-medium">{row.original.user?.name || ''}</div>,
  },
  {
    accessorKey: "user.email",
    header: "Email",
    cell: ({ row }) => {
      const user = row.original.user;
      if (!user || typeof user !== 'object' || typeof user.email !== 'string') return '';
      return user.email;
    },
  },
  {
    accessorKey: "user.academicYear",
    header: "Year",
    cell: ({ row }) => {
      const user = row.original.user;
      if (!user || typeof user !== 'object' || typeof user.academicYear === 'undefined' || user.academicYear === null) return '';
      return `Year ${user.academicYear}`;
    },
  },
  {
    accessorKey: "requestedAt",
    header: "Request Date",
    cell: ({ row }) => {
      const date = row.getValue("requestedAt") as Date;
      if (!date || isNaN(new Date(date).getTime())) return '';
      return <DateCell dateValue={date} formatString="MMM d, yyyy" />;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      // إظهار الحالة فقط إذا كان role === 'student' بشكل صريح
      const user = row.original.user as { role?: string };
      const status = row.getValue("status");
      if (!user || typeof user !== 'object' || user.role !== 'student') return null;
      return <Badge variant="secondary" className="capitalize">{String(status)}</Badge>;
    }
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionButtons row={row} />,
  },
]
