import { LoginForm } from "./components/login-form";
import { BookOpenCheck } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
            <BookOpenCheck className="h-12 w-12 text-primary mb-2" />
            <h1 className="text-3xl font-bold tracking-tight">Mr Vet Admin Center</h1>
            <p className="text-muted-foreground">Welcome back! Please sign in to continue.</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
