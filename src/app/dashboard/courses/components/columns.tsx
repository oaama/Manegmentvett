"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import type { Course, User } from "@/lib/types"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown, Loader2 } from "lucide-react"
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
  DialogTitle,
  DialogFooter,
  DialogClose,
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"

const DateCell = ({ dateValue, formatString }: { dateValue: Date | string, formatString: string }) => {
  const [formattedDate, setFormattedDate] = React.useState("")

  React.useEffect(() => {
    // This runs only on the client, after hydration, preventing mismatch.
    setFormattedDate(format(new Date(dateValue), formatString))
  }, [dateValue, formatString])

  // Return the formatted date, or a placeholder/empty string during SSR and initial client render.
  return <>{formattedDate || null}</>
}

const editFormSchema = z.object({
  name: z.string().min(3, "Course name must be at least 3 characters"),
  instructor: z.string().min(1, "Please select an instructor"),
  year: z.coerce.number().min(1, "Academic year is required"),
  sections: z.coerce.number().min(1, "Number of sections is required"),
  price: z.coerce.number().min(0, "Price is required"),
});

const CourseActions = ({ course, instructors }: { course: Course, instructors: User[] }) => {
  const { toast } = useToast()
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [isSectionsDialogOpen, setIsSectionsDialogOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<z.infer<typeof editFormSchema>>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      name: course.name,
      instructor: course.instructor,
      year: course.year,
      sections: course.sections,
      price: course.price,
    },
  })

  React.useEffect(() => {
    form.reset({
      name: course.name,
      instructor: course.instructor,
      year: course.year,
      sections: course.sections,
      price: course.price,
    })
  }, [course, form])


  async function onEditSubmit(values: z.infer<typeof editFormSchema>) {
    setIsSubmitting(true);
    // TODO: connect to /admin/courses/:id (PUT) with course data
    console.log("Updating course:", course.id, values);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false)
    setIsEditDialogOpen(false)
    toast({
      title: "Course Updated",
      description: `The course "${values.name}" has been successfully updated.`,
    })
  }

  const handleDeleteConfirm = () => {
    // TODO: connect to /admin/courses/:id (DELETE)
    console.log("Deleting course:", course.id)
    setIsDeleteDialogOpen(false)
    toast({
      title: "Course Deleted",
      description: `The course "${course.name}" has been deleted.`,
      variant: "destructive",
    })
  }
  
  return (
    <>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Edit Course: {course.name}</DialogTitle>
            <DialogDescription>
              Update the course details below.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onEditSubmit)} className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Advanced React" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="instructor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instructor</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an instructor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {instructors.map((instructor) => (
                          <SelectItem key={instructor.id} value={instructor.name}>
                            {instructor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sections"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sections</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                  <DialogClose asChild>
                      <Button type="button" variant="outline" disabled={isSubmitting}>
                          Cancel
                      </Button>
                  </DialogClose>
                  <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Changes
                  </Button>
              </DialogFooter>
            </form>
          </Form>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sections for {course.name}</DialogTitle>
            <DialogDescription>
              Here are the sections for this course. You can add or manage sections here.
              <br/>
              {/* TODO: Fetch sections from /admin/courses/:id/sections */}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">Section management UI will be implemented here.</p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
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

export const getColumns = ({ instructors }: { instructors: User[] }): ColumnDef<Course>[] => [
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
    accessorKey: "instructor",
    header: "Instructor",
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
    accessorKey: "year",
    header: "Year",
    cell: ({ row }) => `Year ${row.getValue("year")}`,
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
      return <CourseActions course={row.original} instructors={instructors} />
    },
  },
]
