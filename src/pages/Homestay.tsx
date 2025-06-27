
// ABOUTME: This is the main Homestay Overview page using the "Unfurling Scroll" layout.
// ABOUTME: Each room is presented as a unique chapter in a continuous narrative.

import RoomStorySection from '../components/RoomStorySection';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Homestay = () => {
  const introAnimation = useScrollAnimation();

  // Room data with personal narrative tone
  const rooms = [
    {
      roomName: "The Coffee Tree Room",
      roomSlug: "coffee-tree",
      description: "Our first guest room sits beneath the shade of our oldest coffee trees. We built it here because this spot always felt like the heart of our farm - where the morning light filters through the leaves just right, and you can hear the gentle rustle of the plantation awakening.",
      highlights: [
        "Private balcony overlooking the coffee plantation",
        "Traditional Vietnamese furnishings with modern comfort",
        "Wake up to the aroma of fresh coffee beans",
        "Direct access to our morning coffee tours"
      ],
      imageSrc: "https://images.unsplash.com/photo-1521322800607-8c38375eef04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      imageAlt: "The Coffee Tree Room interior with traditional Vietnamese decor"
    },
    {
      roomName: "The Mountain View Suite",
      roomSlug: "mountain-view",
      description: "When we first climbed to this elevated corner of our property, we knew it had to become something special. The suite faces east toward the dramatic peaks of the Central Highlands, where every sunrise paints the sky in colors that still take our breath away after all these years.",
      highlights: [
        "Panoramic views of the Central Highlands",
        "Private sitting area with floor-to-ceiling windows",
        "Spacious layout perfect for couples or small families",
        "Access to our sunset meditation spot"
      ],
      imageSrc: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      imageAlt: "The Mountain View Suite with panoramic windows"
    },
    {
      roomName: "The Garden Cottage",
      roomSlug: "garden-cottage",
      description: "This cozy cottage emerged from our desire to create a space that felt like stepping into a living storybook. Surrounded by our herb and vegetable gardens, it's where the boundaries between indoor and outdoor living gently blur, and every meal can include ingredients picked just steps from your door.",
      highlights: [
        "Surrounded by organic herb and vegetable gardens",
        "Private outdoor kitchen and dining area",
        "Handcrafted wooden furnishings made by local artisans",
        "Participate in our daily garden-to-table experiences"
      ],
      imageSrc: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      imageAlt: "The Garden Cottage nestled among lush gardens"
    }
  ];

  return (
    <div className="px-4 pt-16 md:pt-24">
      <div className="max-w-6xl mx-auto">
        
        {/* Page Introduction */}
        <section className="text-center mb-16 md:mb-20">
          <div 
            ref={introAnimation.ref}
            className={`fade-in-scroll ${introAnimation.isVisible ? 'visible' : ''}`}
          >
            <h1 className="text-5xl md:text-6xl mb-6 text-[hsl(var(--text-primary))]">
              Our Sanctuaries
            </h1>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg md:text-xl text-[hsl(var(--stone))] leading-relaxed">
                Each room in our farmstay was born from a different moment of discovery on this land. 
                They're not just places to sleep—they're intimate chapters in the ongoing story of 
                our life here in the Central Highlands, designed to help you write your own.
              </p>
            </div>
          </div>
        </section>

        {/* Room Story Sections */}
        <div className="space-y-16 md:space-y-20">
          {rooms.map((room, index) => (
            <RoomStorySection
              key={room.roomSlug}
              roomName={room.roomName}
              roomSlug={room.roomSlug}
              description={room.description}
              highlights={room.highlights}
              imageSrc={room.imageSrc}
              imageAlt={room.imageAlt}
              isReversed={index % 2 === 1}
            />
          ))}
        </div>

        {/* Divider before potential future content */}
        <div className="border-t border-[hsl(var(--stone))] border-opacity-20 mt-16 md:mt-20 mb-12"></div>
        
      </div>
    </div>
  );
};

export default Homestay;
