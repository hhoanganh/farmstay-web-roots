
interface ImageWrapperProps {
  src: string;
  alt: string;
  className?: string;
}

const ImageWrapper = ({ src, alt, className = '' }: ImageWrapperProps) => {
  return (
    <div className={`relative ${className}`}>
      <div 
        className="bg-white p-2 shadow-lg transform rotate-1 hover:rotate-0 transition-transform duration-300"
        style={{
          filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))'
        }}
      >
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-auto block"
        />
        <div className="absolute top-1 right-1 w-2 h-2 bg-gray-200 rounded-full opacity-50"></div>
        <div className="absolute bottom-1 left-1 w-2 h-2 bg-gray-200 rounded-full opacity-50"></div>
      </div>
    </div>
  );
};

export default ImageWrapper;
