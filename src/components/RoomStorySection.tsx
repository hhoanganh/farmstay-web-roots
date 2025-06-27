
// ABOUTME: This component represents a single room section in the unfurling scroll layout.
// ABOUTME: It alternates between left and right layouts to create visual rhythm.

import { Link } from 'react-router-dom';
import ImageWrapper from './ImageWrapper';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface RoomStorySectionProps {
  roomName: string;
  roomSlug: string;
  description: string;
  highlights: string[];
  imageSrc: string;
  imageAlt: string;
  isReversed?: boolean;
}

const RoomStorySection = ({
  roomName,
  roomSlug,
  description,
  highlights,
  imageSrc,
  imageAlt,
  isReversed = false
}: RoomStorySectionProps) => {
  const animation = useScrollAnimation();

  return (
    <section className="py-6 md:py-8">
      <div 
        ref={animation.ref}
        className={`fade-in-scroll ${animation.isVisible ? 'visible' : ''}`}
      >
        <div className={`grid md:grid-cols-5 gap-8 md:gap-12 items-center ${isReversed ? 'md:grid-flow-col-dense' : ''}`}>
          {/* Image Section */}
          <div className={`md:col-span-3 ${isReversed ? 'md:col-start-3' : ''}`}>
            <ImageWrapper 
              src={imageSrc}
              alt={imageAlt}
              className="max-w-md mx-auto transform hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Content Section */}
          <div className={`md:col-span-2 space-y-6 ${isReversed ? 'md:col-start-1' : ''}`}>
            <div>
              <h2 
                className="text-3xl md:text-4xl mb-4 text-[hsl(var(--text-primary))]"
                style={{ fontFamily: 'Caveat, cursive' }}
              >
                {roomName}
              </h2>
              <p className="text-lg text-[hsl(var(--stone))] leading-relaxed mb-6 font-mono">
                {description}
              </p>
            </div>

            {/* Highlights */}
            <div className="space-y-3">
              <h3 
                className="text-xl text-[hsl(var(--text-primary))] font-medium ui-text"
                style={{ fontFamily: 'Caveat, cursive' }}
              >
                What makes this special:
              </h3>
              <ul className="space-y-2">
                {highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-[hsl(var(--brown))] rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-[hsl(var(--stone))] leading-relaxed font-mono">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Learn More Link */}
            <div className="pt-4">
              <Link 
                to={`/homestay/rooms/${roomSlug}`}
                className="inline-block text-[hsl(var(--text-accent))] font-medium transition-opacity focus:outline-none focus-visible:[background-color:hsl(var(--stone)/0.2)] hover:[background-color:hsl(var(--stone)/0.2)] rounded-sm px-3 py-2 min-h-[44px] flex items-center w-fit ui-text"
              >
                Learn more about {roomName} →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoomStorySection;
