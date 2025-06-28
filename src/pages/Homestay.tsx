
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
        <header className="relative text-center mb-12 md:mb-16 overflow-hidden min-h-[300px] flex items-center justify-center rounded-lg shadow-lg">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('https://bdsquan9.vn/wp-content/uploads/2021/06/%C4%91%E1%BA%A5t-n%E1%BB%81n-h%E1%BB%93-%C4%91%E1%BA%A1-sar-l%C3%A2m-h%C3%A0.jpg')` }}
          ></div>
          {/* Overlay for readability */}
          <div className="absolute inset-0 bg-black opacity-40"></div>

          {/* Content */}
          <div className="relative z-10 text-white">
            <h1 className="text-5xl md:text-6xl mb-6" style={{ fontFamily: 'Caveat, cursive' }}>
              Our Sanctuaries
            </h1>
            <p 
              className="text-base md:text-xl mt-2"
              style={{ fontFamily: 'IBM Plex Mono, monospace' }}
            >How our little farmstay came to be.</p>
          </div>
        </header>

        {/* Room Story Sections */}
        <div className="space-y-2 md:space-y-4">
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
