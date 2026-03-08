import artworkHero from "@/assets/artwork-hero.jpg";
import artwork1 from "@/assets/artwork-1.jpg";
import artwork2 from "@/assets/artwork-2.jpg";
import artwork3 from "@/assets/artwork-3.jpg";
import artwork4 from "@/assets/artwork-4.jpg";
import artwork5 from "@/assets/artwork-5.jpg";
import artwork6 from "@/assets/artwork-6.jpg";

export interface Artwork {
  id: string;
  title: string;
  description: string;
  year: number;
  medium: string;
  dimensions: string;
  price: number;
  isSold: boolean;
  images: string[];
  printPrice?: number;
}

export const artworks: Artwork[] = [
  {
    id: "genesis-of-fire",
    title: "Genesis of Fire",
    description: "A sweeping exploration of primordial energy, this large-scale work captures the eternal dance between creation and destruction. Bold reds and deep blues collide with gold leaf accents, creating a visceral sense of movement that draws the viewer into the heart of the canvas.",
    year: 2024,
    medium: "Oil and gold leaf on canvas",
    dimensions: "180 × 120 cm",
    price: 12500,
    isSold: false,
    images: [artworkHero],
    printPrice: 250,
  },
  {
    id: "amber-reflections",
    title: "Amber Reflections",
    description: "Warm earth tones and geometric precision merge in this contemplative piece. The interplay of amber, sienna, and deep teal creates a sense of depth that evolves with each viewing, revealing hidden structures beneath the surface.",
    year: 2023,
    medium: "Oil on canvas",
    dimensions: "100 × 130 cm",
    price: 8500,
    isSold: false,
    images: [artwork1],
    printPrice: 180,
  },
  {
    id: "emerald-horizons",
    title: "Emerald Horizons",
    description: "An ethereal landscape of the imagination, where mountains dissolve into mist and gold light breaks through turquoise depths. This work speaks to the boundary between the seen and the felt.",
    year: 2024,
    medium: "Oil and gold leaf on canvas",
    dimensions: "80 × 100 cm",
    price: 9200,
    isSold: true,
    images: [artwork2],
    printPrice: 200,
  },
  {
    id: "silhouette-of-grace",
    title: "Silhouette of Grace",
    description: "A figure emerges from a field of crimson and orange, caught in a moment of transformation. The work explores themes of identity, impermanence, and the beauty found in the space between presence and absence.",
    year: 2023,
    medium: "Oil on canvas",
    dimensions: "100 × 125 cm",
    price: 7800,
    isSold: false,
    images: [artwork3],
    printPrice: 180,
  },
  {
    id: "whisper-of-light",
    title: "Whisper of Light",
    description: "Minimal yet deeply atmospheric, this painting distills landscape to its purest essence. Soft greys yield to touches of gold, suggesting a horizon caught in the first moments of dawn.",
    year: 2024,
    medium: "Oil and gold leaf on canvas",
    dimensions: "100 × 100 cm",
    price: 6500,
    isSold: false,
    images: [artwork4],
    printPrice: 150,
  },
  {
    id: "nocturnal-divide",
    title: "Nocturnal Divide",
    description: "A powerful study in contrasts, where deep black gives way to electric blue and violet. The vertical composition creates a sense of passage, a doorway between darkness and illumination.",
    year: 2023,
    medium: "Acrylic on canvas",
    dimensions: "125 × 100 cm",
    price: 7200,
    isSold: false,
    images: [artwork5],
    printPrice: 170,
  },
  {
    id: "oceanic-flow",
    title: "Oceanic Flow",
    description: "Turquoise depths and gold veins create a mesmerizing topography of color. Inspired by the movement of water and geological formations, this piece invites meditation on the forces that shape our world.",
    year: 2024,
    medium: "Oil and gold leaf on canvas",
    dimensions: "80 × 100 cm",
    price: 8800,
    isSold: false,
    images: [artwork6],
    printPrice: 190,
  },
];
