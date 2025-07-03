
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider';
import { MorningReportView } from '@/components/dashboard/MorningReportView';
import { BookingsView } from '@/components/dashboard/BookingsView';
import TreesView from '@/components/dashboard/TreesView';
import { TasksView } from '@/components/dashboard/TasksView';
import JournalView from '@/components/dashboard/JournalView';
import StaffView from '@/components/dashboard/StaffView';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

const AdminDashboard = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('dashboard');

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <MorningReportView userRole={userProfile?.role} />;
      case 'bookings':
        return <BookingsView userRole={userProfile?.role} />;
      case 'trees':
        return <TreesView userRole={userProfile?.role} />;
      case 'tasks':
        return <TasksView userRole={userProfile?.role} />;
      case 'journal':
        return userProfile?.role === 'admin' ? <JournalView /> : null;
      case 'staff':
        return userProfile?.role === 'admin' ? <StaffView /> : null;
      default:
        return <MorningReportView userRole={userProfile?.role} />;
    }
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--background-primary))]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(var(--text-accent))] mx-auto mb-4"></div>
          <p className="text-[hsl(var(--text-secondary))]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(var(--background-primary))]">
      <DashboardHeader />
      <main className="flex-1 p-4">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;
