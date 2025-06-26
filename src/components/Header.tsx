// ABOUTME: This component is the single, universal site header.
// ABOUTME: It is responsive and used on all pages.
import { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 px-4 py-4 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[hsl(var(--background-primary))] shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex-1 flex justify-start">
          <Link to="/" className="text-2xl font-bold text-[hsl(var(--text-accent))] transition-opacity focus:outline-none focus:ring-2 focus:ring-[hsl(var(--focus))] focus:ring-offset-2 rounded-sm py-2 min-h-[44px] inline-flex items-center" style={{ fontFamily: 'Caveat, cursive' }}>
            Lâm Hà Farmstay
          </Link>
        </div>

        <div className="flex-1 flex justify-center">
          <div ref={menuRef} className="relative">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-[hsl(var(--text-primary))] transition-colors font-medium ui-text focus:outline-none focus:ring-2 focus:ring-[hsl(var(--focus))] focus:ring-offset-2 rounded-sm px-3 py-2 min-h-[44px] flex items-center">
              Menu
            </button>
            {isMenuOpen && (
              <nav className="absolute top-full mt-2 w-48 bg-[hsl(var(--background-primary))] shadow-lg rounded-md border border-gray-200/10 flex flex-col items-start">
                <Link to="/our-story" onClick={() => setIsMenuOpen(false)} className="w-full text-left text-[hsl(var(--text-primary))] px-3 py-4 min-h-[44px] flex items-center transition-colors">Our Story</Link>
                <Link to="/homestay" onClick={() => setIsMenuOpen(false)} className="w-full text-left text-[hsl(var(--text-primary))] px-3 py-4 min-h-[44px] flex items-center transition-colors">Homestay</Link>
                <Link to="/farm-and-garden" onClick={() => setIsMenuOpen(false)} className="w-full text-left text-[hsl(var(--text-primary))] px-3 py-4 min-h-[44px] flex items-center transition-colors">Farm & Garden</Link>
                <Link to="/experiences" onClick={() => setIsMenuOpen(false)} className="w-full text-left text-[hsl(var(--text-primary))] px-3 py-4 min-h-[44px] flex items-center transition-colors">Experiences</Link>
              </nav>
            )}
          </div>
        </div>

        <div className="flex-1 flex justify-end">
          <Link to="/connect" className="text-[hsl(var(--text-primary))] transition-colors font-medium ui-text focus:outline-none focus:ring-2 focus:ring-[hsl(var(--focus))] focus:ring-offset-2 rounded-sm px-2 py-1 min-h-[44px] flex items-center">
            Connect
          </Link>
        </div>   
      </div>
    </header>
  );
};

export default Header;
