// ABOUTME: This page tells the story of the farmstay's origins.
// ABOUTME: It features a letter from the founders and a gallery of images.

import { Link } from 'react-router-dom';
import FounderLetter from '../components/FounderLetter';
import ImageGallery from '../components/ImageGallery';

const OurStory = () => {
  return (
    <main className="px-4 py-16 md:py-24">
      <div className="max-w-6xl mx-auto relative">
        <header className="relative text-center mb-12 md:mb-16 overflow-hidden min-h-[300px] flex items-center justify-center rounded-lg shadow-lg">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('https://bdsquan9.vn/wp-content/uploads/2021/06/%C4%91%E1%BA%A5t-n%E1%BB%81n-h%E1%BB%93-%C4%91%E1%BA%A1-sar-l%C3%A2m-h%C3%A0.jpg')` }}
          ></div>
          {/* Overlay for readability */}
          <div className="absolute inset-0 bg-black opacity-40"></div>

          {/* Content */}
          <div className="relative z-10 text-white">
            <h1 className="text-5xl md:text-6xl mb-6" style={{ fontFamily: 'Caveat, cursive' }}>
              Our Story
            </h1>
            <p className="text-lg md:text-xl mt-2 ui-text">How our little farmstay came to be.</p>
          </div>
        </header>

        <div className="lg:grid lg:grid-cols-3 lg:gap-12 space-y-12 lg:space-y-0">
          <div className="lg:col-span-2">
            <FounderLetter />
          </div>
          <div className="lg:col-span-1">
            <ImageGallery />
          </div>
        </div>

        <footer className="mt-16 md:mt-24 text-center border-t border-[hsl(var(--stone))] border-opacity-20 pt-12">
            <h2 className="text-3xl md:text-4xl mb-6 text-[hsl(var(--text-primary))]">
                Continue your journey
            </h2>
            <div className="flex justify-center gap-4 flex-wrap">
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
            </div>
        </footer>
      </div>
    </main>
  );
};

export default OurStory;
