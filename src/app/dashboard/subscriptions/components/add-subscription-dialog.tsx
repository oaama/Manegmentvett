
"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, PlusCircle } from "lucide-react"

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
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { User, Course } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import api from "@/lib/api"


const formSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  courseId: z.string().min(1, "Course is required"),
})


export function AddSubscriptionDialog() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const { toast } = useToast()
  const [students, setStudents] = React.useState<User[]>([])
  const [courses, setCourses] = React.useState<Course[]>([])
  const [studentsLoading, setStudentsLoading] = React.useState(true)
  const [coursesLoading, setCoursesLoading] = React.useState(true)
  const [studentInput, setStudentInput] = React.useState("")
  const [studentError, setStudentError] = React.useState("")

  React.useEffect(() => {
    setStudentsLoading(true);
    api.get('/users').then(res => {
      setStudents((res.data.users || []).filter((u: User) => u.role === 'student'))
    }).finally(() => setStudentsLoading(false));
    setCoursesLoading(true);
    api.get('/api/courses').then(res => {
      let coursesArr = res.data.courses || res.data || [];
      if (!Array.isArray(coursesArr) && typeof coursesArr === 'object') {
        coursesArr = Object.values(coursesArr);
      }
      // ترتيب الكورسات أبجديًا حسب الاسم
      coursesArr = coursesArr.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      setCourses(coursesArr);
    }).finally(() => setCoursesLoading(false));
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentId: "",
      courseId: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    setStudentError("");
    // تحقق أن الطالب موجود فعليًا
    const found = students.find(s => s._id === values.studentId);
    if (!found) {
      setStudentError("Please select a valid student from the list.");
      setIsSubmitting(false);
      return;
    }
    try {
        await api.post('/admin/subscriptions', values);
        toast({
            title: "Subscription Added",
            description: "The student has been successfully subscribed to the course.",
        });
        setOpen(false);
        form.reset();
        setStudentInput("");
        router.refresh();
    } catch (error: any) {
        toast({
            title: "Error Adding Subscription",
            description: error.response?.data?.msg || "An unexpected error occurred.",
            variant: "destructive",
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Subscription
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Subscription</DialogTitle>
          <DialogDescription>
            Manually subscribe a student to a course using their IDs.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="studentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student</FormLabel>
                  {studentsLoading ? (
                    <Skeleton className="h-10 w-full rounded" />
                  ) : (
                    <>
                      <Input
                        placeholder="Type student name, email, or ID"
                        value={studentInput}
                        onChange={e => {
                          const input = e.target.value;
                          setStudentInput(input);
                          // لا نغيّر الفورم إلا عند اختيار اقتراح أو تطابق تام
                          const found = students.find(s =>
                            s._id === input ||
                            s.name?.toLowerCase() === input.toLowerCase() ||
                            s.email?.toLowerCase() === input.toLowerCase()
                          );
                          if (found) {
                            field.onChange(found._id);
                            setStudentError("");
                          } else {
                            field.onChange("");
                          }
                        }}
                        list="students-list"
                        autoComplete="off"
                        onBlur={e => {
                          // عند الخروج من الحقل، إذا لم يكن الطالب صحيحًا، أظهر خطأ
                          const found = students.find(s =>
                            s.name?.toLowerCase() === studentInput.toLowerCase() ||
                            s.email?.toLowerCase() === studentInput.toLowerCase() ||
                            s._id === studentInput
                          );
                          if (found) {
                            setStudentInput(found.name);
                            field.onChange(found._id);
                            setStudentError("");
                          } else if (studentInput) {
                            setStudentError("Please select a valid student from the list.");
                            field.onChange("");
                          } else {
                            setStudentError("");
                          }
                        }}
                      />
                      <datalist id="students-list">
                        {students.filter(s => {
                          if (!studentInput) return true;
                          const q = studentInput.toLowerCase();
                          return (
                            s._id.toLowerCase().includes(q) ||
                            (s.name && s.name.toLowerCase().includes(q)) ||
                            (s.email && s.email.toLowerCase().includes(q))
                          );
                        }).map((student) => (
                          <option key={student._id} value={student.name}>{student.name} ({student.email})</option>
                        ))}
                      </datalist>
                      {studentError && <div className="text-sm text-red-500 mt-1">{studentError}</div>}
                    </>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="courseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course</FormLabel>
                  {coursesLoading ? (
                    <Skeleton className="h-10 w-full rounded" />
                  ) : (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a course" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course._id} value={course._id}>
                            <div className="flex items-center gap-2">
                              {course.coverImage && (
                                <img
                                  src={course.coverImage}
                                  alt={course.name}
                                  className="w-8 h-8 object-cover rounded"
                                  style={{ minWidth: 32, minHeight: 32 }}
                                />
                              )}
                              <span>
                                {course.name}
                                {course.sectionType ?
                                  ` (${course.sectionType === 'practical' || course.sectionType === 'عملي' ? 'عملي' : 'نظري'})`
                                  : ''}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
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
                    Add Subscription
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
