
import FounderLetter from '../components/FounderLetter';
import ImageGallery from '../components/ImageGallery';

const OurStory = () => {
  return (
    <div className="min-h-screen bg-[hsl(var(--background-primary))] px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl text-[hsl(var(--text-primary))] mb-4" style={{ fontFamily: 'Caveat, cursive' }}>
            A Note From Our Family
          </h1>
        </header>

        {/* Main Content */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-12 lg:items-start">
          {/* Letter Content - Takes up 2/3 on desktop */}
          <div className="lg:col-span-2 mb-12 lg:mb-0">
            <FounderLetter />
          </div>

          {/* Image Gallery - Takes up 1/3 on desktop, appears below on mobile */}
          <div className="lg:col-span-1">
            <ImageGallery />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurStory;
