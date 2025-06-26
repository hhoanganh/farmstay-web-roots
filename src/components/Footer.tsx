
// ABOUTME: This component is the universal site footer.
// ABOUTME: It contains copyright information and navigation links.
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[hsl(var(--background-primary))] py-8 px-4 border-t border-[hsl(var(--stone))] border-opacity-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-[hsl(var(--stone))] mb-2">
              © 2024 Lâm Hà Farmstay. All stories shared with love.
            </p>
            <p className="text-xs text-[hsl(var(--stone))] opacity-80">
              Central Highlands, Vietnam
            </p>
          </div>
          
          <div className="flex gap-6 items-center">
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
            <Link 
              to="/login" 
               className="text-xs text-[hsl(var(--stone))] opacity-60 transition-opacity focus:outline-none focus:ring-2 focus:ring-[hsl(var(--focus))] focus:ring-offset-2 rounded-sm px-4 py-4 min-h-[44px] inline-flex items-center justify-center"
            >
              Staff Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
