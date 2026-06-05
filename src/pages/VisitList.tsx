import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Artwork, title, formatPrice, medium, formatSize } from "@/lib/artwork";
import { useLang } from "@/i18n/LanguageContext";
import { useVisitList } from "@/context/VisitListContext";
import { useSignedUrl } from "@/hooks/useSignedUrl";
import { X } from "lucide-react";

export default function VisitList() {
  const { lang, t } = useLang();
  const { ids, remove, count } = useVisitList();
  const [items, setItems] = useState<Artwork[]>([]);

  useEffect(() => {
    if (ids.length === 0) {
      setItems([]);
      return;
    }
    supabase.from("artworks").select("*").in("id", ids).then(({ data }) => setItems((data as Artwork[]) || []));
  }, [ids]);

  return (
    <div className="py-20 bg-background min-h-[60vh]">
      <div className="container mx-auto px-6 max-w-4xl">
        <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">{t("nav.visitList")}</p>
        <h1 className="font-serif text-4xl md:text-5xl mb-3">{t("pages.visitList.title")}</h1>
        <p className="text-muted-foreground mb-10">{t("pages.visitList.subtitle")}</p>

        {count === 0 ? (
          <div className="py-20 text-center">
            <p className="text-muted-foreground mb-6">{t("pages.visitList.empty")}</p>
            <Link to="/artworks" className="inline-block bg-charcoal text-cream px-8 py-3 text-xs tracking-[0.2em] uppercase hover:bg-charcoal-light">
              {t("cta.viewArtworks")}
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">{t("pages.visitList.count")}: {count}</p>
            <div className="space-y-4 mb-10">
              {items.map((a) => (
                <VisitRow key={a.id} artwork={a} onRemove={() => remove(a.id)} />
              ))}
            </div>
            <div className="text-center">
              <Link
                to="/private-viewing"
                className="inline-block bg-gold text-charcoal px-10 py-4 text-xs tracking-[0.2em] uppercase hover:bg-gold-light"
              >
                {t("cta.planViewing")}
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function VisitRow({ artwork, onRemove }: { artwork: Artwork; onRemove: () => void }) {
  const { lang, t } = useLang();
  const img = useSignedUrl(artwork.main_image);
  return (
    <div className="flex gap-4 bg-card border border-border p-3 items-center">
      <Link to={`/artworks/${artwork.slug}`} className="block w-20 h-24 bg-secondary flex-shrink-0">
        {img && <img src={img} alt={title(artwork, lang)} className="w-full h-full object-cover" />}
      </Link>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] tracking-[0.2em] uppercase text-gold">{t(`period.${artwork.period}`)}</p>
        <Link to={`/artworks/${artwork.slug}`} className="font-serif text-base hover:text-gold block">
          {title(artwork, lang)}
        </Link>
        <p className="text-xs text-muted-foreground">
          {[medium(artwork, lang), formatSize(artwork.width_cm, artwork.height_cm)].filter(Boolean).join(" · ")}
        </p>
        <p className="text-sm font-serif mt-1">{formatPrice(artwork.price_gel, lang)}</p>
      </div>
      <button onClick={onRemove} className="text-muted-foreground hover:text-destructive p-2" aria-label={t("cta.removeFromVisit")}>
        <X size={18} />
      </button>
    </div>
  );
}
