
// ABOUTME: This page provides an overview of the farmstay's various room types.
// ABOUTME: It presents each room as a unique story in a continuous scroll.

import { Link } from 'react-router-dom';
import RoomStorySection from '../components/RoomStorySection';
import CallToActionSection from '../components/CallToActionSection';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { rooms } from '../data/rooms'; // Import the room data

const Homestay = () => {
  const homestayCtaAnimation = useScrollAnimation();
  return (
    // This container div provides horizontal padding for the page and top padding to space it from the header.
    <div className="px-4 pt-16 md:pt-24">
      <div className="max-w-6xl mx-auto">
        {/* Page Introduction Section */}
        <section className="text-center mb-16 md:mb-24">
          <h1 
            className="text-5xl md:text-6xl mb-6 text-[hsl(var(--text-primary))]"
            style={{ fontFamily: 'Caveat, cursive' }}
          >
            Our Sanctuaries
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed ui-text text-[hsl(var(--stone))]">
            Here, every room tells a story, a quiet corner crafted for connection—with nature, with yourself, and with the rhythm of the farm. We've poured our hearts into creating spaces where you can truly unwind and feel at home.
          </p>
        </section>

        {/* Room Story Sections */}
        <div className="space-y-16 md:space-y-24">
          {rooms.map((room, index) => (
            <RoomStorySection 
              key={room.roomSlug}
              {...room}
              isReversed={index % 2 !== 0} // Alternate layout for every other room
            />
          ))}
        </div>

        {/* Call to Action Section */}
        <CallToActionSection
          heading="Ready to find your sanctuary?"
          animationRef={homestayCtaAnimation.ref}
          isVisible={homestayCtaAnimation.isVisible}
        >
          <Link 
            to="/homestay" // Link to the homestay page itself, or a booking form if available
            className="inline-block bg-[hsl(var(--text-accent))] text-white px-8 py-3 rounded-md transition-opacity ui-text font-medium focus:outline-none focus:ring-2 focus:ring-[hsl(var(--focus))] focus:ring-offset-2 min-h-[44px] flex items-center"
          >
            Explore All Rooms
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

export default Homestay;
