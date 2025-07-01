
import { useAuth } from '@/providers/AuthProvider';
import { Link, useLocation } from 'react-router-dom';
import { Book, TreePine, FileText, BookOpen, Users } from 'lucide-react';

const navLinks = [
  { href: '/admin/bookings', label: 'Bookings', icon: <Book className="w-5 h-5" /> },
  { href: '/admin/trees', label: 'Trees', icon: <TreePine className="w-5 h-5" /> },
  { href: '/admin/content/pages', label: 'Pages', icon: <FileText className="w-5 h-5" /> },
  { href: '/admin/content/journal', label: 'Journal', icon: <BookOpen className="w-5 h-5" /> },
];

export function DashboardHeader() {
  const { userProfile } = useAuth();
  const location = useLocation();

  return (
    <header className="flex items-center gap-2 px-4 py-3 border-b bg-background overflow-x-auto">
      <h1 className="text-xl font-caveat text-accent whitespace-nowrap mr-4">Lâm Hà Farmstay</h1>
      {navLinks.map(link => (
        <Link
          key={link.href}
          to={link.href}
          className={`flex items-center gap-1 px-3 py-2 rounded whitespace-nowrap transition-colors ${
            location.pathname === link.href 
              ? 'bg-[hsl(var(--background-secondary))] text-[hsl(var(--text-accent))]' 
              : 'hover:bg-[hsl(var(--background-secondary))]'
          }`}
        >
          {link.icon}
          <span>{link.label}</span>
        </Link>
      ))}
      {userProfile?.role === 'admin' && (
        <Link
          to="/admin/settings/staff"
          className={`flex items-center gap-1 px-3 py-2 rounded whitespace-nowrap transition-colors ${
            location.pathname === '/admin/settings/staff'
              ? 'bg-[hsl(var(--background-secondary))] text-[hsl(var(--text-accent))]' 
              : 'hover:bg-[hsl(var(--background-secondary))]'
          }`}
        >
          <Users className="w-5 h-5" />
          <span>Staff</span>
        </Link>
      )}
    </header>
  );
}
