
import { Sidebar } from '@/components/ui/sidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import React from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[hsl(var(--background-primary))]">
      {/* Sidebar: horizontal bar at top on mobile, vertical on left on desktop */}
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
    </div>
  );
} 
