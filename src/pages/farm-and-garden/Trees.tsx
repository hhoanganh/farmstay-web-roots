import React from 'react';
import TreeCategoryShowcase from '@/components/TreeCategoryShowcase';

const Trees: React.FC = () => {
  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-[hsl(var(--text-accent))] mb-2" style={{ fontFamily: 'Caveat, cursive' }}>
          Which Tree Will You Nurture?
        </h1>
        <p className="text-lg text-[hsl(var(--text-secondary))] mb-4" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
          Our avocados, mangos, and durians are more than just trees—they are living journals. Find the one that speaks to you and begin following its journey.
        </p>
      </div>
      <TreeCategoryShowcase />
    </div>
  );
};

export default Trees;
