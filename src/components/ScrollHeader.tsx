
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ScrollHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 px-4 py-4 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[hsl(var(--background-primary))] shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link 
          to="/" 
          className="text-2xl font-bold text-[hsl(var(--text-accent))] hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-[hsl(var(--focus))] focus:ring-offset-2 rounded-sm"
          style={{ fontFamily: 'Caveat, cursive' }}
        >
          Lâm Hà Farmstay
        </Link>
        
        <Link 
          to="/connect" 
          className="text-[hsl(var(--text-primary))] hover:text-[hsl(var(--text-accent))] transition-colors font-medium ui-text focus:outline-none focus:ring-2 focus:ring-[hsl(var(--focus))] focus:ring-offset-2 rounded-sm px-2 py-1 min-h-[44px] flex items-center"
        >
          Connect
        </Link>
      </div>
    </header>
  );
};

export default ScrollHeader;
