
import { Home, Calendar, TreePine, CheckSquare, BookOpen, Users } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

interface DashboardSidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  userRole: string;
  userProfile: any;
  onLogout: () => void;
  isLoggingOut: boolean;
}

const staffMenuItems = [
  { id: 'dashboard', title: 'Dashboard', icon: Home },
  { id: 'bookings', title: 'Bookings', icon: Calendar },
  { id: 'trees', title: 'Trees', icon: TreePine },
  { id: 'tasks', title: 'Tasks', icon: CheckSquare },
];

const adminMenuItems = [
  { id: 'dashboard', title: 'Dashboard', icon: Home },
  { id: 'bookings', title: 'Bookings', icon: Calendar },
  { id: 'trees', title: 'Trees', icon: TreePine },
  { id: 'tasks', title: 'Tasks', icon: CheckSquare },
  { id: 'journal', title: 'Journal', icon: BookOpen },
  { id: 'staff', title: 'Staff', icon: Users },
];

export function DashboardSidebar({ 
  activeView, 
  setActiveView, 
  userRole, 
  userProfile, 
  onLogout, 
  isLoggingOut 
}: DashboardSidebarProps) {
  const menuItems = userRole === 'admin' ? adminMenuItems : staffMenuItems;

  return (
    <Sidebar className="w-60 border-r border-[hsl(var(--border-primary))] bg-[hsl(var(--background-secondary))]">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel 
            className="text-[hsl(var(--text-accent))] text-lg mb-8 p-4"
            style={{ fontFamily: 'Caveat, cursive' }}
          >
            Lâm Hà Farmstay
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2 px-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveView(item.id)}
                    isActive={activeView === item.id}
                    className={`w-full justify-start h-12 ${
                      activeView === item.id 
                        ? 'bg-[hsl(var(--background-primary))] text-[hsl(var(--text-primary))] shadow-sm' 
                        : 'hover:bg-[hsl(var(--background-primary))] hover:bg-opacity-50'
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    <span style={{ fontFamily: 'Inter, sans-serif' }}>
                      {item.title}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 mt-auto border-t border-[hsl(var(--border-primary))]">
        <div className="space-y-3">
          <div className="text-sm">
            <p 
              className="font-medium text-[hsl(var(--text-primary))]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {userProfile?.full_name || 'User'}
            </p>
            <p 
              className="text-xs text-[hsl(var(--text-secondary))] capitalize"
              style={{ fontFamily: 'IBM Plex Mono, monospace' }}
            >
              {userRole}
            </p>
          </div>
          <Button 
            onClick={onLogout}
            disabled={isLoggingOut}
            variant="outline"
            size="sm"
            className="w-full border-[hsl(var(--border-primary))] hover:bg-[hsl(var(--background-primary))]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {isLoggingOut ? 'Logging out...' : 'Log Out'}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
