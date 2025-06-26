
import ImageWrapper from './ImageWrapper';

const ImageGallery = () => {
  const galleryImages = [
    {
      src: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=500&fit=crop",
      alt: "Our living room where guests gather for morning coffee"
    },
    {
      src: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=500&fit=crop", 
      alt: "Fresh fruit from our trees, served daily"
    },
    {
      src: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=500&fit=crop",
      alt: "Wildlife that calls our farm home"
    },
    {
      src: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=400&h=500&fit=crop",
      alt: "One of our farm cats, always curious about guests"
    }
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <h3 className="text-xl text-[hsl(var(--text-primary))] mb-4" style={{ fontFamily: 'Caveat, cursive' }}>
        Moments from our daily life
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 md:gap-8">
        {galleryImages.map((image, index) => (
          <div key={index} className="flex justify-center lg:justify-start">
            <ImageWrapper 
              src={image.src}
              alt={image.alt}
              className="w-48 md:w-56"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
