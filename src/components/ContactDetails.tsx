
import { Mail, Phone } from 'lucide-react';

const ContactDetails = () => {
  return (
    <div className="space-y-8">
      <h2 
        className="text-3xl mb-6 text-[hsl(var(--text-accent))]"
        style={{ fontFamily: 'Caveat, cursive' }}
      >
        Find Us Here
      </h2>

      {/* Contact Cards */}
      <div className="space-y-4">
        {/* Phone Card */}
        <div className="bg-[hsl(var(--background-primary))] p-6 rounded-lg border border-[hsl(var(--stone))] border-opacity-20 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-[hsl(var(--stone))] bg-opacity-10">
              <Phone className="w-5 h-5 text-[hsl(var(--brown))]" />
            </div>
            <div>
              <h3 
                className="text-lg font-medium text-[hsl(var(--text-primary))]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Call Us
              </h3>
              <p 
                className="text-[hsl(var(--stone))] text-sm"
                style={{ fontFamily: 'IBM Plex Mono, monospace' }}
              >
                +84 xxx xxx xxx
              </p>
            </div>
          </div>
        </div>

        {/* Email Card */}
        <div className="bg-[hsl(var(--background-primary))] p-6 rounded-lg border border-[hsl(var(--stone))] border-opacity-20 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-[hsl(var(--stone))] bg-opacity-10">
              <Mail className="w-5 h-5 text-[hsl(var(--brown))]" />
            </div>
            <div>
              <h3 
                className="text-lg font-medium text-[hsl(var(--text-primary))]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Email Us
              </h3>
              <p 
                className="text-[hsl(var(--stone))] text-sm"
                style={{ fontFamily: 'IBM Plex Mono, monospace' }}
              >
                hello@lamhafarmstay.com
              </p>
            </div>
          </div>
        </div>

        {/* Address Card */}
        <div className="bg-[hsl(var(--background-primary))] p-6 rounded-lg border border-[hsl(var(--stone))] border-opacity-20 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-[hsl(var(--stone))] bg-opacity-10 mt-1">
              <svg className="w-5 h-5 text-[hsl(var(--brown))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 
                className="text-lg font-medium text-[hsl(var(--text-primary))]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Visit Us
              </h3>
              <p 
                className="text-[hsl(var(--stone))] text-sm leading-relaxed"
                style={{ fontFamily: 'IBM Plex Mono, monospace' }}
              >
                Lâm Hà District<br />
                Lâm Đồng Province<br />
                Central Highlands, Vietnam
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media Links */}
      <div className="pt-6 border-t border-[hsl(var(--stone))] border-opacity-20">
        <h3 
          className="text-lg mb-4 text-[hsl(var(--text-primary))]"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Follow Our Journey
        </h3>
        <div className="flex gap-4">
          <a 
            href="https://facebook.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-[hsl(var(--stone))] bg-opacity-10 hover:bg-[hsl(var(--brown))] hover:bg-opacity-10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus:ring-2 focus:ring-[hsl(var(--focus))] focus:ring-offset-2"
            aria-label="Facebook"
          >
            <svg className="w-5 h-5 text-[hsl(var(--brown))]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </a>
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-[hsl(var(--stone))] bg-opacity-10 hover:bg-[hsl(var(--brown))] hover:bg-opacity-10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus:ring-2 focus:ring-[hsl(var(--focus))] focus:ring-offset-2"
            aria-label="Instagram"
          >
            <svg className="w-5 h-5 text-[hsl(var(--brown))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactDetails;
