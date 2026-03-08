import { useParams, Link } from "react-router-dom";
import { artworks } from "@/data/artworks";
import { useCart } from "@/context/CartContext";
import { ArrowLeft, Shield, ZoomIn } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function ArtworkDetail() {
  const { id } = useParams();
  const artwork = artworks.find((a) => a.id === id);
  const { addItem } = useCart();
  const [zoomed, setZoomed] = useState(false);

  if (!artwork) {
    return (
      <div className="py-32 text-center">
        <p className="text-muted-foreground">Artwork not found.</p>
        <Link to="/gallery" className="text-gold underline mt-4 inline-block">Back to Gallery</Link>
      </div>
    );
  }

  const handleBuyOriginal = () => {
    addItem({
      id: artwork.id,
      title: `${artwork.title} (Original)`,
      price: artwork.price,
      image: artwork.images[0],
      quantity: 1,
      type: "artwork",
    });
    toast.success("Added to cart");
  };

  const handleBuyPrint = () => {
    addItem({
      id: artwork.id + "-print",
      title: `${artwork.title} (Print)`,
      price: artwork.printPrice || 200,
      image: artwork.images[0],
      quantity: 1,
      type: "print",
    });
    toast.success("Added to cart");
  };

  return (
    <div className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <Link to="/gallery" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft size={16} /> Back to Gallery
        </Link>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {/* Image */}
          <div className="relative group cursor-zoom-in" onClick={() => setZoomed(true)}>
            <img
              src={artwork.images[0]}
              alt={artwork.title}
              className="w-full object-cover"
            />
            <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/20 transition-colors flex items-center justify-center">
              <ZoomIn className="text-cream opacity-0 group-hover:opacity-100 transition-opacity" size={32} />
            </div>
            {artwork.isSold && (
              <div className="absolute top-6 right-6 bg-charcoal text-cream text-sm tracking-wider uppercase px-4 py-2">
                Sold
              </div>
            )}
          </div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-gold text-sm tracking-[0.3em] uppercase mb-2">{artwork.year}</p>
            <h1 className="font-serif text-3xl md:text-4xl mb-4">{artwork.title}</h1>
            <p className="text-muted-foreground leading-relaxed mb-8">{artwork.description}</p>

            <div className="space-y-3 mb-8 text-sm">
              <div className="flex justify-between border-b border-border pb-3">
                <span className="text-muted-foreground">Medium</span>
                <span>{artwork.medium}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-3">
                <span className="text-muted-foreground">Dimensions</span>
                <span>{artwork.dimensions}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-3">
                <span className="text-muted-foreground">Year</span>
                <span>{artwork.year}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-3">
                <span className="text-muted-foreground">Price (Original)</span>
                <span className="font-serif text-lg">{artwork.isSold ? "SOLD" : `€${artwork.price.toLocaleString()}`}</span>
              </div>
              {artwork.printPrice && (
                <div className="flex justify-between border-b border-border pb-3">
                  <span className="text-muted-foreground">Price (Print)</span>
                  <span className="font-serif text-lg">From €{artwork.printPrice}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 mb-10">
              {!artwork.isSold && (
                <button
                  onClick={handleBuyOriginal}
                  className="w-full bg-charcoal text-cream py-3.5 text-sm tracking-wider uppercase hover:bg-charcoal-light transition-colors"
                >
                  Buy Original — €{artwork.price.toLocaleString()}
                </button>
              )}
              {artwork.printPrice && (
                <button
                  onClick={handleBuyPrint}
                  className="w-full border border-foreground py-3.5 text-sm tracking-wider uppercase hover:bg-secondary transition-colors"
                >
                  Buy Print — From €{artwork.printPrice}
                </button>
              )}
            </div>

            {/* Certificate */}
            {!artwork.isSold && (
              <div className="bg-secondary p-6 flex gap-4 items-start">
                <Shield className="text-gold mt-0.5 flex-shrink-0" size={20} />
                <div>
                  <h3 className="font-serif text-sm font-semibold mb-1">Certificate of Authenticity</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Each original painting comes with a signed Certificate of Authenticity, confirming the
                    work as a genuine creation by Levan Mosiashvili. The certificate includes details about
                    the artwork, its provenance, and a unique registration number.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Zoom Modal */}
      <AnimatePresence>
        {zoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-charcoal/95 flex items-center justify-center cursor-zoom-out p-4"
            onClick={() => setZoomed(false)}
          >
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={artwork.images[0]}
              alt={artwork.title}
              className="max-w-full max-h-full object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
