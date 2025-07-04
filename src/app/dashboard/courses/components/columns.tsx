
"use client"

import * as React from "react"
import type { Course, User } from "@/lib/types"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogClose,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
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
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ManageSectionsContent } from "./manage-sections-content"

const DateCell = ({ dateValue, formatString }: { dateValue: Date | string, formatString: string }) => {
  const [formattedDate, setFormattedDate] = React.useState("")

  React.useEffect(() => {
    let dateObj: Date | null = null;
    if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
      dateObj = dateValue;
    } else if (typeof dateValue === 'string') {
      const parsed = new Date(dateValue);
      if (!isNaN(parsed.getTime())) dateObj = parsed;
    }
    if (dateObj) {
      setFormattedDate(format(dateObj, formatString));
    } else {
      setFormattedDate("");
    }
  }, [dateValue, formatString])

  return <>{formattedDate || null}</>
}

const CourseActions = ({ course, teachers }: { course: Course, teachers: Pick<User, '_id' | 'name'>[] }) => {
  const { toast } = useToast()
  const router = useRouter()
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [isSectionsDialogOpen, setIsSectionsDialogOpen] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const [name, setName] = React.useState(course.name)
  const [price, setPrice] = React.useState(course.price)
  const [academicYear, setAcademicYear] = React.useState(course.academicYear)
  const [teacherId, setTeacherId] = React.useState(course.teacherId)

  const handleEditSubmit = async () => {
    setIsSaving(true)
    try {
        await api.put(`/api/admin/courses/${course._id}`, {
            name,
            price,
            academicYear,
            teacherId,
        });
        toast({
            title: "Course Updated",
            description: `The course \"${name}\" has been successfully updated.`,
        });
        setIsEditDialogOpen(false);
        router.refresh();
    } catch (error: any) {
        toast({
            title: "Error Updating Course",
            description: error.response?.data?.msg || "An unexpected error occurred.",
            variant: "destructive",
        });
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteConfirm = async () => {
     try {
        await api.delete(`/api/admin/courses/${course._id}`);
        toast({
            title: "Course Deleted",
            description: `The course "${course.name}" has been permanently deleted.`,
        });
        setIsDeleteDialogOpen(false);
        router.refresh();
    } catch (error: any) {
        toast({
            title: "Error Deleting Course",
            description: error.response?.data?.msg || "An unexpected error occurred.",
            variant: "destructive",
        });
    }
  }
  
  return (
    <>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Course: {course.name}</DialogTitle>
            <DialogDescription>
              Make changes to the course details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 grid-cols-1 sm:grid-cols-2">
            {isSaving ? (
              <div className="space-y-2 col-span-full">
                <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
                <div className="h-10 w-full bg-muted rounded animate-pulse" />
                <div className="h-4 w-1/3 bg-muted rounded animate-pulse" />
                <div className="h-10 w-full bg-muted rounded animate-pulse" />
                <div className="h-4 w-1/4 bg-muted rounded animate-pulse" />
                <div className="h-10 w-full bg-muted rounded animate-pulse" />
                <div className="h-4 w-1/4 bg-muted rounded animate-pulse" />
                <div className="h-10 w-full bg-muted rounded animate-pulse" />
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="price" className="text-right">Price</Label>
                  <Input id="price" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="academicYear" className="text-right">Year</Label>
                  <Input id="academicYear" type="number" value={academicYear} onChange={(e) => setAcademicYear(Number(e.target.value))} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="teacher" className="text-right">Teacher</Label>
                  <Select value={teacherId} onValueChange={setTeacherId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a teacher" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(teachers) && teachers.map((teacher: any) => (
                        <SelectItem key={teacher._id} value={teacher._id}>
                          {teacher.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4">
             <DialogClose asChild>
              <Button type="button" variant="outline" className="w-full sm:w-auto">Cancel</Button>
            </DialogClose>
            <Button onClick={handleEditSubmit} disabled={isSaving} className="w-full sm:w-auto">{isSaving ? 'Saving...' : 'Save Changes'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the course <span className="font-semibold">"{course.name}"</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">
              Delete Course
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isSectionsDialogOpen} onOpenChange={setIsSectionsDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
           <ManageSectionsContent course={course} />
        </DialogContent>
      </Dialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onSelect={() => setIsSectionsDialogOpen(true)}>
            View sections
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setIsEditDialogOpen(true)}>Edit course</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="text-destructive focus:text-destructive focus:bg-destructive/10"
            onSelect={() => setIsDeleteDialogOpen(true)}
          >
            Delete course
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export const getColumns = ({ teachers }: { teachers: Pick<User, '_id' | 'name'>[] }): ColumnDef<Course>[] => [
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
          Course Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "teacherName",
    header: "Teacher",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      return <div className="font-medium">{formatted}</div>
    }
  },
  {
    accessorKey: "academicYear",
    header: "Year",
    cell: ({ row }) => `Year ${row.getValue("academicYear")}`,
  },
  {
    accessorKey: "sections",
    header: "Sections",
  },
  {
    accessorKey: "createdAt",
    header: "Created Date",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date
      return <DateCell dateValue={date} formatString="MMM d, yyyy" />
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <CourseActions course={row.original} teachers={teachers} />
    },
  },
]
