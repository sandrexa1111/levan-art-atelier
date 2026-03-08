import { Link } from "react-router-dom";
import type { Product } from "@/data/products";
import { productTypeLabels } from "@/data/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/shop/${product.id}`} className="group block">
      <div className="relative overflow-hidden bg-secondary">
        <img
          src={product.images[0]}
          alt={product.title}
          loading="lazy"
          className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 bg-charcoal/80 text-cream text-xs tracking-wider uppercase px-3 py-1">
          {productTypeLabels[product.type]}
        </div>
        {product.stock < 10 && product.stock > 0 && (
          <div className="absolute top-4 right-4 bg-gold text-charcoal text-xs tracking-wider px-3 py-1">
            Only {product.stock} left
          </div>
        )}
      </div>
      <div className="mt-4 space-y-1">
        <h3 className="font-serif text-lg group-hover:text-gold transition-colors">{product.title}</h3>
        <p className="text-sm text-muted-foreground">From €{product.price}</p>
      </div>
    </Link>
  );
}
