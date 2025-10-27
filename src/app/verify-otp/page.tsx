
"use client";

import { AppHeader } from "@/components/layout/header";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function VerifyOtpPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/');
  }, [router]);

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-grow flex items-center justify-center p-4 bg-secondary">
        <p>This page is no longer in use. Redirecting...</p>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} Win-Bin. All rights reserved.
      </footer>
    </div>
  );
}
