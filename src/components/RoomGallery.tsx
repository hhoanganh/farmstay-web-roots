// ABOUTME: This component displays a horizontally scrollable image gallery for a specific room.
// ABOUTME: It maps room names to a set of images to display.

import ImageWrapper from './ImageWrapper';


interface RoomGalleryProps {
  roomName: string;
}

// Define image URLs directly for gallery images
const RoomGallery = ({ roomName }: RoomGalleryProps) => {
  const roomImageMap: Record<string, { src: string; alt: string }[]> = {
    "The Coffee Loft": [
      { src: "https://ik.imagekit.io/offvxi40h/coffee-loft-1.jpg", alt: `Interior view of ${roomName}` },
      { src: "https://ik.imagekit.io/offvxi40h/coffee-loft-2.jpg", alt: `Bathroom in ${roomName}` },
      { src: "https://ik.imagekit.io/offvxi40h/coffee-loft-3.jpg", alt: `View from ${roomName}` },
      { src: "https://ik.imagekit.io/offvxi40h/coffee-loft-4.jpg", alt: `Evening ambiance in ${roomName}` }
    ],
    "The Garden Bungalow": [
      { src: "https://ik.imagekit.io/offvxi40h/garden-bungalow-1.jpg", alt: `Interior view of ${roomName}` },
      { src: "https://ik.imagekit.io/offvxi40h/garden-bungalow-2.jpg", alt: `Bathroom in ${roomName}` },
      { src: "https://ik.imagekit.io/offvxi40h/garden-bungalow-3.jpg", alt: `Garden view from ${roomName}` },
      { src: "https://ik.imagekit.io/offvxi40h/garden-bungalow-4.jpg", alt: `Relaxation area in ${roomName}` },
    ],
    "The Orchard House": [
      { src: "https://ik.imagekit.io/offvxi40h/orchard-house-1.jpg", alt: `Interior view of ${roomName}` }, // Made-up link
      { src: "https://ik.imagekit.io/offvxi40h/orchard-house-2.jpg", alt: `Dining area in ${roomName}` }, // Made-up link
      { src: "https://ik.imagekit.io/offvxi40h/orchard-house-3.jpg", alt: `Orchard view from ${roomName}` }, // Made-up link
      { src: "https://ik.imagekit.io/offvxi40h/orchard-house-4.jpg", alt: `Kitchen area in ${roomName}` },
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
