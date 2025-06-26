
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[hsl(var(--background-primary))] shadow-sm px-4 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link 
          to="/" 
          className="text-2xl font-bold text-[hsl(var(--text-accent))] hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-[hsl(var(--focus))] focus:ring-offset-2 rounded-sm"
          style={{ fontFamily: 'Caveat, cursive' }}
        >
          Lâm Hà Farmstay
        </Link>
        
        <nav className="flex gap-6 items-center">
          <Link 
            to="/our-story" 
            className="text-[hsl(var(--text-primary))] hover:text-[hsl(var(--text-accent))] transition-colors font-medium ui-text focus:outline-none focus:ring-2 focus:ring-[hsl(var(--focus))] focus:ring-offset-2 rounded-sm px-2 py-1 min-h-[44px] flex items-center"
          >
            Our Story
          </Link>
          <Link 
            to="/homestay" 
            className="text-[hsl(var(--text-primary))] hover:text-[hsl(var(--text-accent))] transition-colors font-medium ui-text focus:outline-none focus:ring-2 focus:ring-[hsl(var(--focus))] focus:ring-offset-2 rounded-sm px-2 py-1 min-h-[44px] flex items-center"
          >
            Homestay
          </Link>
          <Link 
            to="/farm-and-garden" 
            className="text-[hsl(var(--text-primary))] hover:text-[hsl(var(--text-accent))] transition-colors font-medium ui-text focus:outline-none focus:ring-2 focus:ring-[hsl(var(--focus))] focus:ring-offset-2 rounded-sm px-2 py-1 min-h-[44px] flex items-center"
          >
            Farm & Garden
          </Link>
          <Link 
            to="/experiences" 
            className="text-[hsl(var(--text-primary))] hover:text-[hsl(var(--text-accent))] transition-colors font-medium ui-text focus:outline-none focus:ring-2 focus:ring-[hsl(var(--focus))] focus:ring-offset-2 rounded-sm px-2 py-1 min-h-[44px] flex items-center"
          >
            Experiences
          </Link>
          <Link 
            to="/connect" 
            className="text-[hsl(var(--text-primary))] hover:text-[hsl(var(--text-accent))] transition-colors font-medium ui-text focus:outline-none focus:ring-2 focus:ring-[hsl(var(--focus))] focus:ring-offset-2 rounded-sm px-2 py-1 min-h-[44px] flex items-center"
          >
            Connect
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
