
"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { PlusCircle, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
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
import { useToast } from "@/hooks/use-toast"
import type { User } from "@/lib/types"
import api from "@/lib/api"
import { useRouter } from "next/navigation"

// Avoid using FileList in SSR, use a custom validation
const formSchema = z.object({
  courseName: z.string().min(3, "Course name must be at least 3 characters"),
  teacherName: z.string().min(1, "Please select a teacher"),
  sections: z.string().min(1, "Number of sections is required"),
  price: z.coerce.number().min(0, "Price is required"),
  category: z.enum(["general", "credit"], { required_error: "Course type is required" }),
  academicYear: z.preprocess(
    (val) => val === undefined || val === null || val === "" ? undefined : Number(val),
    z.number().min(1, "Academic year is required").optional()
  ),
  coverImage: z.any().refine(
    (file) => typeof window === 'undefined' || (file && file.length && file[0]),
    "Cover image is required."
  ),
})

type AddCourseDialogProps = {
  teachers: Pick<User, '_id' | 'name'>[];
}

export function AddCourseDialog({ teachers }: AddCourseDialogProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseName: "",
      teacherName: "",
      academicYear: 1,
      sections: "10",
      price: 0,
      category: "general",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    console.log('Submitting course values:', values);
    const formData = new FormData();
    formData.append('courseName', values.courseName);
    formData.append('teacherName', values.teacherName);
    formData.append('academicYear', String(values.academicYear));
    formData.append('sections', values.sections);
    formData.append('price', String(values.price));
    formData.append('category', values.category);
    if (values.coverImage && values.coverImage.length > 0) {
      formData.append('coverImage', values.coverImage[0]);
    }
    try {
      await api.post('/api/courses/upload', formData, { 
        headers: { 
            'Content-Type': 'multipart/form-data',
        } 
      });
      toast({
        title: "Course Created",
        description: `The course "${values.courseName}" has been successfully created.`,
      })
      setOpen(false)
      form.reset()
      router.refresh()
    } catch (error: any) {
      console.error('Error creating course:', error);
      toast({
        title: "Error Creating Course",
        description: error.response?.data?.msg || error.message || "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Course
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Add New Course</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new course.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="courseName"
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
            name="teacherName"
            render={({ field }) => (
                <FormItem>
                  <FormLabel>Teacher</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a teacher" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {teachers.map((teacher) => (
                        <SelectItem key={teacher._id} value={teacher.name}>
                          {teacher.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select course type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="credit">Credit</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* إخفاء السنة الدراسية إذا كان المعلم المختار هو Instructor */}
              {(() => {
                const selectedTeacher = form.watch('teacherName');
                const found = teachers.find((t: any) => t.name === selectedTeacher);
                // إذا لم يتم اختيار معلم أو تم اختيار طالب، أظهر السنة الدراسية
                // بافتراض أن أسماء الطلاب ليست ضمن قائمة teachers
                return (!found || (found && found.name.toLowerCase() !== 'teacher')) ? (
                  <FormField
                    control={form.control}
                    name="academicYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : null;
              })()}
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
             <FormField
              control={form.control}
              name="coverImage"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel>Cover Image</FormLabel>
                  <FormControl>
                    <Input type="file" accept="image/*" onChange={(e) => onChange(e.target.files)} {...rest} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline" disabled={isSubmitting}>
                        Cancel
                    </Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Course
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
