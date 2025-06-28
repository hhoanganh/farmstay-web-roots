
// ABOUTME: This page presents farm experiences in a split journal layout.
// ABOUTME: It features a dynamic journal feed alongside a static activities showcase.

import JournalFeed from '../components/JournalFeed';
import ActivitiesShowcase from '../components/ActivitiesShowcase';

const Experiences = () => {
  return (
    <div className="px-4 pt-16 md:pt-24">
      <div className="max-w-6xl mx-auto">
        <header className="relative text-center mb-12 md:mb-16 overflow-hidden h-[40vh] md:h-[50vh] min-h-[300px] flex items-center justify-center rounded-lg shadow-lg">
          {/* Background Image - TODO: Replace with a relevant image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('https://ik.imagekit.io/offvxi40h/experiences.jpg?tr=w-1200,q-80')` }}
          ></div>
          {/* Overlay for readability */}
          <div className="absolute inset-0 bg-black opacity-40"></div>

          {/* Content */}
          <div className="relative z-20 px-4 text-white">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl mb-6" style={{ fontFamily: 'Caveat, cursive' }}>
                Our Experiences
              </h1>
              <p 
                className="text-xs md:text-base max-w-2xl mx-auto leading-relaxed"
                style={{ fontFamily: 'IBM Plex Mono, monospace' }}
              >
                From garden tours to coffee tasting, discover the activities that connect you to the heart of our highland home.
              </p>
            </div>
          </div>
        </header>

        {/* Two-Part Asymmetrical Container */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left Column - The Journal Feed (Primary, wider column) */}
          <div className="order-2 lg:order-1 lg:w-2/3">
            <JournalFeed />
          </div>

          {/* Right Column - The Activities Showcase (Narrower, sticky column) */}
          <div className="order-1 lg:order-2 lg:w-1/3">
            <div className="lg:sticky lg:top-24">
              <ActivitiesShowcase />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experiences;
