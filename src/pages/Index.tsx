// ABOUTME: This is the main homepage for the farmstay website.
// ABOUTME: It features a hero section and teasers for other pages.

import { Link } from 'react-router-dom';
import ImageWrapper from '../components/ImageWrapper';
import TeaserSection from '../components/TeaserSection';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import CallToActionSection from '../components/CallToActionSection';

const Homepage = () => {
  const homestayAnimation = useScrollAnimation();
  const farmAnimation = useScrollAnimation();
  const journalAnimation = useScrollAnimation();
  const connectAnimation = useScrollAnimation();

  return (
    <>
      
      {/* Hero Section */}
      <section className="relative h-[40vh] md:h-[50vh] min-h-[300px] flex items-center justify-center text-center overflow-hidden rounded-lg shadow-lg mb-12 md:mb-16 mx-4 mt-16 md:mt-24">
        {/* Background Video */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          {/* Video imported for asset hashing by Vite. Place the original video in `public/videos`. */}
          <source src="https://github.com/hhoanganh/farmstay-web-roots/releases/download/herovideo/timelapse.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black opacity-40 z-10"></div>

        {/* Content */}
        <div className="relative z-20 px-4 text-white">
          <div className="max-w-4xl mx-auto">
            <h1 
              className="text-5xl md:text-6xl mb-6"
              style={{ fontFamily: 'Caveat, cursive' }}
            >
              Our journal begins here
            </h1>
            <p 
              className="text-xs md:text-base max-w-2xl mx-auto leading-relaxed"
              style={{ fontFamily: 'IBM Plex Mono, monospace' }}
            >
              When we first found this land in Lâm Hà, we knew it held stories waiting to be shared. 
              Welcome to our corner of Vietnam's Central Highlands, where every sunrise brings new discoveries.
            </p>
          </div>
        </div>
      </section>

        {/* Homestay Teaser */}
        <TeaserSection className="overflow-hidden mt-[-2rem] md:mt-[-4rem]">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div 
                ref={homestayAnimation.ref}
                className={`fade-in-scroll slide-in-left ${homestayAnimation.isVisible ? 'visible' : ''}`}
              >
                <ImageWrapper 
                  src="https://ik.imagekit.io/offvxi40h/our-farmstay-2.jpg?" 
                  alt="Our homestay rooms nestled in the mountains"
                  className="max-w-md mx-auto"
                />
              </div>
            </div>

            <div>
              <div 
                className={`fade-in-scroll slide-in-right ${homestayAnimation.isVisible ? 'visible' : ''}`}
              >
                <h3 
                  className="text-3xl md:text-4xl mb-4 text-[hsl(var(--text-primary))]"
                  style={{ fontFamily: 'Caveat, cursive' }}
                >
                  Rest among the coffee trees
                </h3>
                <p 
                  className="text-lg text-[hsl(var(--stone))] mb-6 leading-relaxed"
                  style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                >
                  Our rooms are simple sanctuaries where the mountain air flows freely and the sound of rustling leaves 
                  becomes your lullaby. Each space tells its own story of comfort and connection to the land.
                </p>
                <Link 
                  to="/homestay" 
                  className="relative z-10 flex items-center justify-center text-[hsl(var(--text-accent))] font-medium transition-opacity focus:outline-none focus:ring-2 focus:ring-[hsl(var(--focus))] focus:ring-offset-2 rounded-sm px-3 py-2 min-h-[44px] w-fit focus-visible:[background-color:hsl(var(--stone)/0.2)] hover:[background-color:hsl(var(--stone)/0.2)]"
                >
                  Explore our rooms →
                </Link>
              </div>
            </div>
          </div>
        </TeaserSection>

        {/* Farm & Garden Teaser */}
        <TeaserSection className="mt-[-4rem] md:mt-[-6rem] overflow-hidden">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div 
              ref={farmAnimation.ref}
              className={`md:order-2 fade-in-scroll slide-in-right ${farmAnimation.isVisible ? 'visible' : ''}`}
            >
              <ImageWrapper 
                src="https://thoibaonganhang.vn/stores/news_dataimages/minhvl/012022/17/02/1220_d2010mh-1603226412403.jpg" 
                alt="A tree in the farm garden"
                className="max-w-md mx-auto transform rotate-2"
              />
            </div>
            
            <div 
              className={`md:order-1 fade-in-scroll slide-in-left ${farmAnimation.isVisible ? 'visible' : ''}`}
            >
              <h3 
                className="text-3xl md:text-4xl mb-4 text-[hsl(var(--text-primary))]"
                style={{ fontFamily: 'Caveat, cursive' }}
              >
                Our Living Garden & Tree Rentals
              </h3>
              <p 
                className="text-lg text-[hsl(var(--stone))] mb-6 leading-relaxed"
                style={{ fontFamily: 'IBM Plex Mono, monospace' }}
              >
                Our garden is a vibrant ecosystem of local flora. We also offer a unique service where you can rent a tree, 
                follow its growth, and enjoy its harvest. It's a special way to connect with the land, even from afar.
              </p>
              <Link 
                to="/farm-and-garden" 
                  className="relative z-10 flex items-center justify-center text-[hsl(var(--text-accent))] font-medium transition-opacity focus:outline-none focus:ring-2 focus:ring-[hsl(var(--focus))] focus:ring-offset-2 rounded-sm px-3 py-2 min-h-[44px] w-fit focus-visible:[background-color:hsl(var(--stone)/0.2)] hover:[background-color:hsl(var(--stone)/0.2)]"
              >
                Learn about our farm & adoption story →
              </Link>
            </div>
          </div>
        </TeaserSection>

        {/* Journal Teaser */}
        <TeaserSection className="mt-[-4rem] md:mt-[-6rem] overflow-hidden">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div 
              ref={journalAnimation.ref}
              className={`fade-in-scroll slide-in-left ${journalAnimation.isVisible ? 'visible' : ''}`}
            >
              <ImageWrapper 
                src="https://thiennhienmoitruong.vn/upload2024/images/btv-n.linh/bvtnlinh-1/btv-1a/9274271d-c64e-41e8-addb-14e1fec660d0.jpg" 
                alt="Pages from our farmstay journal"
                className="max-w-md mx-auto transform -rotate-1"
              />
            </div>
            
            <div 
              className={`fade-in-scroll slide-in-right ${journalAnimation.isVisible ? 'visible' : ''}`}
            >
              <h3 
                className="text-3xl md:text-4xl mb-4 text-[hsl(var(--text-primary))]"
                style={{ fontFamily: 'Caveat, cursive' }}
              >
                Stories from the field
              </h3>
              <p 
                className="text-lg text-[hsl(var(--stone))] mb-6 leading-relaxed"
                style={{ fontFamily: 'IBM Plex Mono, monospace' }}
              >
                Every day brings new moments worth capturing. From the first harvest of the season to quiet mornings 
                watching the mist roll over the valley, these are the stories that make this place alive.
              </p>
              <Link 
                to="/experiences" 
                  className="relative z-10 flex items-center justify-center text-[hsl(var(--text-accent))] font-medium transition-opacity focus:outline-none focus:ring-2 focus:ring-[hsl(var(--focus))] focus:ring-offset-2 rounded-sm px-3 py-2 min-h-[44px] w-fit focus-visible:[background-color:hsl(var(--stone)/0.2)] hover:[background-color:hsl(var(--stone)/0.2)]"
              >
                Read our journal →
              </Link>
            </div>
          </div>
        </TeaserSection>

        {/* Connect Section - Now using the reusable CallToActionSection component */}
        <CallToActionSection
          heading="Begin your story"
          animationRef={connectAnimation.ref}
          isVisible={connectAnimation.isVisible}
        >
          <Link 
            to="/homestay" 
            className="inline-block bg-[hsl(var(--text-accent))] text-white px-8 py-3 rounded-md transition-opacity ui-text font-medium focus:outline-none focus:ring-2 focus:ring-[hsl(var(--focus))] focus:ring-offset-2 min-h-[44px] flex items-center"
          >
            Explore Our Rooms
          </Link>
          <Link 
            to="/connect" 
            className="inline-block bg-transparent border border-[hsl(var(--text-accent))] text-[hsl(var(--text-accent))] px-8 py-3 rounded-md transition-colors ui-text font-medium focus:outline-none focus:ring-2 focus:ring-[hsl(var(--focus))] focus:ring-offset-2 min-h-[44px] flex items-center"
          >
            Connect With Us
          </Link>
        </CallToActionSection>

      </>
  );
};

export default Homepage;
