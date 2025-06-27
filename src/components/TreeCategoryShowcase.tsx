
import { Link } from 'react-router-dom';
import ImageWrapper from './ImageWrapper';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const TreeCategoryShowcase = () => {
  const avocadoAnimation = useScrollAnimation();
  const mangoAnimation = useScrollAnimation();
  const durianAnimation = useScrollAnimation();

  return (
    <div className="space-y-16">
      {/* Avocado Trees */}
      <div 
        ref={avocadoAnimation.ref}
        className={`fade-in-scroll slide-in-left ${avocadoAnimation.isVisible ? 'visible' : ''}`}
      >
        <Link 
          to="/farm-and-garden/trees?type=avocado" 
          className="block group focus:outline-none focus:ring-2 focus:ring-[hsl(var(--focus))] focus:ring-offset-2 rounded-lg"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="md:order-1">
              <ImageWrapper 
                src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9" 
                alt="Avocado trees in our highland orchard"
                className="max-w-sm mx-auto transform rotate-1 group-hover:rotate-2 transition-transform duration-300"
              />
            </div>
            
            <div className="md:order-2 md:pl-8">
              <div className="bg-white p-6 shadow-lg transform -rotate-1 group-hover:rotate-0 transition-transform duration-300" 
                   style={{ filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))' }}>
                <h3 className="text-2xl md:text-3xl mb-4 text-[hsl(var(--text-primary))]">
                  Avocado Trees
                </h3>
                <p className="text-sm text-[hsl(var(--stone))] leading-relaxed mb-4">
                  These gentle giants have become the heart of our orchard. Their broad leaves 
                  provide shelter for smaller plants, and their creamy fruit ripens slowly 
                  through the highland seasons.
                </p>
                <p className="text-xs text-[hsl(var(--text-accent))] font-medium ui-text">
                  Available: 12 trees • Next harvest: March-May
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Mango Trees */}
      <div 
        ref={mangoAnimation.ref}
        className={`fade-in-scroll slide-in-right ${mangoAnimation.isVisible ? 'visible' : ''}`}
      >
        <Link 
          to="/farm-and-garden/trees?type=mango" 
          className="block group focus:outline-none focus:ring-2 focus:ring-[hsl(var(--focus))] focus:ring-offset-2 rounded-lg"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="md:order-2">
              <ImageWrapper 
                src="https://images.unsplash.com/photo-1466721591366-2d5fba72006d" 
                alt="Mango trees heavy with fruit"
                className="max-w-sm mx-auto transform -rotate-2 group-hover:-rotate-1 transition-transform duration-300"
              />
            </div>
            
            <div className="md:order-1 md:pr-8">
              <div className="bg-white p-6 shadow-lg transform rotate-2 group-hover:rotate-1 transition-transform duration-300" 
                   style={{ filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))' }}>
                <h3 className="text-2xl md:text-3xl mb-4 text-[hsl(var(--text-primary))]">
                  Mango Trees
                </h3>
                <p className="text-sm text-[hsl(var(--stone))] leading-relaxed mb-4">
                  The aristocrats of our grove, these trees burst into fragrant blossoms each spring 
                  before gifting us with golden, honey-sweet mangoes that taste like captured sunshine.
                </p>
                <p className="text-xs text-[hsl(var(--text-accent))] font-medium ui-text">
                  Available: 8 trees • Next harvest: April-June
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Durian Trees */}
      <div 
        ref={durianAnimation.ref}
        className={`fade-in-scroll slide-in-left ${durianAnimation.isVisible ? 'visible' : ''}`}
      >
        <Link 
          to="/farm-and-garden/trees?type=durian" 
          className="block group focus:outline-none focus:ring-2 focus:ring-[hsl(var(--focus))] focus:ring-offset-2 rounded-lg"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="md:order-1">
              <ImageWrapper 
                src="https://images.unsplash.com/photo-1485833077593-4278bba3f11f" 
                alt="Our prized durian trees in the highland soil"
                className="max-w-sm mx-auto transform rotate-1 group-hover:rotate-2 transition-transform duration-300"
              />
            </div>
            
            <div className="md:order-2 md:pl-8">
              <div className="bg-white p-6 shadow-lg transform -rotate-2 group-hover:-rotate-1 transition-transform duration-300" 
                   style={{ filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))' }}>
                <h3 className="text-2xl md:text-3xl mb-4 text-[hsl(var(--text-primary))]">
                  Durian Trees
                </h3>
                <p className="text-sm text-[hsl(var(--stone))] leading-relaxed mb-4">
                  The most mysterious members of our orchard family. These towering trees take years 
                  to mature but reward patience with the king of fruits—complex, bold, and unforgettable.
                </p>
                <p className="text-xs text-[hsl(var(--text-accent))] font-medium ui-text">
                  Available: 5 trees • Next harvest: June-August
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default TreeCategoryShowcase;
