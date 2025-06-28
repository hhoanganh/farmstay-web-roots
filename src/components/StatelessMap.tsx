
// ABOUTME: This component displays an embedded Google Map.
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
        {/* Embedded Google Map */}
        <iframe
          title="Location of Lâm Hà Farmstay"
          src="<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7814.175208959759!2d108.1090711!3d11.688203699999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317159005f1eae23%3A0xbeab3218e10d93ae!2sAnn%20Village!5e0!3m2!1sen!2s!4v1751107046943!5m2!1sen!2s"
          className="w-full h-64 md:h-96 rounded-lg"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default StatelessMap;
