
import { Suspense } from 'react';
import { AppHeader } from '@/components/layout/header';
import { IrctcFoodClient } from '@/components/irctc/irctc-food-client';
import { Loader2 } from 'lucide-react';

export default function IrctcFoodDemoPage() {
  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <AppHeader />
      <main className="flex-grow p-4 md:p-6 container mx-auto max-w-4xl">
        <Suspense fallback={
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        }>
          <IrctcFoodClient />
        </Suspense>
      </main>
    </div>
  );
}
