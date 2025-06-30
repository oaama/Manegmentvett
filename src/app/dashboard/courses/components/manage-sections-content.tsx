
"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { PlusCircle, Loader2, Trash2 } from "lucide-react"

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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import type { Course, Section } from "@/lib/types"
import api from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

const sectionFormSchema = z.object({
  sectionTitle: z.string().min(3, "Title must be at least 3 characters"),
  sectionType: z.string().min(3, "Type must be at least 3 characters (e.g. 'video', 'quiz')"),
  videos: z.string().refine((val) => {
      if (val.trim() === '') return false;
      try {
        const parsed = JSON.parse(val)
        return Array.isArray(parsed)
      } catch (e) {
        return false
      }
    }, {
      message: "Must be a valid JSON array string. E.g., [{\"title\": \"Intro\"}]",
    }),
})

function AddSectionForm({ course, onSectionAdded }: { course: Course, onSectionAdded: () => void }) {
  const { toast } = useToast()
  const [open, setOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<z.infer<typeof sectionFormSchema>>({
    resolver: zodResolver(sectionFormSchema),
    defaultValues: {
      sectionTitle: "",
      sectionType: "video",
      videos: "[]",
    },
  })

  async function onSubmit(values: z.infer<typeof sectionFormSchema>) {
    setIsSubmitting(true)
    try {
      await api.post(`/courses/${course._id}/sections`, values)
      toast({
        title: "Section Added",
        description: `The section "${values.sectionTitle}" has been added to the course.`,
      })
      setOpen(false)
      form.reset()
      onSectionAdded()
    } catch (error: any) {
      toast({
        title: "Error Adding Section",
        description: error.response?.data?.msg || "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusCircle className="mr-2" />
          Add Section
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Section</DialogTitle>
          <DialogDescription>Fill in the details to add a new section to "{course.name}".</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="sectionTitle"
              render={({ field }) => (
                <FormItem><FormLabel>Section Title</FormLabel><FormControl><Input placeholder="e.g., Introduction" {...field} /></FormControl><FormMessage /></FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sectionType"
              render={({ field }) => (
                <FormItem><FormLabel>Section Type</FormLabel><FormControl><Input placeholder="e.g., video" {...field} /></FormControl><FormMessage /></FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="videos"
              render={({ field }) => (
                <FormItem><FormLabel>Videos (JSON Array)</FormLabel><FormControl><Textarea placeholder='[{"videoTitle": "Intro", "videoUrl": "...", "duration": "10:00"}]' rows={5} {...field} /></FormControl><FormMessage /></FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline" disabled={isSubmitting}>Cancel</Button></DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 animate-spin" />}
                Add Section
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export function ManageSectionsContent({ course }: { course: Course }) {
  const { toast } = useToast()
  const [sections, setSections] = React.useState<Section[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  const fetchSections = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await api.get(`/courses/${course._id}/sections`)
      setSections(response.data.sections || [])
    } catch (error) {
        console.warn("Could not fetch sections. The endpoint GET /courses/:id/sections may be missing, or the course has no sections yet.", error)
        setSections([]);
    } finally {
      setIsLoading(false)
    }
  }, [course._id, toast])

  React.useEffect(() => {
    fetchSections()
  }, [fetchSections])

  return (
    <>
      <DialogHeader>
        <DialogTitle>Manage Sections for "{course.name}"</DialogTitle>
        <DialogDescription>View, add, or remove sections for this course.</DialogDescription>
      </DialogHeader>
      <div className="my-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
               <CardTitle className="text-lg">Section List</CardTitle>
               <CardDescription>Total sections: {sections.length}</CardDescription>
            </div>
            <AddSectionForm course={course} onSectionAdded={fetchSections} />
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2">
              {isLoading ? (
                <div className="space-y-3 p-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-4/5" />
                </div>
              ) : sections.length > 0 ? (
                sections.map((section, index) => (
                  <React.Fragment key={section._id}>
                    <div className="flex items-center justify-between py-2">
                      <div className="font-medium">{section.sectionTitle}</div>
                      <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground capitalize">{section.sectionType}</span>
                      </div>
                    </div>
                    {index < sections.length - 1 && <Separator />}
                  </React.Fragment>
                ))
              ) : (
                <p className="text-center text-sm text-muted-foreground py-8">
                  No sections found. Use the "Add Section" button to create one.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
