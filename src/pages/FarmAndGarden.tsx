
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
            Here in Vietnam's Central Highlands, where rolling hills meet cool, misty mornings, 
            our land tells its own story through the rich, red basalt soil. Every tree we've planted 
            has become part of this ancient landscape, and now we invite you to become part of theirs.
          </p>
        </div>
      </section>

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
          <div
            ref={conceptAnimation.ref}
            className={`order-2 md:order-2 md:col-span-2 fade-in-scroll slide-in-right ${conceptAnimation.isVisible ? 'visible' : ''}`}
          >
            <ImageWrapper 
              src="https://ik.imagekit.io/offvxi40h/adoption-1.jpg" 
              alt="A young tree being tended in our garden"
              className="max-w-md mx-auto transform -rotate-2"
            />
          </div>
          
          <div
            className={`order-1 md:order-1 md:col-span-3 fade-in-scroll slide-in-left ${conceptAnimation.isVisible ? 'visible' : ''}`}
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
        <div className="max-w-6xl mx-auto">
          <div 
            ref={showcaseAnimation.ref}
            className={`text-center mb-16 fade-in-scroll ${showcaseAnimation.isVisible ? 'visible' : ''}`}
          >
            <h2 
              className="text-4xl md:text-5xl mb-6 text-[hsl(var(--text-primary))]"
              style={{ fontFamily: 'Caveat, cursive' }}
            >
              Which Tree Will You Nurture?
            </h2>
            <p 
              className="text-lg text-[hsl(var(--stone))] max-w-2xl mx-auto leading-relaxed"
              style={{ fontFamily: 'IBM Plex Mono, monospace' }}
            >
              Our avocados, mangos, and durians are more than just trees—they are living journals. Find the one that speaks to you and begin following its journey.
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
              className="inline-block bg-transparent border border-[hsl(var(--text-accent))] text-[hsl(var(--text-accent))] px-8 py-3 rounded-md transition-colors ui-text font-medium focus:outline-none focus:ring-2 focus:ring-[hsl(var(--focus))] focus:ring-offset-2 min-h-[44px] flex items-center"
            >
              Ask Questions
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default FarmAndGarden;
export default FarmAndGarden;
