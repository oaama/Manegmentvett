"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { User } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Wand2, Loader2, Send } from "lucide-react"
import { analyzeNotification } from "@/ai/flows/analyzeNotification"

const formSchema = z.object({
  target: z.string().min(1, "Target is required"),
  specificUser: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
}).refine(data => {
    if (data.target === 'specific' && !data.specificUser) {
        return false;
    }
    return true;
}, {
    message: "Please enter a user ID",
    path: ["specificUser"],
});

type NotificationFormProps = {
    users: User[];
}

export function NotificationForm({ users }: NotificationFormProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      target: "all",
      specificUser: "",
      title: "",
      message: "",
    },
  })

  const watchTarget = form.watch("target")

  function onSubmit(values: z.infer<typeof formSchema>) {
    // TODO: connect to /admin/notify (POST)
    console.log(values)
    toast({
      title: "Notification Sent!",
      description: `Your message "${values.title}" has been sent.`,
    })
    form.reset()
  }

  const handleAnalyze = async () => {
    const { title, message } = form.getValues();
    if (!title || !message) {
      toast({
        title: "Analysis Failed",
        description: "Please provide a title and message to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzeNotification({ title, message });
      if (result.isSafe) {
        toast({
          title: "Analysis Complete",
          description: result.reason,
        });
      } else {
        toast({
          title: "Content Warning",
          description: result.reason,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("AI analysis failed:", error);
      toast({
        title: "Analysis Error",
        description: "Could not analyze the content at this time.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compose Message</CardTitle>
        <CardDescription>Send a notification to users.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="target"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Send To</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a target audience" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="students">All Students</SelectItem>
                      <SelectItem value="instructors">All Instructors</SelectItem>
                      <SelectItem value="specific">Specific User</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchTarget === "specific" && (
              <FormField
                control={form.control}
                name="specificUser"
                render={({ field }) => (
                  <FormItem>
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
            
            <div className="flex flex-col sm:flex-row gap-2">
                <Button type="button" variant="outline" onClick={handleAnalyze} disabled={isAnalyzing}>
                    {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                    Analyze with AI
                </Button>
                <Button type="submit" className="flex-grow">
                    <Send className="mr-2 h-4 w-4" />
                    Send Notification
                </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
