// ABOUTME: This file contains the static data for the homestay rooms.
// ABOUTME: It is used to populate the Homestay page with room information.

export interface Room {
  roomName: string;
  roomSlug: string;
  description: string;
  highlights: string[];
  imageSrc: string;
  imageAlt: string;
}

export const rooms: Room[] = [
  {
    roomName: "The Coffee Loft",
    roomSlug: "coffee-loft",
    description: "Perched above the coffee fields, this cozy loft offers panoramic views of the valley. Wake up to the aroma of freshly brewed coffee and the gentle sounds of the farm coming to life. It's the perfect spot for quiet reflection and creative inspiration.",
    highlights: [
      "Unobstructed sunrise views over the mountains.",
      "A private balcony perfect for morning coffee.",
      "Direct access to the farm's main walking trails.",
      "Equipped with a small kitchenette and a reading nook."
    ],
    imageSrc: "https://images.unsplash.com/photo-1559701723-b72b5a45a8f3?q=80&w=1974&auto=format&fit=crop",
    imageAlt: "A cozy loft room with large windows overlooking a green valley."
  },
  {
    roomName: "The Garden Bungalow",
    roomSlug: "garden-bungalow",
    description: "Tucked away in a quiet corner of our organic garden, this private bungalow is a sanctuary of peace. Surrounded by fragrant herbs and flowers, you'll feel deeply connected to the earth. It's ideal for those seeking a tranquil retreat.",
    highlights: [
      "Private patio surrounded by a lush herb garden.",
      "An outdoor bathtub for a unique bathing experience.",
      "Fresh-picked ingredients available right outside your door.",
      "A spacious interior with natural materials and earthy tones."
    ],
    imageSrc: "https://images.unsplash.com/photo-1618221195710-dd6b41fa2247?q=80&w=1974&auto=format&fit=crop",
    imageAlt: "A serene bungalow with a garden view and an outdoor bathtub."
  },
  {
    roomName: "The Orchard House",
    roomSlug: "orchard-house",
    description: "A spacious, family-friendly house situated in the heart of our fruit orchard. With multiple rooms and a large common area, it's perfect for groups or families. Enjoy the simple pleasure of picking fruit right from the trees during harvest season.",
    highlights: ["Sleeps up to 6 guests comfortably.", "Fully equipped kitchen for self-catering.", "Large, shared porch with views of the durian and mango trees.", "Ideal for longer stays and family gatherings."],
    imageSrc: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=2070&auto=format&fit=crop",
    imageAlt: "A spacious house with a large porch surrounded by fruit trees."
  }
];