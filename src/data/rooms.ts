// ABOUTME: This file contains the static data for the homestay rooms.
// ABOUTME: It is used to populate the Homestay page with room information.

// Import local image assets for optimal performance and cache busting
import coffeeLoftImage from '../assets/images/coffee-loft.jpg';
import gardenBungalowImage from '../assets/images/garden-bungalow.jpg';
import orchardHouseImage from '../assets/images/orchard-house.jpg';

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
    description: "I find myself drawn to the loft most mornings, just as the sun begins to burn the mist off the valley below. From here, you can see the entire farm laid out before you, and the air is thick with the rich, earthy smell of our Robusta coffee fields. We designed it with floor-to-ceiling windows, so you feel like you’re floating just above the treetops. It’s our favorite spot for quiet reflection with a freshly brewed phin filter coffee, simply watching the day begin.",
    highlights: [
    "Unobstructed, panoramic views of the coffee valley and surrounding highlands.",
    "A cozy, elevated space designed to feel like a private lookout.",
    "The daily farm rhythm at your doorstep, from the morning harvest to the evening quiet.",
    "A selection of our own roasted beans and a traditional phin filter for the perfect morning ritual."
    ],
    imageSrc: coffeeLoftImage, // Use the imported local image
    imageAlt: "A cozy loft room with large windows overlooking a green valley."
  },
  {
    roomName: "The Garden Bungalow",
    roomSlug: "garden-bungalow",
    description: "We built this bungalow in the quietest corner of the property, tucked away where the air always seems to hold the scent of lemongrass and damp earth after the morning mist. It was meant to be a sanctuary, a place where the boundary between the garden and the home completely dissolves. We find that a morning spent here, with a cup of tea and the sounds of the garden, is a powerful reminder of the simple, good things in life.",
    highlights: [
    "A private patio completely enveloped by our organic herb and flower garden.",
    "An outdoor stone bathtub for a quiet soak under the stars.",
    "The simple joy of picking fresh herbs for your morning tea right outside the door.",
    "A calm, spacious interior crafted with natural wood and stone to echo the nature outside."
    ],
    imageSrc: gardenBungalowImage, // Use the imported local image
    imageAlt: "A serene bungalow with a garden view and an outdoor bathtub."
  },
  {
    roomName: "The Orchard House",
    roomSlug: "orchard-house",
    description: "This house holds so many of our own family memories. We built it from reclaimed wood from the original farm structure, right in the heart of our avocado and rambutan orchard. We always believed that the best connections are made around a shared meal, so we designed the large, open kitchen and living area to be the soul of the house. It's less of a rental and more of our home that we open up to families and groups of friends looking to create their own stories together.",
    highlights: [
    "A spacious, communal kitchen and living area designed for gathering and shared meals.",
    "Situated within our fruit orchard, with the simple pleasure of picking your own avocados for breakfast (when in season).",
    "Multiple bedrooms that offer both private retreat and easy connection to the main house.",
    "The perfect home base for larger groups to explore the highlands and reconnect with each other."
    ],
    imageSrc: orchardHouseImage, // Use the imported local image
    imageAlt: "A spacious house with a large porch surrounded by fruit trees."
  }
];