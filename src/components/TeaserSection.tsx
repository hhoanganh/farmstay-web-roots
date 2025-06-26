
import { ReactNode } from 'react';

interface TeaserSectionProps {
  children: ReactNode;
  className?: string;
}

const TeaserSection = ({ children, className = '' }: TeaserSectionProps) => {
  return (
    <section className={`relative py-16 px-4 ${className}`}>
      <div className="max-w-6xl mx-auto">
        {children}
      </div>
    </section>
  );
};

export default TeaserSection;
