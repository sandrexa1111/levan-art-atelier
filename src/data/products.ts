import artwork1 from "@/assets/artwork-1.jpg";
import artwork2 from "@/assets/artwork-2.jpg";
import artwork3 from "@/assets/artwork-3.jpg";
import artwork4 from "@/assets/artwork-4.jpg";
import artwork5 from "@/assets/artwork-5.jpg";
import artwork6 from "@/assets/artwork-6.jpg";

export type ProductType = "print" | "tshirt" | "mug" | "poster" | "limited-edition";

export interface ProductVariant {
  id: string;
  label: string;
  price: number;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  type: ProductType;
  variantId: string;
  images: string[];
  stock: number;
  variants?: ProductVariant[];
}

export const products: Product[] = [
  {
    id: "print-amber-reflections",
    title: "Amber Reflections — Fine Art Print",
    description: "Museum-quality giclée print on 310gsm Hahnemühle cotton paper. Each print is hand-signed by the artist and comes with a certificate of authenticity.",
    price: 180,
    type: "print",
    variantId: "lmsq_variant_001",
    images: [artwork1],
    stock: 50,
    variants: [
      { id: "small", label: "40 × 52 cm", price: 180 },
      { id: "medium", label: "60 × 78 cm", price: 280 },
      { id: "large", label: "80 × 104 cm", price: 420 },
    ],
  },
  {
    id: "print-oceanic-flow",
    title: "Oceanic Flow — Fine Art Print",
    description: "Museum-quality giclée print capturing the luminous turquoise and gold of the original. Printed on archival cotton paper.",
    price: 190,
    type: "print",
    variantId: "lmsq_variant_002",
    images: [artwork6],
    stock: 50,
    variants: [
      { id: "small", label: "40 × 50 cm", price: 190 },
      { id: "medium", label: "60 × 75 cm", price: 290 },
      { id: "large", label: "80 × 100 cm", price: 440 },
    ],
  },
  {
    id: "tshirt-genesis",
    title: "Genesis of Fire — Artist T-Shirt",
    description: "Premium organic cotton t-shirt featuring a detail from 'Genesis of Fire'. Printed with eco-friendly inks. Unisex fit.",
    price: 65,
    type: "tshirt",
    variantId: "lmsq_variant_003",
    images: [artwork3],
    stock: 100,
    variants: [
      { id: "s", label: "S", price: 65 },
      { id: "m", label: "M", price: 65 },
      { id: "l", label: "L", price: 65 },
      { id: "xl", label: "XL", price: 65 },
    ],
  },
  {
    id: "mug-whisper",
    title: "Whisper of Light — Art Mug",
    description: "Fine bone china mug featuring the delicate composition of 'Whisper of Light'. Dishwasher safe. 350ml capacity.",
    price: 35,
    type: "mug",
    variantId: "lmsq_variant_004",
    images: [artwork4],
    stock: 200,
  },
  {
    id: "poster-nocturnal",
    title: "Nocturnal Divide — Gallery Poster",
    description: "Large-format poster on heavyweight 200gsm satin paper. Perfect for making a bold statement in any space.",
    price: 45,
    type: "poster",
    variantId: "lmsq_variant_005",
    images: [artwork5],
    stock: 150,
    variants: [
      { id: "a3", label: "A3", price: 45 },
      { id: "a2", label: "A2", price: 65 },
      { id: "a1", label: "A1", price: 95 },
    ],
  },
  {
    id: "limited-emerald",
    title: "Emerald Horizons — Limited Edition",
    description: "Exclusive limited edition of 25 hand-signed and numbered giclée prints on museum-grade cotton rag paper. Includes certificate of authenticity and custom framing.",
    price: 950,
    type: "limited-edition",
    variantId: "lmsq_variant_006",
    images: [artwork2],
    stock: 8,
  },
];

export const productTypeLabels: Record<ProductType, string> = {
  print: "Fine Art Prints",
  tshirt: "T-Shirts",
  mug: "Mugs",
  poster: "Posters",
  "limited-edition": "Limited Editions",
};
