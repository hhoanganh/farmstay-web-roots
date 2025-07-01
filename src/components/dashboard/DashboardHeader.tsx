import { useAuth } from '@/providers/AuthProvider';
import { Book, TreePine, FileText, BookOpen, Users } from 'lucide-react';

const navLinks = [
  { href: '/admin/bookings', label: 'Bookings', icon: <Book className="w-5 h-5" /> },
  { href: '/admin/trees', label: 'Trees', icon: <TreePine className="w-5 h-5" /> },
  { href: '/admin/content/pages', label: 'Pages', icon: <FileText className="w-5 h-5" /> },
  { href: '/admin/content/journal', label: 'Journal', icon: <BookOpen className="w-5 h-5" /> },
  // Staff link is admin-only - some features only for admin.
];

export function DashboardHeader() {
  const { userProfile } = useAuth();
  return (
    <header className="flex items-center gap-2 px-4 py-3 border-b bg-background overflow-x-auto">
      <h1 className="text-xl font-caveat text-accent whitespace-nowrap mr-4">Lâm Hà Farmstay</h1>
      {navLinks.map(link => (
        <a
          key={link.href}
          href={link.href}
          className="flex items-center gap-1 px-3 py-2 rounded hover:bg-[hsl(var(--background-secondary))] whitespace-nowrap transition-colors"
        >
          {link.icon}
          <span>{link.label}</span>
        </a>
      ))}
      {userProfile?.role === 'admin' && (
        <a
          href="/admin/settings/staff"
          className="flex items-center gap-1 px-3 py-2 rounded hover:bg-[hsl(var(--background-secondary))] whitespace-nowrap transition-colors"
        >
          <Users className="w-5 h-5" />
          <span>Staff</span>
        </a>
      )}
      {/* Add user menu or other header content here if needed */}
    </header>
  );
} 