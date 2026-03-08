import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { artworks } from "@/data/artworks";
import { products } from "@/data/products";
import ArtworkCard from "@/components/ArtworkCard";
import ProductCard from "@/components/ProductCard";
import artworkHero from "@/assets/artwork-hero.jpg";
import artistPortrait from "@/assets/artist-portrait.jpg";
import { fadeUp, fadeUpSimple } from "@/lib/animations";
import { useState } from "react";

export default function Index() {
  const [email, setEmail] = useState("");
  const featured = artworks.slice(0, 4);
  const featuredProducts = products.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={artworkHero} alt="Genesis of Fire by Levan Mosiashvili" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-charcoal/50" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative text-center px-6"
        >
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">Contemporary Fine Art</p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-cream leading-tight mb-6">
            Levan<br />Mosiashvili
          </h1>
          <p className="text-cream/70 text-lg mb-10 max-w-lg mx-auto">
            Where color meets emotion. Original paintings, fine art prints, and exclusive merchandise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 bg-cream text-charcoal px-8 py-3.5 text-sm tracking-wider uppercase hover:bg-gold transition-colors duration-300"
            >
              Explore Gallery <ArrowRight size={16} />
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 border border-cream/40 text-cream px-8 py-3.5 text-sm tracking-wider uppercase hover:border-gold hover:text-gold transition-colors duration-300"
            >
              Shop Art
            </Link>
          </div>
        </motion.div>
      </section>

      {/* About Snippet */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpSimple}>
              <img src={artistPortrait} alt="Levan Mosiashvili in studio" className="w-full aspect-[3/4] object-cover" />
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
              <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">The Artist</p>
              <h2 className="font-serif text-3xl md:text-4xl mb-6">A Journey Through Color</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Based in Tbilisi, Georgia, Levan Mosiashvili creates bold, emotionally charged abstract paintings that
                bridge Eastern and Western artistic traditions. His work explores the tension between structure and
                freedom, drawing from Georgian heritage and the dramatic landscapes of the Caucasus.
              </p>
              <Link
                to="/artist"
                className="inline-flex items-center gap-2 text-sm tracking-wider uppercase text-foreground hover:text-gold transition-colors"
              >
                Read More <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Artworks */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">Collection</p>
            <h2 className="font-serif text-3xl md:text-4xl">Featured Artworks</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featured.map((artwork, i) => (
              <motion.div key={artwork.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <ArtworkCard artwork={artwork} />
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/gallery" className="inline-flex items-center gap-2 text-sm tracking-wider uppercase hover:text-gold transition-colors">
              View Full Gallery <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Shop */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">Shop</p>
            <h2 className="font-serif text-3xl md:text-4xl">Bring Art Home</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {featuredProducts.map((product, i) => (
              <motion.div key={product.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/shop" className="inline-flex items-center gap-2 text-sm tracking-wider uppercase hover:text-gold transition-colors">
              Browse All Products <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-charcoal text-cream">
        <div className="container mx-auto px-6 text-center max-w-xl">
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">Stay Connected</p>
          <h2 className="font-serif text-3xl md:text-4xl mb-4">Newsletter</h2>
          <p className="text-cream/60 mb-8">
            Be the first to know about new artworks, exhibitions, and exclusive releases.
          </p>
          <form onSubmit={(e) => { e.preventDefault(); setEmail(""); }} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="flex-1 bg-cream/10 border border-cream/20 px-4 py-3 text-sm text-cream placeholder:text-cream/40 focus:outline-none focus:border-gold transition-colors"
            />
            <button type="submit" className="bg-gold text-charcoal px-8 py-3 text-sm tracking-wider uppercase font-semibold hover:bg-gold-light transition-colors">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
