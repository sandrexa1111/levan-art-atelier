import { Link } from "react-router-dom";
import type { Artwork } from "@/data/artworks";

export default function ArtworkCard({ artwork }: { artwork: Artwork }) {
  return (
    <Link to={`/gallery/${artwork.id}`} className="group block">
      <div className="relative overflow-hidden bg-secondary">
        <img
          src={artwork.images[0]}
          alt={artwork.title}
          loading="lazy"
          className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {artwork.isSold && (
          <div className="absolute top-4 right-4 bg-charcoal text-cream text-xs tracking-wider uppercase px-3 py-1">
            Sold
          </div>
        )}
      </div>
      <div className="mt-4 space-y-1">
        <h3 className="font-serif text-lg group-hover:text-gold transition-colors">{artwork.title}</h3>
        <p className="text-sm text-muted-foreground">{artwork.medium}, {artwork.year}</p>
        <p className="text-sm text-muted-foreground">{artwork.dimensions}</p>
      </div>
    </Link>
  );
}
