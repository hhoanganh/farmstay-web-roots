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
      {/* Hero Section */}
      <header className="relative text-center mb-12 md:mb-16 overflow-hidden h-[40vh] md:h-[50vh] min-h-[300px] flex items-center justify-center rounded-lg shadow-lg">
        {/* Background Image - TODO: Replace with the direct image link */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://ik.imagekit.io/offvxi40h/tea-farm-1.jpg?tr=w-1200,q-80')` }}
        ></div>
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black opacity-40"></div>

        {/* Content */}
        <div className="relative z-20 px-4 text-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl mb-6" style={{ fontFamily: 'Caveat, cursive' }}>
              Our Highland Roots
            </h1>
            <p 
              className="text-xs md:text-base max-w-2xl mx-auto leading-relaxed"
              style={{ fontFamily: 'IBM Plex Mono, monospace' }}
            >
              Here in Vietnam's Central Highlands, where rolling hills meet cool, misty mornings, our land tells its own story through the rich, red basalt soil. Every tree we've planted has become part of this ancient landscape, and now we invite you to become part of theirs.
            </p>
          </div>
        </div>
      </header>

      {/* The Story of the Garden Section */}
      <TeaserSection className="overflow-hidden">
        <div className="grid md:grid-cols-5 gap-12 items-center">
          <div
            ref={storyAnimation.ref}
            className={`md:col-span-2 fade-in-scroll slide-in-left ${storyAnimation.isVisible ? 'visible' : ''}`}
          >
            <ImageWrapper 
              src="https://ik.imagekit.io/offvxi40h/garden-6.jpg" 
              alt="The highland landscape of our farm"
              className="max-w-md mx-auto transform rotate-1"
            />
          </div>
          
          <div
            className={`md:col-span-3 fade-in-scroll slide-in-right ${storyAnimation.isVisible ? 'visible' : ''}`}
          >
            <h2 
              className="text-3xl md:text-4xl mb-6 text-[hsl(var(--text-primary))]"
              style={{ fontFamily: 'Caveat, cursive' }}
            >
              Stewarding this sacred ground
            </h2>
            <p 
              className="text-base text-[hsl(var(--stone))] mb-4 leading-relaxed"
              style={{ fontFamily: 'IBM Plex Mono, monospace' }}
            >
              When we first walked this land, we could feel its potential humming beneath our feet. 
              The soil here has been enriched by volcanic activity for millennia, creating the perfect 
              conditions for fruit trees to flourish.
            </p>
            <p 
              className="text-base text-[hsl(var(--stone))] leading-relaxed"
              style={{ fontFamily: 'IBM Plex Mono, monospace' }}
            >
              Our approach isn't about conquering nature—it's about partnering with it. Each tree we 
              tend is both a commitment to this ecosystem and a bridge connecting distant hearts 
              to our highland home.
            </p>
          </div>
        </div>
      </TeaserSection>

      {/* Tree Adoption Concept Section */}
      <TeaserSection className="mt-[-4rem] md:mt-[-6rem] overflow-hidden">
        <div className="grid md:grid-cols-5 gap-12 items-center">
          {/* Text content is now first to appear above the image on mobile */}
          <div
            className={`md:col-span-3 md:order-1 fade-in-scroll slide-in-left ${conceptAnimation.isVisible ? 'visible' : ''}`}
          >
            <h2 
              className="text-3xl md:text-4xl mb-6 text-[hsl(var(--text-primary))]"
              style={{ fontFamily: 'Caveat, cursive' }}
            >
              Our Tree Adoption Story
            </h2>
            <p 
              className="text-base text-[hsl(var(--stone))] mb-4 leading-relaxed"
              style={{ fontFamily: 'IBM Plex Mono, monospace' }}
            >
              The idea came to us during harvest season, when we realized how much joy each tree 
              brought us throughout the year. Why not share that connection? Why not let others 
              experience the quiet magic of watching a tree grow, season by season?
            </p>
            <p 
              className="text-base text-[hsl(var(--stone))] leading-relaxed"
              style={{ fontFamily: 'IBM Plex Mono, monospace' }}
            >
              When you adopt one of our trees, you're not just buying fruit—you're joining a story. 
              You'll follow your tree's unique life cycle journal, from pruning to flowering to harvest, 
              creating a tangible connection to this land even from afar.
            </p>
          </div>

          {/* Image content is now second */}
          <div
            ref={conceptAnimation.ref}
            className={`md:col-span-2 md:order-2 fade-in-scroll slide-in-right ${conceptAnimation.isVisible ? 'visible' : ''}`}
          >
            <ImageWrapper 
              src="https://ik.imagekit.io/offvxi40h/adoption-1.jpg" 
              alt="A young tree being tended in our garden"
              className="max-w-md mx-auto transform -rotate-2"
            />
          </div>
        </div>
      </TeaserSection>

      {/* How It Works Section */}
      <TeaserSection className="mt-[-4rem] md:mt-[-6rem] overflow-hidden">
        <div 
          ref={howItWorksAnimation.ref}
          className={`text-center fade-in-scroll ${howItWorksAnimation.isVisible ? 'visible' : ''}`}
        >
          <h2 
            className="text-3xl md:text-4xl mb-12 text-[hsl(var(--text-primary))]"
            style={{ fontFamily: 'Caveat, cursive' }}
          >
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-[hsl(var(--text-accent))] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl ui-text">1</span>
              </div>
              <h3 className="text-xl mb-2 text-[hsl(var(--text-primary))]">Choose Your Tree</h3>
              <p 
                className="text-sm text-[hsl(var(--stone))] leading-relaxed"
                style={{ fontFamily: 'IBM Plex Mono, monospace' }}
              >
                Browse our living library and select an avocado, mango, or durian tree that speaks to you.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[hsl(var(--text-accent))] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl ui-text">2</span>
              </div>
              <h3 className="text-xl mb-2 text-[hsl(var(--text-primary))]">Follow Its Journey</h3>
              <p 
                className="text-sm text-[hsl(var(--stone))] leading-relaxed"
                style={{ fontFamily: 'IBM Plex Mono, monospace' }}
              >
                Receive regular updates with photos and stories as your tree grows through the seasons.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[hsl(var(--text-accent))] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl ui-text">3</span>
              </div>
              <h3 className="text-xl mb-2 text-[hsl(var(--text-primary))]">Share the Harvest</h3>
              <p 
                className="text-sm text-[hsl(var(--stone))] leading-relaxed"
                style={{ fontFamily: 'IBM Plex Mono, monospace' }}
              >
                When harvest time comes, enjoy the fruits of your tree's labor shipped fresh to you.
              </p>
            </div>
          </div>
        </div>
      </TeaserSection>

      {/* Tree Category Showcase Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl mb-6 text-[hsl(var(--text-primary))]" style={{ fontFamily: 'Caveat, cursive' }}>
            Ready to Meet Our Trees?
          </h2>
          <p className="text-lg text-[hsl(var(--text-secondary))] max-w-2xl mx-auto leading-relaxed mb-8" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
            Explore our living library of avocados, mangos, and durians. Find the one that speaks to you and begin following its journey.
          </p>
          <Link to="/farm-and-garden/trees">
            <button className="bg-[hsl(var(--background-secondary))] text-[hsl(var(--text-accent))] font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all text-xl">
              Meet Our Trees
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default FarmAndGarden;