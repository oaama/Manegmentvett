"use client"

import { useEffect } from "react"
import { useFormState, useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
import { login } from "../actions"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Login"}
    </Button>
  )
}

const initialState = {
  success: false,
  message: "",
}

export function LoginForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [state, formAction] = useFormState(login, initialState)

  useEffect(() => {
    if (state.success) {
      toast({
        title: "Login Successful",
        description: "Welcome to the dashboard!",
      })
      router.push("/dashboard")
    }
  }, [state.success, router, toast])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Login</CardTitle>
        <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="admin@elearn.com"
              required
              defaultValue="admin@elearn.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                defaultValue="admin123"
            />
          </div>
          {state?.message && !state.success && (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  )
}
