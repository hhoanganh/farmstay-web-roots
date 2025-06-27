// ABOUTME: This component displays a horizontally scrollable image gallery for a specific room.
// ABOUTME: It maps room names to a set of images to display.

// Import specific images for "Coffee Loft"
// You would need to import images for all rooms you want to display this way.
// Ensure these image files exist in src/assets/images
import coffeeLoft1 from '../assets/images/coffee-loft-1.jpg';
import coffeeLoft2 from '../assets/images/coffee-loft-2.jpg';
import coffeeLoft3 from '../assets/images/coffee-loft-3.jpg';
import coffeeLoft4 from '../assets/images/coffee-loft-4.jpg';

// Import specific images for "Mountain View Suite"
import mountainViewSuite1 from '../assets/images/mountain-view-suite-1.jpg';
import mountainViewSuite2 from '../assets/images/mountain-view-suite-2.jpg';
import mountainViewSuite3 from '../assets/images/mountain-view-suite-3.jpg';
import mountainViewSuite4 from '../assets/images/mountain-view-suite-4.jpg';

// Import specific images for "Garden Retreat"
import gardenRetreat1 from '../assets/images/garden-retreat-1.jpg';
import gardenRetreat2 from '../assets/images/garden-retreat-2.jpg';
import gardenRetreat3 from '../assets/images/garden-retreat-3.jpg';
import gardenRetreat4 from '../assets/images/garden-retreat-4.jpg';

// Import specific images for "Riverside Cabin"
import riversideCabin1 from '../assets/images/riverside-cabin-1.jpg';
import riversideCabin2 from '../assets/images/riverside-cabin-2.jpg';
import riversideCabin3 from '../assets/images/riverside-cabin-3.jpg';
import riversideCabin4 from '../assets/images/riverside-cabin-4.jpg';

import ImageWrapper from './ImageWrapper';


interface RoomGalleryProps {
  roomName: string;
}

const RoomGallery = ({ roomName }: RoomGalleryProps) => {
  const roomImageMap: Record<string, { src: string; alt: string }[]> = {
    "Coffee Loft": [
      { src: coffeeLoft1, alt: `Interior view of ${roomName}` },
      { src: coffeeLoft2, alt: `Bathroom in ${roomName}` },
      { src: coffeeLoft3, alt: `View from ${roomName}` },
      { src: coffeeLoft4, alt: `Evening ambiance in ${roomName}` }
    ],
    // Add other rooms here. Make sure you've imported the images at the top of the file.
    "Mountain View Suite": [
      { src: mountainViewSuite1, alt: `Interior view of ${roomName}` },
      { src: mountainViewSuite2, alt: `Bathroom in ${roomName}` },
      { src: mountainViewSuite3, alt: `Balcony view from ${roomName}` },
      { src: mountainViewSuite4, alt: `Suite details in ${roomName}` },
    ],
    "Garden Retreat": [
      { src: gardenRetreat1, alt: `Interior view of ${roomName}` },
      { src: gardenRetreat2, alt: `Bathroom in ${roomName}` },
      { src: gardenRetreat3, alt: `Garden view from ${roomName}` },
      { src: gardenRetreat4, alt: `Relaxation area in ${roomName}` },
    ],
    "Riverside Cabin": [
      { src: riversideCabin1, alt: `Interior view of ${roomName}` },
      { src: riversideCabin2, alt: `Bathroom in ${roomName}` },
      { src: riversideCabin3, alt: `Riverside view from ${roomName}` },
      { src: riversideCabin4, alt: `Cabin exterior in ${roomName}` },
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
