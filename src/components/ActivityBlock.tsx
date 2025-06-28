
// ABOUTME: This component represents a single farm activity block.
// ABOUTME: It displays information about a specific farm experience.

import ImageWrapper from './ImageWrapper';

interface ActivityBlockProps {
  activity: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    altText: string;
  };
}

const ActivityBlock = ({ activity }: ActivityBlockProps) => {
  return (
    <div className="space-y-4">
      {/* Image */}
      <div className="mb-6">
        <ImageWrapper 
          src={activity.imageUrl} 
          alt={activity.altText}
          className="w-full max-w-xs mx-auto lg:mx-0"
        />
      </div>

      {/* Content */}
      <div className="space-y-3">
        {/* Title */}
        <h3 
          className="text-xl md:text-2xl text-[hsl(var(--text-accent))]"
          style={{ fontFamily: 'Caveat, cursive' }}
        >
          {activity.title}
        </h3>

        {/* Description */}
        <p 
          className="text-sm md:text-base leading-relaxed text-[hsl(var(--text-primary))]"
          style={{ fontFamily: 'IBM Plex Mono, monospace' }}
        >
          {activity.description}
        </p>
      </div>
    </div>
  );
};

export default ActivityBlock;
