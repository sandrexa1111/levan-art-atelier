import { motion } from "framer-motion";
import { products, productTypeLabels, ProductType } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { useState } from "react";
import { fadeUp } from "@/lib/animations";

const types: (ProductType | "all")[] = ["all", "print", "tshirt", "mug", "poster", "limited-edition"];

export default function Shop() {
  const [filter, setFilter] = useState<ProductType | "all">("all");
  const filtered = filter === "all" ? products : products.filter((p) => p.type === filter);

  return (
    <div className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">Shop</p>
          <h1 className="font-serif text-4xl md:text-5xl">Art & Merchandise</h1>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`text-xs tracking-wider uppercase px-4 py-2 border transition-colors ${
                filter === type ? "bg-charcoal text-cream border-charcoal" : "border-border hover:border-foreground"
              }`}
            >
              {type === "all" ? "All" : productTypeLabels[type]}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filtered.map((product, i) => (
            <motion.div key={product.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
