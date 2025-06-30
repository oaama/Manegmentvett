import { LoginForm } from "./components/login-form";
import { BookOpenCheck } from "lucide-react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function LoginPage() {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
       <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[380px] gap-6">
           <div className="grid gap-2 text-center animate-in fade-in-0 slide-in-from-bottom-2 duration-500 ease-out">
                <div className="flex justify-center items-center gap-3">
                    <BookOpenCheck className="h-10 w-10 text-primary" />
                    <h1 className="text-4xl font-bold tracking-tighter">Mr Vet</h1>
                </div>
                <p className="text-balance text-muted-foreground">
                    Admin Center Login
                </p>
            </div>
            <Card className="animate-in fade-in-0 slide-in-from-bottom-2 duration-700 ease-out">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Welcome to your Dashboard</CardTitle>
                    <CardDescription>
                        Please sign in to continue.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <LoginForm />
                </CardContent>
            </Card>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="https://placehold.co/1920x1080.png"
          alt="A veterinarian student studying."
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.3]"
          data-ai-hint="veterinarian student"
        />
      </div>
    </div>
  );
}
