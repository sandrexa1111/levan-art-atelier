import { motion } from "framer-motion";
import { artworks } from "@/data/artworks";
import ArtworkCard from "@/components/ArtworkCard";
import { fadeUp } from "@/lib/animations";

export default function Gallery() {
  return (
    <div className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">Collection</p>
          <h1 className="font-serif text-4xl md:text-5xl">Gallery</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {artworks.map((artwork, i) => (
            <motion.div key={artwork.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
              <ArtworkCard artwork={artwork} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
