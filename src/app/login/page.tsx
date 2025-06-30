import { LoginForm } from "./components/login-form";
import { BookOpenCheck } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
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
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
             <div className="flex justify-center items-center gap-2 mb-2">
                <BookOpenCheck className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight">Mr Vet</h1>
             </div>
            <p className="text-balance text-muted-foreground">
              Enter your credentials to access the Admin Center
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
