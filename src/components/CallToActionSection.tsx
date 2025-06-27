// ABOUTME: This component provides a standardized call-to-action section.
// ABOUTME: It is designed for reusability across different pages.

import React from 'react';

interface CallToActionSectionProps {
  heading: string;
  children: React.ReactNode; // This will contain the Link buttons
  animationRef: React.RefObject<HTMLDivElement>;
  isVisible: boolean;
}

const CallToActionSection = ({ heading, children, animationRef, isVisible }: CallToActionSectionProps) => {
  return (
    <section className="mt-16 md:mt-24 text-center border-t border-[hsl(var(--stone))] border-opacity-20 py-16 mb-16">
      <div 
        ref={animationRef} 
        className={`max-w-2xl mx-auto fade-in-scroll ${isVisible ? 'visible' : ''}`}
      >
        <h2 className="text-4xl md:text-5xl mb-6 text-[hsl(var(--text-primary))]">
          {heading}
        </h2>
        <div className="flex justify-center gap-4 flex-wrap">
          {children}
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;