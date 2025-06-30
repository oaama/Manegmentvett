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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

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
      await api.post(`/courses/${course.id}/sections`, values)
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
        description: error.response?.data?.message || "An unexpected error occurred.",
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
      const response = await api.get(`/courses/${course.id}/sections`)
      setSections(response.data.sections || [])
    } catch (error) {
      console.error("Failed to fetch sections:", error)
      toast({
        title: "Could not load sections",
        description: "This course may not have sections yet, or the API endpoint is unavailable.",
        variant: "default",
      })
      setSections([])
    } finally {
      setIsLoading(false)
    }
  }, [course.id, toast])

  React.useEffect(() => {
    fetchSections()
  }, [fetchSections])

  const handleDelete = async (sectionId: string) => {
    try {
      await api.delete(`/courses/${course.id}/sections/${sectionId}`)
      toast({ title: "Section Deleted", description: "The section has been removed." })
      fetchSections()
    } catch (error: any) {
      toast({
        title: "Error Deleting Section",
        description: error.response?.data?.message || "This feature might not be available yet.",
        variant: "destructive",
      })
    }
  }

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
                  <React.Fragment key={section.id}>
                    <div className="flex items-center justify-between py-2">
                      <div className="font-medium">{section.sectionTitle}</div>
                      <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground capitalize">{section.sectionType}</span>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the section "{section.sectionTitle}".
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(section.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
