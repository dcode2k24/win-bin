
"use client";

import { RegistrationForm } from "@/components/auth/registration-form";
import { useUser } from "@/contexts/user-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppHeader } from "@/components/layout/header";
import Image from "next/image";
import { Loader2 } from "lucide-react";


export default function HomePage() {
  const { isAuthenticated, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if authentication is not loading and user is authenticated.
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  // While loading, show a spinner to prevent flicker.
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex-grow flex flex-col items-center justify-center p-4 bg-secondary">
           <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
           <p className="text-muted-foreground">Loading session...</p>
        </main>
      </div>
    );
  }

  // If authenticated after loading, the useEffect will redirect. 
  // This part of the code will briefly be rendered before redirection, or not at all if redirection is instant.
  // To avoid showing the login form to an authenticated user, we can return a loading state here as well.
  if (isAuthenticated) {
     return (
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex-grow flex flex-col items-center justify-center p-4 bg-secondary">
           <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
           <p className="text-muted-foreground">Redirecting to dashboard...</p>
        </main>
      </div>
    );
  }


  // If not loading and not authenticated, show the login page.
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-grow flex flex-col items-center justify-center p-4 bg-secondary">
        <div className="mb-8 text-center">
          <Image
            src="/main-logo.jpg"
            alt="Win-Bin Logo"
            width={150}
            height={150}
            className="mx-auto rounded-full object-contain bg-white p-2"
            data-ai-hint="recycle logo"
            priority
          />
          <p className="text-lg text-muted-foreground mt-4">
            Scan, Sort, and Save the Planet with Win-Bin!
          </p>
        </div>
        <RegistrationForm />
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} Win-Bin. All rights reserved.
      </footer>
    </div>
  );
}
