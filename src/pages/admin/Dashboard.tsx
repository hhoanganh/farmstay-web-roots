import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { MorningReportView } from '@/components/dashboard/MorningReportView';
import { BookingsView } from '@/components/dashboard/BookingsView';
import { TreesView } from '@/components/dashboard/TreesView';
import { TasksView } from '@/components/dashboard/TasksView';
import { JournalView } from '@/components/dashboard/JournalView';
import { StaffView } from '@/components/dashboard/StaffView';

const AdminDashboard = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('dashboard');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
    }
    navigate('/login', { replace: true });
  };

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
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[hsl(var(--background-primary))]">
        <DashboardSidebar 
          activeView={activeView} 
          setActiveView={setActiveView}
          userRole={userProfile.role}
          userProfile={userProfile}
          onLogout={handleLogout}
          isLoggingOut={isLoggingOut}
        />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 bg-[hsl(var(--background-primary))]">
            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
