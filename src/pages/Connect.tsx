
import ContactForm from '../components/ContactForm';
import ContactDetails from '../components/ContactDetails';
import StatelessMap from '../components/StatelessMap';

const Connect = () => {
  return (
    <div className="px-4 pt-16 md:pt-24">
      <div className="max-w-6xl mx-auto">
        {/* Page Introduction Section */}
        <header className="text-center mb-12 md:mb-16">
          <h1 
            className="text-5xl md:text-6xl mb-6 text-[hsl(var(--text-accent))]"
            style={{ fontFamily: 'Caveat, cursive' }}
          >
            Get in Touch
          </h1>
          <p 
            className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed text-[hsl(var(--text-primary))]"
            style={{ fontFamily: 'IBM Plex Mono, monospace' }}
          >
            We'd love to hear from you. Whether you're curious about our rooms, interested in the farm experience, or simply want to share a story—drop us a line. Every conversation is the beginning of something beautiful.
          </p>
        </header>

        {/* Two-Column Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Contact Details - Shows first on mobile */}
          <div className="order-1 lg:order-2">
            <ContactDetails />
          </div>
          
          {/* Contact Form - Shows second on mobile */}
          <div className="order-2 lg:order-1">
            <ContactForm />
          </div>
        </div>

        {/* Map Section */}
        <div className="mb-16">
          <StatelessMap />
        </div>
      </div>
    </div>
  );
};

export default Connect;
