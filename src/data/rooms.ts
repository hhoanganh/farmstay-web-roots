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
    description: "Perched above our Robusta coffee fields, this loft offers panoramic views of the misty valley. We designed this cozy, elevated lookout for quiet mornings watching the farm come to life, feeling as if you're floating just above the treetops.",
    highlights: [
    "Unobstructed, panoramic views of the coffee valley",
    "A cozy, elevated space designed as a private lookout.",
    "The daily rhythm of the farm at your doorstep.",
    "A selection of our own roasted beans for the perfect morning ritual."
    ],
    imageSrc: "https://ik.imagekit.io/offvxi40h/coffee-loft.jpg",
    imageAlt: "A cozy loft room with large windows overlooking a green valley."
  },
  {
    roomName: "The Garden Bungalow",
    roomSlug: "garden-bungalow",
    description: "Tucked into a quiet corner of our property, this bungalow is a peaceful sanctuary where the fragrant herb garden and the living space become one. It was built for those looking to feel deeply connected to the earth.",
    highlights: [
    "A private patio completely enveloped by the herb garden.",
    "An outdoor stone bathtub for a quiet soak under the stars.",
    "The simple joy of picking fresh herbs right outside your door.",
    "A calm interior crafted with natural wood and stone."
    ],
    imageSrc: "https://ik.imagekit.io/offvxi40h/garden-bungalow.jpg",
    imageAlt: "A serene bungalow with a garden view and an outdoor bathtub."
  },
  {
    roomName: "The Orchard House",
    roomSlug: "orchard-house",
    description: "Situated in the heart of our fruit orchard, this spacious house was designed for connection. With its large, open kitchen, it’s our family home that we open to groups and friends looking to gather and create their own stories together.",
    highlights: [
    "A spacious, communal kitchen designed for shared meals.",
    "The simple pleasure of picking your own avocados for breakfast (when in season).",
    "Multiple bedrooms offering both private retreat and easy connection.",
    "The perfect home base for larger groups to explore the highlands."
    ],
    imageSrc: "https://ik.imagekit.io/offvxi40h/orchard-house.jpg",
    imageAlt: "A spacious house with a large porch surrounded by fruit trees."
  }
];