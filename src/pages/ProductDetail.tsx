import { useParams, Link } from "react-router-dom";
import { products } from "@/data/products";
import { productTypeLabels } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(
    product?.variants?.[0]?.id
  );

  if (!product) {
    return (
      <div className="py-32 text-center">
        <p className="text-muted-foreground">Product not found.</p>
        <Link to="/shop" className="text-gold underline mt-4 inline-block">Back to Shop</Link>
      </div>
    );
  }

  const currentVariant = product.variants?.find((v) => v.id === selectedVariant);
  const currentPrice = currentVariant?.price || product.price;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      title: product.title + (currentVariant ? ` (${currentVariant.label})` : ""),
      price: currentPrice,
      image: product.images[0],
      quantity: 1,
      variant: selectedVariant,
      type: "product",
    });
    toast.success("Added to cart");
  };

  return (
    <div className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft size={16} /> Back to Shop
        </Link>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <img src={product.images[0]} alt={product.title} className="w-full object-cover" />
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-gold text-sm tracking-[0.3em] uppercase mb-2">
              {productTypeLabels[product.type]}
            </p>
            <h1 className="font-serif text-3xl md:text-4xl mb-4">{product.title}</h1>
            <p className="font-serif text-2xl text-gold mb-6">€{currentPrice}</p>
            <p className="text-muted-foreground leading-relaxed mb-8">{product.description}</p>

            {product.variants && product.variants.length > 0 && (
              <div className="mb-8">
                <p className="text-sm text-muted-foreground mb-3">Select option</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v.id)}
                      className={`text-sm px-4 py-2 border transition-colors ${
                        selectedVariant === v.id
                          ? "bg-charcoal text-cream border-charcoal"
                          : "border-border hover:border-foreground"
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full bg-charcoal text-cream py-3.5 text-sm tracking-wider uppercase hover:bg-charcoal-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>

            <p className="text-xs text-muted-foreground mt-4">
              {product.stock > 0 ? `${product.stock} in stock` : "Currently unavailable"}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
