import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Artwork, formatPrice, formatSize, title } from "@/lib/artwork";
import { useLang } from "@/i18n/LanguageContext";
import { useVisitList } from "@/context/VisitListContext";
import { useSignedUrl } from "@/hooks/useSignedUrl";
import { ROOM_TEMPLATES, RoomKey } from "@/lib/roomTemplates";

const MAX = 3;

export default function RoomCompare() {
  const { lang, t } = useLang();
  const { ids, remove } = useVisitList();
  const [items, setItems] = useState<Artwork[]>([]);
  const [roomKey, setRoomKey] = useState<RoomKey>("gallery");

  useEffect(() => {
    if (!ids.length) {
      setItems([]);
      return;
    }
    supabase.from("artworks").select("*").in("id", ids).then(({ data }) => {
      setItems(((data as Artwork[]) || []).slice(0, MAX));
    });
  }, [ids]);

  const template = ROOM_TEMPLATES.find((r) => r.key === roomKey)!;

  return (
    <div className="py-20 bg-background min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        <Link to="/visit-list" className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft size={14} /> {t("nav.visitList")}
        </Link>

        <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">{t("pages.roomCompare.eyebrow")}</p>
        <h1 className="font-serif text-3xl md:text-5xl mb-3">{t("pages.roomCompare.title")}</h1>
        <p className="text-muted-foreground max-w-2xl mb-8">{t("pages.roomCompare.subtitle")}</p>

        {items.length < 2 ? (
          <div className="py-16 text-center border border-dashed border-border">
            <p className="text-muted-foreground mb-4">{t("pages.roomCompare.empty")}</p>
            <Link to="/artworks" className="inline-flex items-center gap-2 text-xs tracking-widest uppercase hover:text-gold">
              {t("cta.viewArtworks")} <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <>
            {/* Room selector */}
            <div className="mb-6">
              <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-2">
                {t("pages.roomPreview.chooseRoom")}
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {ROOM_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.key}
                    onClick={() => setRoomKey(tmpl.key)}
                    className={`relative aspect-square overflow-hidden border ${
                      roomKey === tmpl.key ? "border-gold ring-1 ring-gold" : "border-border"
                    }`}
                  >
                    <img src={tmpl.url} alt="" className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 inset-x-0 bg-charcoal/70 text-cream text-[9px] tracking-wider uppercase py-1 text-center">
                      {t(`pages.roomPreview.rooms.${tmpl.key}`)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Side-by-side rooms */}
            <div className={`grid gap-4 ${items.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
              {items.map((a) => (
                <CompareCard key={a.id} artwork={a} roomUrl={template.url} onRemove={() => remove(a.id)} />
              ))}
            </div>

            <p className="text-[11px] italic text-muted-foreground mt-6">{t("pages.roomPreview.disclaimer")}</p>

            <div className="mt-10 text-center">
              <Link
                to="/private-viewing"
                className="inline-flex items-center gap-2 bg-gold text-charcoal px-8 py-3.5 text-xs tracking-[0.2em] uppercase hover:bg-gold-light"
              >
                {t("cta.planViewing")} <ArrowRight size={14} />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function CompareCard({ artwork, roomUrl, onRemove }: { artwork: Artwork; roomUrl: string; onRemove: () => void }) {
  const { lang, t } = useLang();
  const artUrl = useSignedUrl(artwork.main_image);
  const aspect = artwork.width_cm && artwork.height_cm ? artwork.height_cm / artwork.width_cm : 1.25;

  return (
    <div className="bg-card border border-border">
      <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
        <img src={roomUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
        {artUrl && (
          <div
            className="absolute"
            style={{ width: "38%", left: "50%", top: "42%", transform: "translate(-50%, -50%)" }}
          >
            <div className="bg-[#1a1410] p-[3%] shadow-[0_14px_30px_-12px_rgba(0,0,0,0.55)]" style={{ aspectRatio: `1 / ${aspect}` }}>
              <img src={artUrl} alt={title(artwork, lang)} className="w-full h-full object-contain bg-[#eee9df]" />
            </div>
          </div>
        )}
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 bg-charcoal/70 text-cream p-1.5 hover:bg-charcoal"
          aria-label={t("cta.removeFromVisit")}
        >
          <X size={14} />
        </button>
      </div>
      <div className="p-4">
        <p className="text-[10px] tracking-[0.2em] uppercase text-gold">{t(`period.${artwork.period}`)}</p>
        <Link to={`/artworks/${artwork.slug}`} className="font-serif text-base hover:text-gold">{title(artwork, lang)}</Link>
        <p className="text-xs text-muted-foreground mt-1">{formatSize(artwork.width_cm, artwork.height_cm)}</p>
        <p className="text-sm font-serif mt-1">{formatPrice(artwork.price_gel, lang)}</p>
        <p className="text-[10px] tracking-widest uppercase text-muted-foreground mt-1">{t(`status.${artwork.status}`)}</p>
      </div>
    </div>
  );
}
