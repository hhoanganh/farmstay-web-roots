// ABOUTME: This page tells the story of the farmstay's origins.
// ABOUTME: It features a letter from the founders and a gallery of images.

import { Link } from 'react-router-dom';
import FounderLetter from '../components/FounderLetter';
import ImageGallery from '../components/ImageGallery';

import { useScrollAnimation } from '../hooks/useScrollAnimation'; // Import the hook
import CallToActionSection from '../components/CallToActionSection'; // Import the new component

const OurStory = () => {
  const journeyAnimation = useScrollAnimation(); // Add animation hook for this section
  return (
    // This container div provides horizontal padding for the page and top padding to space it from the header.
    // The bottom padding was removed to ensure consistent spacing with the footer across all pages.
    <div className="px-4 pt-16 md:pt-24">
      <div className="max-w-6xl mx-auto"> 
        <header className="relative text-center mb-12 md:mb-16 overflow-hidden h-[40vh] md:h-[50vh] min-h-[300px] flex items-center justify-center rounded-lg shadow-lg">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('https://ik.imagekit.io/offvxi40h/our-story.jpg?tr=w-1200,q-80')` }}
          ></div>
          {/* Overlay for readability */}
          <div className="absolute inset-0 bg-black opacity-40"></div>

          {/* Content */}
          <div className="relative z-20 px-4 text-white">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl mb-6" style={{ fontFamily: 'Caveat, cursive' }}>
                Our Story
              </h1>
              <p 
                className="text-xs md:text-base max-w-2xl mx-auto leading-relaxed"
                style={{ fontFamily: 'IBM Plex Mono, monospace' }}
              >
                How our little farmstay came to be.
              </p>
            </div>
          </div>
        </header>

        <div className="lg:grid lg:grid-cols-3 lg:gap-12 space-y-12 lg:space-y-0">
          <div className="lg:col-span-2">
            <FounderLetter />
          </div>
          <div className="lg:col-span-1">
            <ImageGallery />
          </div>
        </div>

        {/* Call to Action Section - Now using the reusable CallToActionSection component, within the main content wrapper */}
        <CallToActionSection
          heading="Continue your journey"
          animationRef={journeyAnimation.ref}
          isVisible={journeyAnimation.isVisible}
        >
          <Link
            to="/homestay"
            className="inline-block bg-[hsl(var(--text-accent))] text-white px-8 py-3 rounded-md transition-opacity ui-text font-medium focus:outline-none focus:ring-2 focus:ring-[hsl(var(--focus))] focus:ring-offset-2 min-h-[44px] flex items-center"
          >
            Explore Our Rooms
          </Link>
          <Link
            to="/connect"
            className="inline-block bg-transparent border border-[hsl(var(--text-accent))] text-[hsl(var(--text-accent))] px-8 py-3 rounded-md transition-colors ui-text font-medium focus:outline-none focus:ring-2 focus:ring-[hsl(var(--focus))] focus:ring-offset-2 min-h-[44px] flex items-center"
          >
            Connect With Us
          </Link>
        </CallToActionSection>
      </div>
    </div>
  );
};

export default OurStory;
