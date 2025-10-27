
"use client";

import { Recycle } from 'lucide-react';
import { useUser } from '@/contexts/user-context';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function AppHeader() {
  const { isAuthenticated, logout, user } = useUser();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="bg-primary text-primary-foreground p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between max-w-4xl">
        <div className="flex items-center gap-2">
          <Recycle className="h-8 w-8" />
          <h1 className="text-2xl font-bold">Win-Bin</h1>
        </div>
        {isAuthenticated && user && (
          <div className="flex items-center gap-2">
            <span className="text-sm hidden sm:inline">Hi, {user.name}!</span>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="hover:bg-primary/80 text-primary-foreground hover:text-primary-foreground">
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
