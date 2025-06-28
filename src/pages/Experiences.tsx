// ABOUTME: This page showcases the various experiences available at the farmstay.
// ABOUTME: It includes a hero section and will later list different activities.

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

        {/* Future content for experiences will go here */}
      </div>
    </div>
  );
};

export default Experiences;
