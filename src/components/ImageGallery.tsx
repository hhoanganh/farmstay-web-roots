
import ImageWrapper from './ImageWrapper';

const ImageGallery = () => {
  const galleryImages = [
    {
      src: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/529091728.jpg?k=62a2ca11a902cc66dd1cb0f2dc52b979478b86c50f8214762065fd7449c079e8&o=&hp=1?w=400&h=500&fit=crop",
      alt: "Our living room where guests gather for morning coffee"
    },
    {
      src: "https://www.dalattrip.com/media/2015/01/strawberry-farm.jpg?w=400&h=500&fit=crop", 
      alt: "Fresh fruit from our trees, served daily"
    },
    {
      src: "https://mediaim.expedia.com/destination/1/d807fac75fa2e19c8999ecb7bdb18829.jpg?w=400&h=500&fit=crop",
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
      <div className="grid grid-cols-2 lg:grid-cols-1 gap-6 md:gap-8">
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
