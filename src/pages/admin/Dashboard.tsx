
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { WelcomeSection } from '@/components/dashboard/WelcomeSection';
import { MetricsSection } from '@/components/dashboard/MetricsSection';
import { QuickTasksSection } from '@/components/dashboard/QuickTasksSection';
import { RecentActivityFeed } from '@/components/dashboard/RecentActivityFeed';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

const AdminDashboard = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [activeView, setActiveView] = useState('dashboard');

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // The AuthProvider will automatically update the session to null.
    // The ProtectedRoute component will then redirect the user to the login page.
    // A direct navigation call ensures faster UI feedback.
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    // If a session exists, fetch the user's profile.
    // If the session becomes null (e.g., after logout), clear the user profile.
    if (session) {
      const fetchUserProfile = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (data) {
          setUserProfile(data);
        }
      };
      fetchUserProfile();
    } else {
      setUserProfile(null);
    }
  }, [session]);

  if (!userProfile) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[hsl(var(--background-primary))]">
        <DashboardSidebar 
          activeView={activeView} 
          setActiveView={setActiveView}
          userRole={userProfile.role}
        />
        
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 
                className="text-4xl text-[hsl(var(--text-accent))]"
                style={{ fontFamily: 'Caveat, cursive' }}
              >
                Today's Report
              </h1>
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="border-[hsl(var(--border-primary))]"
              >
                Logout
              </Button>
            </div>

            {activeView === 'dashboard' && (
              <div className="space-y-8">
                <WelcomeSection userProfile={userProfile} />
                <MetricsSection />
                <QuickTasksSection userRole={userProfile.role} />
                <RecentActivityFeed />
              </div>
            )}

            {activeView === 'bookings' && (
              <div className="text-center py-20">
                <h2 className="text-2xl mb-4" style={{ fontFamily: 'Caveat, cursive' }}>
                  Bookings Management
                </h2>
                <p className="text-[hsl(var(--text-secondary))]">
                  Coming soon - manage all bookings here
                </p>
              </div>
            )}

            {activeView === 'trees' && (
              <div className="text-center py-20">
                <h2 className="text-2xl mb-4" style={{ fontFamily: 'Caveat, cursive' }}>
                  Trees Management
                </h2>
                <p className="text-[hsl(var(--text-secondary))]">
                  Coming soon - manage all trees here
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
