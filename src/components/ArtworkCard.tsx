import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { Artwork, formatPrice, formatSize, medium, title } from "@/lib/artwork";
import { useLang } from "@/i18n/LanguageContext";
import { useVisitList } from "@/context/VisitListContext";
import { useSignedUrl } from "@/hooks/useSignedUrl";

export default function ArtworkCard({ artwork }: { artwork: Artwork }) {
  const { lang, t } = useLang();
  const { has, toggle } = useVisitList();
  const img = useSignedUrl(artwork.main_image);
  const inList = has(artwork.id);

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col bg-card"
    >
      <Link to={`/artworks/${artwork.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-secondary">
        {img ? (
          <img
            src={img}
            alt={title(artwork, lang)}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full" />
        )}
        {artwork.status !== "available" && (
          <span className="absolute top-3 right-3 bg-charcoal text-cream text-[10px] tracking-widest uppercase px-2.5 py-1">
            {t(`status.${artwork.status}`)}
          </span>
        )}
      </Link>
      <div className="p-4 flex flex-col gap-1">
        <p className="text-[10px] tracking-[0.2em] uppercase text-gold">{t(`period.${artwork.period}`)}</p>
        <Link to={`/artworks/${artwork.slug}`} className="font-serif text-lg leading-snug hover:text-gold transition-colors">
          {title(artwork, lang)}
        </Link>
        <p className="text-xs text-muted-foreground">
          {[medium(artwork, lang), formatSize(artwork.width_cm, artwork.height_cm), artwork.year]
            .filter(Boolean)
            .join(" · ")}
        </p>
        <div className="flex items-center justify-between mt-3">
          <span className="font-serif text-base">{formatPrice(artwork.price_gel, lang)}</span>
          <button
            onClick={(e) => {
              e.preventDefault();
              toggle(artwork.id);
            }}
            className="flex items-center gap-1.5 text-[11px] tracking-widest uppercase text-foreground/80 hover:text-gold transition-colors"
            aria-label={t("cta.addToVisit")}
          >
            {inList ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
            {inList ? t("cta.inVisitList") : t("cta.addToVisit")}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
