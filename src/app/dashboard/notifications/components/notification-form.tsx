
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Send } from "lucide-react"
import React from "react"

import { Button } from "@/components/ui/button"
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import api from "@/lib/api"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
  targetGroup: z.enum(["specific", "all", "students", "instructors"]),
  targetUserId: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
}).refine(data => {
    if (data.targetGroup === 'specific') {
        return !!data.targetUserId && data.targetUserId.trim().length > 0;
    }
    return true;
}, {
    message: "User ID is required for specific targets.",
    path: ["targetUserId"],
});


export function NotificationForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      targetGroup: "specific",
      targetUserId: "",
      title: "",
      message: "",
    },
  })
  
  const targetGroup = form.watch("targetGroup");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    
    const payload = {
        title: values.title,
        message: values.message,
        userId: values.targetGroup === 'specific' ? values.targetUserId : values.targetGroup,
    }

    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1];
      await api.post('/api/notifications', payload, {
          headers: { Authorization: `Bearer ${token}` }
      });
      toast({
        title: "Notification Sent!",
        description: `Your message "${values.title}" has been sent.`,
      })
      form.reset()
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error Sending Notification",
        description: error.response?.data?.msg || "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compose Message</CardTitle>
        <CardDescription>Send a notification to a specific user or group.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <FormField
              control={form.control}
              name="targetGroup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Audience</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a target audience" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="specific">Specific User</SelectItem>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="students">All Students</SelectItem>
                      <SelectItem value="instructors">All Instructors</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {targetGroup === 'specific' && (
               <FormField
                control={form.control}
                name="targetUserId"
                render={({ field }) => (
                  <FormItem className="animate-in fade-in-0 duration-300">
                    <FormLabel>User ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the user's ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}


            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Upcoming Maintenance" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your notification message here."
                      className="resize-none"
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-center gap-4">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    Send Notification
                </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
