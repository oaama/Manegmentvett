import { LoginForm } from "./components/login-form";
import { BookOpenCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div className="mx-auto grid w-full max-w-sm gap-6">
          <div className="grid gap-2 text-center animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
              <div className="flex justify-center items-center gap-3">
                  <BookOpenCheck className="h-8 w-8 text-primary" />
                  <h1 className="text-3xl font-bold tracking-tighter">Mr Vet</h1>
              </div>
          </div>
          <Card className="animate-in fade-in-0 zoom-in-95 duration-500" style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}>
              <CardHeader className="text-center">
                  <CardTitle className="text-2xl tracking-tight">Welcome to your Dashboard</CardTitle>
                  <CardDescription>Please sign in to continue.</CardDescription>
              </CardHeader>
              <CardContent>
                  <LoginForm />
              </CardContent>
          </Card>
      </div>
    </div>
  );
}
