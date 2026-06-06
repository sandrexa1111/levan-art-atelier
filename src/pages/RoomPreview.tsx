import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Bookmark, BookmarkCheck, Upload, RotateCcw, MoveDiagonal, Layers } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Artwork, formatPrice, formatSize, title, medium } from "@/lib/artwork";
import { useLang } from "@/i18n/LanguageContext";
import { useVisitList } from "@/context/VisitListContext";
import { useSignedUrl } from "@/hooks/useSignedUrl";
import { ROOM_TEMPLATES, RoomKey, SIZE_SCALE } from "@/lib/roomTemplates";
import { toast } from "sonner";

type SizeKey = "small" | "medium" | "large";

const MAX_UPLOAD_MB = 8;

export default function RoomPreview() {
  const { slug } = useParams();
  const { lang, t } = useLang();
  const { has, toggle, count } = useVisitList();

  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [roomKey, setRoomKey] = useState<RoomKey>("living");
  const [customRoom, setCustomRoom] = useState<string | null>(null);
  const [size, setSize] = useState<SizeKey>("medium");
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [aiMessage, setAiMessage] = useState<string | null>(null);

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

  // mark intent for CRM context on visit request
  useEffect(() => {
    if (artwork) {
      try {
        localStorage.setItem(
          "room_preview_intent",
          JSON.stringify({
            artwork_id: artwork.id,
            artwork_title: artwork.title_en,
            template: customRoom ? "custom_upload" : roomKey,
            size_preference: size,
            used_custom_upload: !!customRoom,
            at: new Date().toISOString(),
          })
        );
      } catch {}
    }
  }, [artwork, roomKey, customRoom, size]);

  const artUrl = useSignedUrl(artwork?.main_image);
  const template = ROOM_TEMPLATES.find((r) => r.key === roomKey)!;
  const roomBg = customRoom ?? template.url;

  // Aspect ratio for the artwork (h / w)
  const aspect = useMemo(() => {
    if (artwork?.width_cm && artwork?.height_cm) return artwork.height_cm / artwork.width_cm;
    return 1.25;
  }, [artwork]);

  const widthPct = template.mediumWidthPct * SIZE_SCALE[size];
  const cx = customRoom ? 50 + offset.x : template.centerXPct + offset.x;
  const cy = customRoom ? 40 + offset.y : template.centerYPct + offset.y;

  const onUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error(t("pages.roomPreview.errImageOnly"));
      return;
    }
    if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
      toast.error(t("pages.roomPreview.errSize"));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setCustomRoom(reader.result as string);
    reader.readAsDataURL(file);
  };

  const reset = () => {
    setOffset({ x: 0, y: 0 });
    setSize("medium");
  };

  if (!artwork) {
    return <div className="py-32 text-center text-muted-foreground">…</div>;
  }

  const inList = has(artwork.id);

  return (
    <div className="py-20 bg-background min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        <Link
          to={`/artworks/${artwork.slug}`}
          className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft size={14} /> {t("cta.backToArtworks")}
        </Link>

        <div className="mb-10">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">{t("pages.roomPreview.eyebrow")}</p>
          <h1 className="font-serif text-3xl md:text-5xl mb-3">{t("pages.roomPreview.title")}</h1>
          <p className="text-muted-foreground max-w-2xl">{t("pages.roomPreview.subtitle")}</p>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-10">
          {/* Artwork summary */}
          <aside className="space-y-4">
            <div className="aspect-[4/5] bg-secondary overflow-hidden">
              {artUrl && <img src={artUrl} alt={title(artwork, lang)} className="w-full h-full object-cover" />}
            </div>
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-gold">{t(`period.${artwork.period}`)}</p>
              <h2 className="font-serif text-xl">{title(artwork, lang)}</h2>
              <p className="text-xs text-muted-foreground mt-1">
                {[medium(artwork, lang), formatSize(artwork.width_cm, artwork.height_cm), artwork.year]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              <p className="font-serif text-base mt-2">{formatPrice(artwork.price_gel, lang)}</p>
              <p className="text-[11px] tracking-widest uppercase text-muted-foreground mt-1">
                {t(`status.${artwork.status}`)}
              </p>
            </div>
            <button
              onClick={() => toggle(artwork.id)}
              className={`w-full py-3 text-[11px] tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-colors ${
                inList ? "bg-gold text-charcoal" : "bg-charcoal text-cream hover:bg-charcoal-light"
              }`}
            >
              {inList ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
              {inList ? t("cta.inVisitList") : t("cta.addToVisit")}
            </button>
            {count >= 2 && (
              <Link
                to="/room-compare"
                className="w-full py-3 text-[11px] tracking-[0.2em] uppercase border border-foreground/40 flex items-center justify-center gap-2 hover:border-gold hover:text-gold transition-colors"
              >
                <Layers size={14} /> {t("pages.roomPreview.compareCta")}
              </Link>
            )}
          </aside>

          {/* Right: room + controls */}
          <div className="space-y-6">
            {/* Preview area */}
            <div className="relative w-full overflow-hidden bg-secondary border border-border" style={{ aspectRatio: "16/9" }}>
              <img src={roomBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
              {artUrl && (
                <div
                  className="absolute"
                  style={{
                    width: `${widthPct}%`,
                    left: `${cx}%`,
                    top: `${cy}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div
                    className="bg-[#1a1410] p-[3%] shadow-[0_18px_40px_-12px_rgba(0,0,0,0.55)]"
                    style={{ aspectRatio: `${1} / ${aspect}` }}
                  >
                    <img src={artUrl} alt={title(artwork, lang)} className="w-full h-full object-contain bg-[#eee9df]" />
                  </div>
                </div>
              )}
            </div>

            <p className="text-[11px] text-muted-foreground italic flex items-start gap-2">
              <MoveDiagonal size={12} className="mt-[2px] text-gold flex-shrink-0" />
              {t("pages.roomPreview.disclaimer")}
            </p>

            {/* Template selector */}
            <div>
              <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">
                {t("pages.roomPreview.chooseRoom")}
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {ROOM_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.key}
                    onClick={() => {
                      setCustomRoom(null);
                      setRoomKey(tmpl.key);
                      setOffset({ x: 0, y: 0 });
                    }}
                    className={`relative aspect-square overflow-hidden border transition-colors ${
                      !customRoom && roomKey === tmpl.key
                        ? "border-gold ring-1 ring-gold"
                        : "border-border hover:border-foreground"
                    }`}
                    title={t(`pages.roomPreview.rooms.${tmpl.key}`)}
                  >
                    <img src={tmpl.url} alt="" className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 inset-x-0 bg-charcoal/70 text-cream text-[9px] tracking-wider uppercase py-1 text-center">
                      {t(`pages.roomPreview.rooms.${tmpl.key}`)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Upload */}
            <div className="border border-dashed border-border p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <label className="inline-flex items-center justify-center gap-2 cursor-pointer bg-secondary hover:bg-muted px-4 py-2.5 text-[11px] tracking-[0.2em] uppercase">
                <Upload size={14} />
                {t("pages.roomPreview.uploadCta")}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onUpload(f);
                  }}
                />
              </label>
              <p className="text-[11px] text-muted-foreground flex-1">{t("pages.roomPreview.uploadNote")}</p>
              {customRoom && (
                <button onClick={() => setCustomRoom(null)} className="text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground">
                  {t("pages.roomPreview.useTemplate")}
                </button>
              )}
            </div>

            {/* Controls */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-2">
                  {t("pages.roomPreview.wallSize")}
                </p>
                <div className="flex gap-2">
                  {(["small", "medium", "large"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`flex-1 py-2 text-[11px] uppercase tracking-widest border ${
                        size === s ? "bg-charcoal text-cream border-charcoal" : "border-border hover:border-foreground"
                      }`}
                    >
                      {t(`pages.roomPreview.size.${s}`)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-2">
                  {t("pages.roomPreview.position")}
                </p>
                <div className="grid grid-cols-4 gap-2">
                  <button onClick={() => setOffset((o) => ({ ...o, x: o.x - 3 }))} className="py-2 border border-border hover:border-foreground text-sm">←</button>
                  <button onClick={() => setOffset((o) => ({ ...o, y: o.y - 3 }))} className="py-2 border border-border hover:border-foreground text-sm">↑</button>
                  <button onClick={() => setOffset((o) => ({ ...o, y: o.y + 3 }))} className="py-2 border border-border hover:border-foreground text-sm">↓</button>
                  <button onClick={() => setOffset((o) => ({ ...o, x: o.x + 3 }))} className="py-2 border border-border hover:border-foreground text-sm">→</button>
                </div>
                <button onClick={reset} className="mt-2 inline-flex items-center gap-1 text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground">
                  <RotateCcw size={12} /> {t("pages.roomPreview.reset")}
                </button>
              </div>
            </div>

            {/* AI placeholder */}
            <div className="border border-border p-5 bg-secondary/50">
              <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
                <div>
                  <p className="text-[10px] tracking-[0.25em] uppercase text-gold mb-2">
                    {t("pages.roomPreview.aiTitle")}
                  </p>
                  <p className="text-sm text-muted-foreground max-w-md">
                    {aiMessage ?? t("pages.roomPreview.aiSoon")}
                  </p>
                </div>
                <button
                  onClick={() => setAiMessage(t("pages.roomPreview.aiSoon"))}
                  className="text-[11px] tracking-[0.2em] uppercase border border-foreground/40 px-4 py-2.5 hover:border-gold hover:text-gold"
                >
                  {t("pages.roomPreview.aiCta")}
                </button>
              </div>
            </div>

            {/* Report */}
            <InteriorReport artwork={artwork} roomKey={customRoom ? null : roomKey} />

            {/* Final CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link
                to="/private-viewing"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-gold text-charcoal px-6 py-3.5 text-xs tracking-[0.2em] uppercase hover:bg-gold-light"
              >
                {t("cta.planViewing")} <ArrowRight size={14} />
              </Link>
              <Link
                to="/visit-list"
                className="flex-1 inline-flex items-center justify-center gap-2 border border-foreground/60 px-6 py-3.5 text-xs tracking-[0.2em] uppercase hover:border-gold hover:text-gold"
              >
                {t("nav.visitList")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InteriorReport({ artwork, roomKey }: { artwork: Artwork; roomKey: RoomKey | null }) {
  const { t, lang } = useLang();

  const placement = t(`pages.roomPreview.report.placement.${artwork.period}`);
  const suited = t(`pages.roomPreview.report.suited.${artwork.period}`);
  const mood = t(`pages.roomPreview.report.mood.${artwork.period}`);
  const whyKey = artwork.why_see_in_person_ka || artwork.why_see_in_person_en
    ? (lang === "ka" ? artwork.why_see_in_person_ka : artwork.why_see_in_person_en)
    : t(`pages.roomPreview.report.why.${artwork.period}`);

  const rows = [
    { label: t("pages.roomPreview.report.placementL"), value: placement },
    { label: t("pages.roomPreview.report.suitedL"), value: suited },
    { label: t("pages.roomPreview.report.moodL"), value: mood },
    { label: t("pages.roomPreview.report.whyL"), value: whyKey },
  ];

  return (
    <div className="border-t border-border pt-8">
      <p className="text-gold text-[10px] tracking-[0.3em] uppercase mb-2">{t("pages.roomPreview.report.eyebrow")}</p>
      <h3 className="font-serif text-2xl mb-5">{t("pages.roomPreview.report.title")}</h3>
      <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
        {rows.map((r) => (
          <div key={r.label}>
            <dt className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1">{r.label}</dt>
            <dd className="text-sm leading-relaxed">{r.value}</dd>
          </div>
        ))}
      </dl>
      <p className="text-[11px] italic text-muted-foreground mt-6">{t("pages.roomPreview.report.disclaimer")}</p>
    </div>
  );
}
