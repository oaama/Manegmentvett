"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { login } from "../actions"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2, Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <>Sign In <LogIn className="ml-2 h-4 w-4" /></>}
    </Button>
  )
}

const initialState = {
  success: false,
  message: "",
}

export function LoginForm() {
  const [state, formAction] = useActionState(login, initialState)
  const [showPassword, setShowPassword] = React.useState(false)

  return (
    <form action={formAction} className="grid gap-4">
      <div className="grid gap-2 animate-in fade-in-0 slide-in-from-bottom-2 duration-500 ease-out" style={{ animationDelay: '700ms', animationFillMode: 'backwards' }}>
        <Label htmlFor="email">Email</Label>
        <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
            id="email"
            name="email"
            type="email"
            placeholder="admin@elearn.com"
            required
            defaultValue="admin@elearn.com"
            className="pl-10"
            />
        </div>
      </div>
      <div className="grid gap-2 animate-in fade-in-0 slide-in-from-bottom-2 duration-500 ease-out" style={{ animationDelay: '800ms', animationFillMode: 'backwards' }}>
         <Label htmlFor="password">Password</Label>
        <div className="relative">
             <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
                id="password" 
                name="password" 
                type={showPassword ? "text" : "password"}
                required 
                defaultValue="admin123"
                className="pl-10 pr-10"
            />
             <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:bg-transparent"
                onClick={() => setShowPassword(prev => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
            >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
        </div>
      </div>
      {state?.message && !state.success && (
        <Alert variant="destructive" className="animate-in fade-in-0 duration-500 ease-out" style={{ animationDelay: '900ms', animationFillMode: 'backwards' }}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}
      <div className="animate-in fade-in-0 slide-in-from-bottom-2 duration-500 ease-out" style={{ animationDelay: '1000ms', animationFillMode: 'backwards' }}>
        <SubmitButton />
      </div>
    </form>
  )
}
