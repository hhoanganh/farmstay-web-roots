// ABOUTME: This page details the farm's garden and the unique tree adoption program.
// ABOUTME: It explains the concept and showcases the types of trees available.

import { Link } from 'react-router-dom';
import ImageWrapper from '../components/ImageWrapper';
import TeaserSection from '../components/TeaserSection';
import TreeCategoryShowcase from '../components/TreeCategoryShowcase';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const FarmAndGarden = () => {
  const storyAnimation = useScrollAnimation();
  const conceptAnimation = useScrollAnimation();
  const howItWorksAnimation = useScrollAnimation();
  const showcaseAnimation = useScrollAnimation();

  return (
    <main className="px-4 pt-16 md:pt-24 overflow-hidden">
      {/* Page Introduction Section */}
      <section className="text-center mb-16 md:mb-24">
        <div className="max-w-4xl mx-auto">
          <h1 
            className="text-5xl md:text-6xl mb-8 text-[hsl(var(--text-primary))]"
            style={{ fontFamily: 'Caveat, cursive' }}
          >
            Our Highland Roots
          </h1>
          <p 
            className="text-lg md:text-xl text-[hsl(var(--stone))] leading-relaxed max-w-3xl mx-auto"
            style={{ fontFamily: 'IBM Plex Mono, monospace' }}
          >
            Here in Vietnam's Central Highlands, where the air is crisp and the soil is rich, lies the heart of our farm. The Lovable Farm & Garden is a sanctuary for unique botanicals and a testament to our family's dedication to sustainable agriculture.
          </p>
        </div>
      </section>

      {/* Our Tree Adoption Story Section */}
      <section 
        ref={storyAnimation.ref}
        className={`py-12 md:py-20 transition-all duration-1000 ${storyAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2">
            <h2 
              className="text-4xl md:text-5xl mb-6 text-[hsl(var(--text-primary))] leading-tight"
              style={{ fontFamily: 'Caveat, cursive' }}
            >
              Our Tree Adoption Story
            </h2>
            <p 
              className="mb-6 text-[hsl(var(--stone))] text-lg leading-relaxed"
              style={{ fontFamily: 'IBM Plex Mono, monospace' }}
            >
              The Lovable Farm & Garden is more than just land; it's a promise to the future. We believe that every tree planted is a step towards a greener, more sustainable world. Our adoption program invites you to be a part of this journey. When you adopt a tree, you're not just getting a plant; you're nurturing a legacy.
            </p>
            <p 
              className="text-[hsl(var(--stone))] text-lg leading-relaxed"
              style={{ fontFamily: 'IBM Plex Mono, monospace' }}
            >
              Each tree has a unique story, a connection to the land and the community. Your adoption helps us continue our work, from maintaining the groves to supporting local biodiversity. It's a gift that grows, offering beauty, shade, and a tangible connection to nature's cycle.
            </p>
          </div>
          <div className="md:w-1/2">
            <ImageWrapper 
              src="https://ik.imagekit.io/offvxi40h/adoption-1.jpg"
              alt="Hands holding a young sapling in rich soil"
              className="rounded-lg shadow-lg overflow-hidden"
            />
          </div>
        </div>
      </section>

      {/* The Concept Section */}
      <section 
        ref={conceptAnimation.ref}
        className={`py-12 md:py-20 bg-[hsl(var(--stone-light))] transition-all duration-1000 ${conceptAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 
            className="text-4xl md:text-5xl mb-6 text-[hsl(var(--text-primary))] leading-tight"
            style={{ fontFamily: 'Caveat, cursive' }}
          >
            A Digital Garden with Real Roots
          </h2>
          <p 
            className="text-lg text-[hsl(var(--stone))] leading-relaxed"
            style={{ fontFamily: 'IBM Plex Mono, monospace' }}
          >
            Our program bridges the digital and natural worlds. You adopt a tree online and receive updates on its growth, but the tree itself thrives here on our farm. It's a tangible link to your contribution, a piece of nature you can call your own, cared for by our expert hands.
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <TeaserSection />

      {/* Tree Showcase Section */}
      <section 
        ref={showcaseAnimation.ref}
        className={`py-12 md:py-20 transition-all duration-1000 ${showcaseAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 
              className="text-4xl md:text-5xl mb-6 text-[hsl(var(--text-primary))] leading-tight"
              style={{ fontFamily: 'Caveat, cursive' }}
            >
              Choose Your Tree
            </h2>
            <p 
              className="text-lg text-[hsl(var(--stone))] leading-relaxed"
              style={{ fontFamily: 'IBM Plex Mono, monospace' }}
            >
              From the fragrant Camellia to the resilient Juniper, each tree has its own character. Find the one that resonates with you.
            </p>
          </div>

          <TreeCategoryShowcase />
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center border-t border-[hsl(var(--stone))] border-opacity-20 py-12 mb-12">
        <div className="max-w-2xl mx-auto">
          <h2 
            className="text-4xl md:text-5xl mb-6 text-[hsl(var(--text-primary))]"
            style={{ fontFamily: 'Caveat, cursive' }}
          >
            Begin your tree's story
          </h2>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link 
              to="/farm-and-garden/trees" 
              className="inline-block bg-[hsl(var(--text-accent))] text-white px-8 py-3 rounded-md transition-opacity ui-text font-medium focus:outline-none focus:ring-2 focus:ring-[hsl(var(--focus))] focus:ring-offset-2 min-h-[44px] flex items-center"
            >
              Browse All Trees
            </Link>
            <Link 
              to="/connect" 
              className="inline-block bg-transparent border border-[hsl(var(--text-accent))] text-[hsl(var(--text-accent))] px-8 py-3 rounded-md transition-colors ui-text font-medium focus:outline-none focus:ring-2 focus:ring-[hsl(var(--focus))] focus:ring-offset-2 min-h-[44px] flex items-center hover:bg-[hsl(var(--text-accent))] hover:text-white"
            >
              Ask a Question
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default FarmAndGarden;