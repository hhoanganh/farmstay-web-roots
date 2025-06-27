
import ImageWrapper from './ImageWrapper';

interface RoomGalleryProps {
  roomName: string;
}

const RoomGallery = ({ roomName }: RoomGalleryProps) => {
  // Gallery images for each room - in a real app, these would come from the database
  const galleryImages = [
    {
      src: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop",
      alt: `Interior view of ${roomName}`
    },
    {
      src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      alt: `Bathroom in ${roomName}`
    },
    {
      src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
      alt: `View from ${roomName}`
    },
    {
      src: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
      alt: `Evening ambiance in ${roomName}`
    }
  ];

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
