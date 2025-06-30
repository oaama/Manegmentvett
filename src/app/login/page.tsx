import { LoginForm } from "./components/login-form";
import { BookOpenCheck } from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
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
      <div className="hidden bg-muted lg:block relative">
        <Image
          src="https://placehold.co/1920x1080.png"
          alt="A veterinarian student studying."
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          data-ai-hint="veterinarian student"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>
    </div>
  );
}
