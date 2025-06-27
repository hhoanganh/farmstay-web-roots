// ABOUTME: This component displays a list of special features or "highlights" for a room.
// ABOUTME: It presents them in a styled list format.

interface RoomDetailsProps {
  highlights: string[];
}

const RoomDetails = ({ highlights }: RoomDetailsProps) => {
  return (
    <div className="space-y-6">
      <h2 
        className="text-2xl md:text-3xl text-[hsl(var(--text-primary))]"
        style={{ fontFamily: 'Caveat, cursive' }}
      >
        What makes this special
      </h2>
      
      <div className="space-y-4">
        {highlights.map((highlight, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="w-6 h-6 bg-[hsl(var(--brown))] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <p className="text-[hsl(var(--stone))] leading-relaxed font-mono">
              {highlight}
            </p>
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-[hsl(var(--stone))] border-opacity-20">
        <p className="text-sm text-[hsl(var(--stone))] font-mono italic">
          Every detail in our rooms has been thoughtfully chosen to enhance your connection with the natural rhythm of farm life.
        </p>
      </div>
    </div>
  );
};

export default RoomDetails;
