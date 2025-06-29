
import { Home, Calendar, TreePine, Settings, Users } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

interface DashboardSidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  userRole: string;
}

const menuItems = [
  { id: 'dashboard', title: 'Dashboard', icon: Home },
  { id: 'bookings', title: 'Bookings', icon: Calendar },
  { id: 'trees', title: 'Trees', icon: TreePine },
];

const ownerItems = [
  { id: 'staff', title: 'Staff', icon: Users },
  { id: 'settings', title: 'Settings', icon: Settings },
];

export function DashboardSidebar({ activeView, setActiveView, userRole }: DashboardSidebarProps) {
  return (
    <Sidebar className="w-60 border-r border-[hsl(var(--border-primary))]">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel 
            className="text-[hsl(var(--text-accent))] text-lg mb-4"
            style={{ fontFamily: 'Caveat, cursive' }}
          >
            Lâm Hà Farmstay
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveView(item.id)}
                    isActive={activeView === item.id}
                    className="w-full justify-start"
                  >
                    <item.icon className="mr-3 h-4 w-4" />
                    {item.title}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {userRole === 'owner' && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sm text-[hsl(var(--text-secondary))]">
              Owner Only
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {ownerItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => setActiveView(item.id)}
                      isActive={activeView === item.id}
                      className="w-full justify-start"
                    >
                      <item.icon className="mr-3 h-4 w-4" />
                      {item.title}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
