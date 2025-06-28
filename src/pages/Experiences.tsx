
// ABOUTME: This page presents farm experiences in a split journal layout.
// ABOUTME: It features a dynamic journal feed alongside a static activities showcase.

import JournalFeed from '../components/JournalFeed';
import ActivitiesShowcase from '../components/ActivitiesShowcase';

const Experiences = () => {
  return (
    <div className="px-4 pt-16 md:pt-24">
      <div className="max-w-7xl mx-auto">
        {/* Page Introduction Section */}
        <header className="text-center mb-12 md:mb-16">
          <h1 
            className="text-5xl md:text-6xl mb-6 text-[hsl(var(--text-accent))]" 
            style={{ fontFamily: 'Caveat, cursive' }}
          >
            Life on the Farm
          </h1>
          <p 
            className="text-base md:text-lg max-w-3xl mx-auto leading-relaxed text-[hsl(var(--text-primary))]"
            style={{ fontFamily: 'IBM Plex Mono, monospace' }}
          >
            Here, I share the daily rhythms of our farm—the small moments that make this place come alive. 
            From morning mist over the coffee plants to evening harvests under the highland sky, 
            these are the stories that shape our days and connect us to this beautiful land.
          </p>
        </header>

        {/* Two-Part Asymmetrical Container */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left Column - The Journal Feed (Primary, wider column) */}
          <div className="order-2 lg:order-1 lg:w-2/3">
            <JournalFeed />
          </div>

          {/* Right Column - The Activities Showcase (Narrower, sticky column) */}
          <div className="order-1 lg:order-2 lg:w-1/3">
            <div className="lg:sticky lg:top-24">
              <ActivitiesShowcase />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experiences;
