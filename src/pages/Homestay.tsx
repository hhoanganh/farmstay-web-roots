
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
        <header className="relative text-center mb-12 md:mb-16 overflow-hidden h-[40vh] md:h-[50vh] min-h-[300px] flex items-center justify-center rounded-lg shadow-lg">
          {/* Background Image - TODO: Replace with the direct image link for the homestay */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('https://ik.imagekit.io/offvxi40h/our-farmstay-1.jpg?tr=w-1200,q-80')` }}
          ></div>
          {/* Overlay for readability */}
          <div className="absolute inset-0 bg-black opacity-40"></div>

          {/* Content */}
          <div className="relative z-20 px-4 text-white">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl mb-6" style={{ fontFamily: 'Caveat, cursive' }}>
                Our Sanctuaries
              </h1>
              <p 
                className="text-xs md:text-base max-w-2xl mx-auto leading-relaxed"
                style={{ fontFamily: 'IBM Plex Mono, monospace' }}
              >
                Here, every room tells a story, a quiet corner crafted for connection—with nature, with yourself, and with the rhythm of the farm. We've poured our hearts into creating spaces where you can truly unwind and feel at home.
              </p>
            </div>
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
