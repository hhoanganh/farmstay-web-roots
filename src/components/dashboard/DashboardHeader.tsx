import { useAuth } from '@/providers/AuthProvider';
import { Link, useLocation } from 'react-router-dom';
import { Book, TreePine, FileText, BookOpen, Users, Home, CheckSquare } from 'lucide-react';
import { useAuthSession } from '@/hooks/useAuthSession';

const navLinks = [
  { href: '/admin/bookings', label: 'Bookings', icon: <Book className="w-5 h-5" /> },
  { href: '/admin/trees', label: 'Trees', icon: <TreePine className="w-5 h-5" /> },
  { href: '/admin/tasks', label: 'Tasks', icon: <CheckSquare className="w-5 h-5" /> },
  { href: '/admin/content/journal', label: 'Journal', icon: <BookOpen className="w-5 h-5" /> },
];

export function DashboardHeader() {
  const { userProfile } = useAuth();
  const { handleLogout } = useAuthSession();
  const location = useLocation();

  return (
    <header className="flex items-center gap-2 px-4 py-3 border-b bg-background overflow-x-auto">
      <Link to="/" className="flex items-center justify-center mr-2 p-2 rounded hover:bg-[hsl(var(--background-secondary))]">
        <Home className="w-6 h-6 text-[hsl(var(--text-accent))]" />
      </Link>
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
      <div className="flex-1" />
      {userProfile && (
        <span className="ml-auto mr-4 text-[hsl(var(--text-accent))] font-medium whitespace-nowrap">
          {userProfile.full_name || userProfile.email}
          {userProfile.role && (
            <span className="ml-2 px-2 py-1 rounded bg-[hsl(var(--background-secondary))] text-xs font-semibold uppercase align-middle">
              {userProfile.role}
            </span>
          )}
        </span>
      )}
      <button
        onClick={handleLogout}
        className="ml-auto px-3 py-2 rounded text-[hsl(var(--text-accent))] hover:bg-[hsl(var(--background-secondary))] font-semibold whitespace-nowrap"
        type="button"
      >
        Log out
      </button>
    </header>
  );
}
