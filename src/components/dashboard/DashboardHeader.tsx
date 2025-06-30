import { useSidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { PanelLeft } from 'lucide-react';

export function DashboardHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="flex items-center gap-4 px-4 py-3 border-b bg-background">
      {/* Hamburger menu button: only visible on mobile */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={toggleSidebar}
        aria-label="Open menu"
      >
        <PanelLeft className="h-6 w-6" />
      </Button>
      <h1 className="text-xl font-caveat text-accent">Lâm Hà Farmstay</h1>
      {/* Add any other dashboard header content here */}
    </header>
  );
} 