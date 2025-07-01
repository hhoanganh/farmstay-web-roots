import React from 'react';
import { Book, TreePine, FileText, BookOpen, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/AuthProvider';

// Sidebar links as data
const sidebarLinks = [
  { href: '/admin/bookings', label: 'Bookings', icon: <Book className="w-5 h-5" /> },
  { href: '/admin/trees', label: 'Trees', icon: <TreePine className="w-5 h-5" /> },
  { href: '/admin/content/pages', label: 'Pages', icon: <FileText className="w-5 h-5" /> },
  { href: '/admin/content/journal', label: 'Journal', icon: <BookOpen className="w-5 h-5" /> },
  // Staff link is admin-only, handled in Sidebar component
];

export function Sidebar() {
  const { userProfile } = useAuth();
  return (
    <nav
      className={cn(
        'flex flex-row md:flex-col w-full md:w-64 h-auto md:h-full bg-sidebar text-sidebar-foreground border-b md:border-b-0 md:border-r overflow-x-auto md:overflow-x-visible',
      )}
      aria-label="Sidebar navigation"
    >
      {sidebarLinks.map(link => (
        <a
          key={link.href}
          href={link.href}
          className="px-4 py-2 flex items-center gap-2 hover:bg-[hsl(var(--background-secondary))] whitespace-nowrap transition-colors"
        >
          {link.icon}
          <span>{link.label}</span>
        </a>
      ))}
      {/* Admin-only link */}
      {userProfile?.role === 'admin' && (
        <a
          href="/admin/settings/staff"
          className="px-4 py-2 flex items-center gap-2 hover:bg-[hsl(var(--background-secondary))] whitespace-nowrap transition-colors"
        >
          <Users className="w-5 h-5" />
          <span>Staff</span>
        </a>
      )}
    </nav>
  );
}
