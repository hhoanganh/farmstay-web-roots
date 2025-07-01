import { Sidebar } from '@/components/ui/sidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import React from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[hsl(var(--background-primary))]">
      {/* Sidebar: horizontal bar at top on mobile, vertical on left on desktop */}
      <Sidebar>
        {/* Sidebar content: replace with your actual links/components */}
        <nav className="flex flex-1 flex-row md:flex-col gap-2 px-2 py-2 overflow-x-auto">
          <a href="/admin/bookings" className="px-4 py-2 rounded hover:bg-[hsl(var(--background-secondary))]">Bookings</a>
          <a href="/admin/trees" className="px-4 py-2 rounded hover:bg-[hsl(var(--background-secondary))]">Trees</a>
          <a href="/admin/content/pages" className="px-4 py-2 rounded hover:bg-[hsl(var(--background-secondary))]">Pages</a>
          <a href="/admin/content/journal" className="px-4 py-2 rounded hover:bg-[hsl(var(--background-secondary))]">Journal</a>
          <a href="/admin/settings/staff" className="px-4 py-2 rounded hover:bg-[hsl(var(--background-secondary))]">Staff</a>
        </nav>
      </Sidebar>
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
    </div>
  );
} 