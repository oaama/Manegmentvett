import { LoginForm } from "./components/login-form";
import { BookOpenCheck } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
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
        <div className="absolute bottom-10 left-10 text-white p-4">
            <h2 className="text-3xl font-bold">Empowering the next generation of veterinarians.</h2>
            <p className="mt-2 text-lg max-w-xl text-white/80">
                Your central hub to manage courses, students, and content with precision and ease.
            </p>
        </div>
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[380px] gap-6">
          <div className="grid gap-4 text-center animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
            <div className="flex justify-center items-center gap-3">
                <BookOpenCheck className="h-10 w-10 text-primary" />
                <h1 className="text-4xl font-bold tracking-tighter">Mr Vet</h1>
            </div>
            <p className="text-balance text-muted-foreground">
              Admin Center Login
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
