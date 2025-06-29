
// ABOUTME: This component is the universal site footer.
// ABOUTME: It contains copyright information and navigation links.
import { Link } from 'react-router-dom';
import { useAuthSession } from '@/hooks/useAuthSession';

const Footer = () => {
  const { session, handleLogout } = useAuthSession();
  return (
    <footer className="bg-[hsl(var(--background-primary))] py-8 px-4 border-t border-[hsl(var(--stone))] border-opacity-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4">
          <div className="text-center md:text-left order-2 md:order-1">
            <p className="text-sm text-[hsl(var(--stone))] mb-2">
              © 2025 Lâm Hà Farmstay. All stories shared with love.
            </p>
            <p className="text-xs text-[hsl(var(--stone))] opacity-80">
              Central Highlands, Vietnam
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 items-center order-1 md:order-2">
            <Link 
              to="/our-story" 
              className="text-sm text-[hsl(var(--stone))] transition-colors focus:outline-none focus:ring-2 focus:ring-[hsl(var(--focus))] focus:ring-offset-2 rounded-sm px-2 py-1"
            >
              Our Story
            </Link>
            <Link 
              to="/connect" 
              className="text-sm text-[hsl(var(--stone))] transition-colors focus:outline-none focus:ring-2 focus:ring-[hsl(var(--focus))] focus:ring-offset-2 rounded-sm px-2 py-1"
            >
              Contact
            </Link>
            {session ? (
              <button
                onClick={handleLogout}
                className="text-xs text-[hsl(var(--stone))] opacity-60 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--focus))] focus:ring-offset-2 rounded-sm px-4 py-4 min-h-[44px] inline-flex items-center justify-center"
              >
                Log Out
              </button>
            ) : (
              <Link
                to="/login"
                className="text-xs text-[hsl(var(--stone))] opacity-60 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--focus))] focus:ring-offset-2 rounded-sm px-4 py-4 min-h-[44px] inline-flex items-center justify-center"
              >
                Staff Login
              </a >
            )}

            <div className="hidden md:block w-px h-4 bg-[hsl(var(--stone))] opacity-30" aria-hidden="true"></div>

            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-[hsl(var(--stone))] opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-[hsl(var(--focus))] focus:ring-offset-2 rounded-sm p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-[hsl(var(--stone))] opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-[hsl(var(--focus))] focus:ring-offset-2 rounded-sm p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
