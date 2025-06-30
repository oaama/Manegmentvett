"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Save } from "lucide-react"
import { updateAdminCredentials } from "../actions"

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  currentPassword: z.string().min(1, { message: "Current password is required to make changes." }),
  newPassword: z.string().min(8, { message: "New password must be at least 8 characters." }).optional().or(z.literal('')),
  confirmPassword: z.string().optional(),
}).refine(data => {
  if (data.newPassword && data.newPassword !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: "New passwords do not match.",
  path: ["confirmPassword"],
});


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : <Save />}
      Save Changes
    </Button>
  )
}

const initialState = {
  success: false,
  message: "",
}

export function AccountForm() {
    const { toast } = useToast();
    const [state, formAction] = useActionState(updateAdminCredentials, initialState);

    // TODO: Fetch current admin email and set as default value
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "", // Fetched from API later
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    React.useEffect(() => {
        if (state.message) {
            toast({
                title: state.success ? "Success" : "Error",
                description: state.message,
                variant: state.success ? "default" : "destructive",
            })
        }
        if (state.success) {
            form.reset({
                ...form.getValues(),
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        }
    }, [state, toast, form]);

  return (
     <Form {...form}>
        <form action={formAction} className="space-y-6 max-w-lg">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your-email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password (Optional)</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter a new password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Confirm your new password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your current password to save changes" {...field} required/>
                  </FormControl>
                   <FormMessage />
                </FormItem>
              )}
            />

            <SubmitButton />
        </form>
     </Form>
  )
}
