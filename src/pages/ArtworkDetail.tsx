import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Bookmark, BookmarkCheck, MapPin, ZoomIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Artwork, formatPrice, formatSize, medium, title, description, story, whyInPerson } from "@/lib/artwork";
import { useLang } from "@/i18n/LanguageContext";
import { useVisitList } from "@/context/VisitListContext";
import { useSignedUrl } from "@/hooks/useSignedUrl";
import TbcRequestDialog from "@/components/TbcRequestDialog";

export default function ArtworkDetail() {
  const { slug } = useParams();
  const { lang, t } = useLang();
  const { has, toggle } = useVisitList();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [zoom, setZoom] = useState(false);
  const [tbcOpen, setTbcOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from("artworks")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle()
      .then(({ data }) => setArtwork(data as Artwork | null));
  }, [slug]);

  const mainUrl = useSignedUrl(artwork?.main_image);

  if (!artwork) {
    return (
      <div className="py-32 text-center">
        <p className="text-muted-foreground">…</p>
      </div>
    );
  }

  const inList = has(artwork.id);

  return (
    <div className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <Link to="/artworks" className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft size={14} /> {t("cta.backToArtworks")}
        </Link>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          <div
            className="relative group cursor-zoom-in w-full flex items-center justify-center bg-[#eee9df] border border-black/5 p-[clamp(8px,1.5vw,18px)]"
            onClick={() => setZoom(true)}
          >
            {mainUrl && (
              <img
                src={mainUrl}
                alt={title(artwork, lang)}
                className="block w-full h-auto max-h-[78vh] object-contain"
                loading="lazy"
              />
            )}
            <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/15 transition-colors flex items-center justify-center pointer-events-none">
              <ZoomIn className="text-cream opacity-0 group-hover:opacity-100 transition-opacity" size={32} />
            </div>
            {artwork.status !== "available" && (
              <div className="absolute top-4 right-4 bg-charcoal text-cream text-[10px] tracking-widest uppercase px-3 py-1.5">
                {t(`status.${artwork.status}`)}
              </div>
            )}
          </div>

          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-2">{t(`period.${artwork.period}`)}</p>
            <h1 className="font-serif text-3xl md:text-4xl mb-4">{title(artwork, lang)}</h1>

            {description(artwork, lang) && (
              <p className="text-muted-foreground leading-relaxed mb-6">{description(artwork, lang)}</p>
            )}
            {story(artwork, lang) && (
              <div className="mb-6">
                <p className="text-xs tracking-widest uppercase text-gold mb-2">{t("fields.story")}</p>
                <p className="text-muted-foreground leading-relaxed">{story(artwork, lang)}</p>
              </div>
            )}

            <dl className="space-y-2.5 mb-8 text-sm border-y border-border py-5">
              {medium(artwork, lang) && <Row label={t("fields.medium")} value={medium(artwork, lang)} />}
              {(artwork.width_cm && artwork.height_cm) && (
                <Row label={t("fields.size")} value={formatSize(artwork.width_cm, artwork.height_cm)} />
              )}
              {artwork.year && <Row label={t("fields.year")} value={String(artwork.year)} />}
              {artwork.subcategory && <Row label="—" value={artwork.subcategory} />}
              <Row label={t("fields.status")} value={t(`status.${artwork.status}`)} />
              <Row label={t("fields.price")} value={<span className="font-serif text-lg">{formatPrice(artwork.price_gel, lang)}</span>} />
            </dl>

            {whyInPerson(artwork, lang) && (
              <div className="bg-secondary p-5 mb-6">
                <p className="text-xs tracking-widest uppercase text-gold mb-2">{t("fields.whyInPerson")}</p>
                <p className="text-sm leading-relaxed">{whyInPerson(artwork, lang)}</p>
              </div>
            )}

            {artwork.room_types.length > 0 && (
              <div className="mb-8">
                <p className="text-xs tracking-widest uppercase text-muted-foreground mb-2">{t("fields.placement")}</p>
                <div className="flex flex-wrap gap-2">
                  {artwork.room_types.map((r) => (
                    <span key={r} className="text-xs px-3 py-1 border border-border">
                      {t(`rooms.${r}`)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs leading-relaxed text-muted-foreground border-l-2 border-gold pl-3 mb-5">
              {t("pages.artworkDetail.visitNote")}
            </p>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => toggle(artwork.id)}
                className={`w-full py-3.5 text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-colors ${
                  inList ? "bg-gold text-charcoal" : "bg-charcoal text-cream hover:bg-charcoal-light"
                }`}
              >
                {inList ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                {inList ? t("cta.inVisitList") : t("cta.addToVisit")}
              </button>
              <Link
                to="/private-viewing"
                className="w-full py-3.5 text-xs tracking-[0.2em] uppercase border border-foreground hover:bg-secondary transition-colors text-center"
              >
                {t("cta.requestViewing")}
              </Link>
              <button
                onClick={() => setTbcOpen(true)}
                className="w-full py-3.5 text-xs tracking-[0.2em] uppercase border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
              >
                {t("cta.requestTbc")}
              </button>
            </div>

            <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin size={14} className="text-gold" /> {t("footer.address")}
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {zoom && mainUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-charcoal/95 flex items-center justify-center cursor-zoom-out p-4"
            onClick={() => setZoom(false)}
          >
            <motion.img
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              src={mainUrl}
              alt={title(artwork, lang)}
              className="max-w-full max-h-full object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <TbcRequestDialog open={tbcOpen} onOpenChange={setTbcOpen} artwork={artwork} />
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right">{value}</dd>
    </div>
  );
}
