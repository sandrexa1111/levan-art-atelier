import artworkHero from "@/assets/artwork-hero.jpg";
import studio from "@/assets/studio.jpg";
import artwork6 from "@/assets/artwork-6.jpg";

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  createdAt: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "genesis-of-fire-unveiled",
    title: "Genesis of Fire — A New Chapter",
    excerpt: "Exploring the creative journey behind my latest large-scale work and the inspiration drawn from Georgian mythology.",
    content: `The creation of "Genesis of Fire" has been a deeply personal journey spanning several months. The work draws inspiration from Georgian mythology — the legend of Amirani, the Caucasian Prometheus, who stole fire from the gods.\n\nThe bold interplay of crimson, cobalt, and gold leaf represents the eternal struggle between mortal ambition and divine power. Each brushstroke was applied with deliberate energy, building layers of texture that invite the viewer to discover new details with every encounter.\n\nThis painting marks a turning point in my practice, embracing larger scales and more physical approaches to mark-making.`,
    image: artworkHero,
    createdAt: "2024-11-15",
  },
  {
    id: "inside-the-studio",
    title: "Inside the Studio — Winter 2024",
    excerpt: "A behind-the-scenes look at the creative process, materials, and daily rituals that shape each painting.",
    content: `My studio in Tbilisi is where chaos meets order. Large canvases lean against whitewashed walls, and the air carries the familiar scent of linseed oil and turpentine.\n\nEach day begins with silence — a cup of Georgian mountain tea, and time spent simply looking at the previous day's work. I believe that painting requires both action and contemplation in equal measure.\n\nCurrently, I'm working on a new series that explores the intersection of landscape and memory, drawing from the mountains of the Caucasus that have shaped my vision since childhood.`,
    image: studio,
    createdAt: "2024-10-02",
  },
  {
    id: "oceanic-series-announcement",
    title: "Announcing the Oceanic Series",
    excerpt: "A new body of work inspired by the Black Sea coast and the ancient relationship between water, earth, and gold.",
    content: `I'm thrilled to announce my latest series of paintings, "Oceanic," which will debut at Gallery Vernissage in Tbilisi this spring.\n\nThe series consists of seven large-scale works that explore the Black Sea coastline through abstraction. Turquoise, teal, and gold dominate the palette, creating immersive fields of color that evoke the sensory experience of standing at the water's edge.\n\nEach piece incorporates gold leaf, connecting to the ancient tradition of Georgian goldsmithing and the treasures of Colchis.`,
    image: artwork6,
    createdAt: "2024-08-20",
  },
];
