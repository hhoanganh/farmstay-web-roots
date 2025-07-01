import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import React from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[hsl(var(--background-primary))]">
      <DashboardHeader />
      <main className="flex-1 p-4">
        {children}
      </main>
    </div>
  );
} 