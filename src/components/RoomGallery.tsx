
import ImageWrapper from './ImageWrapper';
// Import specific images for "Coffee Loft"
// You would need to import images for all rooms you want to display this way.
// Ensure these image files exist in src/assets/images
import coffeeLoft1 from '../assets/images/coffee-loft-1.jpg';
import coffeeLoft2 from '../assets/images/coffee-loft-2.jpg';
import coffeeLoft3 from '../assets/images/coffee-loft-3.jpg';
import coffeeLoft4 from '../assets/images/coffee-loft-4.jpg';

// Example imports for another room (if you had them)
// import mountainViewSuite1 from '../assets/images/mountain-view-suite-1.jpg';
// import mountainViewSuite2 from '../assets/images/mountain-view-suite-2.jpg';


interface RoomGalleryProps {
  roomName: string;
}

const RoomGallery = ({ roomName }: RoomGalleryProps) => {
  // Define a mapping of room names to their specific gallery images.
  // This approach is suitable for a fixed set of images known at build time
  // and manually placed in src/assets/images.
  // For truly dynamic, user-uploaded images (where users upload new images
  // after the application is deployed), you would fetch image URLs from a
  // backend API and store them in a database, as discussed previously.
  const roomImageMap: Record<string, { src: string; alt: string }[]> = {
    "Coffee Loft": [
      { src: coffeeLoft1, alt: `Interior view of ${roomName}` },
      { src: coffeeLoft2, alt: `Bathroom in ${roomName}` },
      { src: coffeeLoft3, alt: `View from ${roomName}` },
      { src: coffeeLoft4, alt: `Evening ambiance in ${roomName}` }
    ],
    // Add other rooms here as needed, e.g.:
    // "Mountain View Suite": [
    //   { src: mountainViewSuite1, alt: `Interior view of ${roomName}` },
    //   { src: mountainViewSuite2, alt: `Bathroom in ${roomName}` },
    //   // ...
    // ],
    // You can also define a default set of images if a room name doesn't have specific ones
   // "Default": [
   //   { src: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop", alt: `Default interior view` },
   //   { src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop", alt: `Default bathroom` },
   //   { src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop", alt: `Default view` },
   //   { src: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop", alt: `Default evening ambiance` }
    //]
  };

  // Get the images for the current room, or the "Default" set if not found
  const galleryImages = roomImageMap[roomName] || roomImageMap["Default"];

  

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
