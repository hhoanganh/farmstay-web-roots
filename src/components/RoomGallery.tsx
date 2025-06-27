// ABOUTME: This component displays a horizontally scrollable image gallery for a specific room.
// ABOUTME: It maps room names to a set of images to display.

// Import specific images for "The Coffee Loft"
import coffeeLoft1 from '../assets/images/coffee-loft-1.jpg';
import coffeeLoft2 from '../assets/images/coffee-loft-2.jpg';
import coffeeLoft3 from '../assets/images/coffee-loft-3.jpg';
import coffeeLoft4 from '../assets/images/coffee-loft-4.jpg';

// Import specific images for "The Garden Bungalow"
import gardenBungalow1 from '../assets/images/garden-bungalow-1.jpg';
import gardenBungalow2 from '../assets/images/garden-bungalow-2.jpg';
import gardenBungalow3 from '../assets/images/garden-bungalow-3.jpg';
import gardenBungalow4 from '../assets/images/garden-bungalow-4.jpg';

// Import specific images for "The Orchard House"
import orchardHouse1 from '../assets/images/orchard-house-1.jpg';
import orchardHouse2 from '../assets/images/orchard-house-2.jpg';
import orchardHouse3 from '../assets/images/orchard-house-3.jpg';
import orchardHouse4 from '../assets/images/orchard-house-4.jpg';

import ImageWrapper from './ImageWrapper';


interface RoomGalleryProps {
  roomName: string;
}

const RoomGallery = ({ roomName }: RoomGalleryProps) => {
  const roomImageMap: Record<string, { src: string; alt: string }[]> = {
    "The Coffee Loft": [
      { src: coffeeLoft1, alt: `Interior view of ${roomName}` },
      { src: coffeeLoft2, alt: `Bathroom in ${roomName}` },
      { src: coffeeLoft3, alt: `View from ${roomName}` },
      { src: coffeeLoft4, alt: `Evening ambiance in ${roomName}` }
    ],
    "The Garden Bungalow": [
      { src: gardenBungalow1, alt: `Interior view of ${roomName}` },
      { src: gardenBungalow2, alt: `Bathroom in ${roomName}` },
      { src: gardenBungalow3, alt: `Garden view from ${roomName}` },
      { src: gardenBungalow4, alt: `Relaxation area in ${roomName}` },
    ],
    "The Orchard House": [
      { src: orchardHouse1, alt: `Interior view of ${roomName}` },
      { src: orchardHouse2, alt: `Bathroom in ${roomName}` },
      { src: orchardHouse3, alt: `Orchard view from ${roomName}` },
      { src: orchardHouse4, alt: `Kitchen area in ${roomName}` },
    ],
  };

  // Get the images for the current room. If the roomName is not found, it will return an empty array.
  const galleryImages = roomImageMap[roomName] || [];

  

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-6 pb-4" style={{ width: 'max-content' }}>
        {galleryImages.map((image, index) => (
          <div key={index} className="flex-shrink-0">
            <ImageWrapper 
              src={image.src}
              alt={image.alt}
              className="w-64 md:w-72"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomGallery;
