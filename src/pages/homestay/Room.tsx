
import { useParams, Link } from "react-router-dom";
import { rooms } from "../../data/rooms";
import ImageWrapper from "../../components/ImageWrapper";
import RoomGallery from "../../components/RoomGallery";
import RoomDetails from "../../components/RoomDetails";
import CallToActionSection from "../../components/CallToActionSection";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

const Room = () => {
  const { roomName } = useParams();
  const ctaAnimation = useScrollAnimation();
  
  // Find the room data based on the slug from the URL
  const room = rooms.find(r => r.roomSlug === roomName);
  
  // If room not found, show a friendly message
  if (!room) {
    return (
      <div className="px-4 pt-16 md:pt-24">
        <div className="max-w-6xl mx-auto text-center py-16">
          <h1 
            className="text-4xl md:text-5xl mb-6 text-[hsl(var(--text-primary))]"
            style={{ fontFamily: 'Caveat, cursive' }}
          >
            Room Not Found
          </h1>
          <p className="text-lg text-[hsl(var(--stone))] mb-8 font-mono">
            We couldn't find the room you're looking for. Perhaps it's hiding in our garden?
          </p>
          <Link 
            to="/homestay"
            className="inline-block bg-[hsl(var(--text-accent))] text-white px-8 py-3 rounded-md transition-opacity ui-text font-medium focus:outline-none focus:ring-2 focus:ring-[hsl(var(--focus))] focus:ring-offset-2 min-h-[44px] flex items-center"
          >
            ← Back to All Rooms
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 md:pt-20">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={room.imageSrc}
            alt={room.imageAlt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>
        
        {/* Room Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            <Link 
              to="/homestay"
              className="inline-block text-white mb-4 transition-opacity focus:outline-none focus:ring-2 focus:ring-[hsl(var(--focus))] focus:ring-offset-2 rounded-sm px-3 py-2 min-h-[44px] flex items-center w-fit ui-text"
            >
              ← Back to All Rooms
            </Link>
            <h1 
              className="text-4xl md:text-6xl text-white drop-shadow-lg"
              style={{ fontFamily: 'Caveat, cursive' }}
            >
              {room.roomName}
            </h1>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-4 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 md:gap-12">
            {/* Left Column - The Story */}
            <div className="md:col-span-3 space-y-6">
              <div>
                <h2 
                  className="text-2xl md:text-3xl mb-6 text-[hsl(var(--text-primary))]"
                  style={{ fontFamily: 'Caveat, cursive' }}
                >
                  The Story
                </h2>
                <p className="text-lg text-[hsl(var(--stone))] leading-relaxed font-mono">
                  {room.description}
                </p>
              </div>
            </div>

            {/* Right Column - The Details */}
            <div className="md:col-span-2">
              <RoomDetails highlights={room.highlights} />
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          <h2 
            className="text-2xl md:text-3xl mb-8 text-[hsl(var(--text-primary))]"
            style={{ fontFamily: 'Caveat, cursive' }}
          >
            More glimpses of {room.roomName}
          </h2>
          <RoomGallery roomName={room.roomName} />
        </div>
      </section>

      {/* Call to Action Section */}
      <CallToActionSection
        heading="Inquire About Your Stay"
        animationRef={ctaAnimation.ref}
        isVisible={ctaAnimation.isVisible}
      >
        <Link 
          to="/connect"
          className="inline-block bg-[hsl(var(--text-accent))] text-white px-8 py-3 rounded-md transition-opacity ui-text font-medium focus:outline-none focus:ring-2 focus:ring-[hsl(var(--focus))] focus:ring-offset-2 min-h-[44px] flex items-center"
        >
          Connect With Us
        </Link>
        <Link 
          to="/homestay"
          className="inline-block bg-transparent border border-[hsl(var(--text-accent))] text-[hsl(var(--text-accent))] px-8 py-3 rounded-md transition-colors ui-text font-medium focus:outline-none focus:ring-2 focus:ring-[hsl(var(--focus))] focus:ring-offset-2 min-h-[44px] flex items-center"
        >
          View All Rooms
        </Link>
      </CallToActionSection>
    </div>
  );
};

export default Room;
