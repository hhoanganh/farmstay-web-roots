
// ABOUTME: This component displays a placeholder for an interactive map.
// ABOUTME: It shows the physical location of the farmstay.
const StatelessMap = () => {
  return (
    <div className="w-full">
      <h2 
        className="text-3xl mb-6 text-center text-[hsl(var(--text-accent))]"
        style={{ fontFamily: 'Caveat, cursive' }}
      >
        Where to Find Us
      </h2>
      
      <div className="bg-[hsl(var(--background-primary))] p-4 rounded-lg border border-[hsl(var(--stone))] border-opacity-20 shadow-sm">
        {/* Embedded map placeholder - replace with actual map service */}
        <div className="w-full h-64 md:h-96 bg-[hsl(var(--stone))] bg-opacity-10 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="p-4 rounded-full bg-[hsl(var(--stone))] bg-opacity-20 inline-block mb-4">
              <svg className="w-8 h-8 text-[hsl(var(--brown))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p 
              className="text-[hsl(var(--stone))] text-sm"
              style={{ fontFamily: 'IBM Plex Mono, monospace' }}
            >
              Interactive map coming soon
            </p>
            <p 
              className="text-[hsl(var(--stone))] text-xs mt-2"
              style={{ fontFamily: 'IBM Plex Mono, monospace' }}
            >
              Lâm Hà District, Lâm Đồng Province, Vietnam
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatelessMap;
