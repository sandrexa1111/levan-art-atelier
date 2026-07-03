import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/i18n/LanguageContext";
import { Artwork } from "@/lib/artwork";
import ArtworkCard from "@/components/ArtworkCard";
import { fadeUp, fadeUpSimple } from "@/lib/animations";
import artistPortrait from "@/assets/artist-portrait.jpg";
import heroPainting from "@/assets/hero-painting.png.asset.json";
import roomTeaserBg from "@/assets/rooms/room-living.jpg.asset.json";

type PeriodKey = "georgian" | "french" | "abstract";

function PeriodCard({ period }: { period: PeriodKey }) {
  const { t } = useLang();
  const [path, setPath] = useState<string | null>(null);
  useEffect(() => {
    (supabase.from("period_settings" as any) as any)
      .select("image_path")
      .eq("period", period)
      .maybeSingle()
      .then(({ data }: any) => setPath(data?.image_path ?? null));
  }, [period]);
  const url = useSignedUrl(path);
  return (
    <Link
      to={`/artworks?period=${period}`}
      className="group block bg-card border border-border hover:border-gold transition-colors overflow-hidden"
    >
      <div className="p-6 pb-4 text-center">
        <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2 group-hover:text-gold transition-colors">
          {period}
        </p>
        <h3 className="font-serif text-xl">{t(`period.${period}`)}</h3>
      </div>
      <div className="aspect-[4/5] bg-secondary overflow-hidden border-t border-border">
        {url ? (
          <img
            src={url}
            alt={t(`period.${period}`)}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full" />
        )}
      </div>
      <div className="p-5 text-center">
        <span className="inline-flex items-center gap-1 text-[11px] tracking-widest uppercase text-foreground/70 group-hover:text-gold transition-colors">
          {t("pages.periods.explore")} <ArrowRight size={12} />
        </span>
      </div>
    </Link>
  );
}

export default function Index() {
  const { t } = useLang();
  const [featured, setFeatured] = useState<Artwork[]>([]);

  useEffect(() => {
    supabase
      .from("artworks")
      .select("*")
      .eq("is_published", true)
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(4)
      .then(({ data }) => setFeatured((data as Artwork[]) || []));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-charcoal">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${heroPainting.url})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/85 via-charcoal/60 to-charcoal/90" />
        <div className="absolute inset-0 bg-charcoal/30" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative text-center px-6 max-w-3xl"
        >
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-cream leading-tight mb-6 drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)]">
            {t("pages.home.heroTitle")}
          </h1>
          <p className="text-cream/80 text-base md:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            {t("pages.home.heroSubtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/artworks"
              className="inline-flex items-center justify-center gap-2 bg-cream text-charcoal px-8 py-3.5 text-xs tracking-[0.2em] uppercase hover:bg-gold transition-colors duration-300"
            >
              {t("cta.viewArtworks")} <ArrowRight size={14} />
            </Link>
            <Link
              to="/private-viewing"
              className="inline-flex items-center justify-center gap-2 border border-cream/40 text-cream px-8 py-3.5 text-xs tracking-[0.2em] uppercase hover:border-gold hover:text-gold transition-colors duration-300 backdrop-blur-sm bg-charcoal/20"
            >
              {t("cta.planViewing")}
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="text-center mb-14">
              <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">{t("nav.artworks")}</p>
              <h2 className="font-serif text-3xl md:text-4xl">{t("pages.home.featured")}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featured.map((a, i) => (
                <motion.div key={a.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                  <ArtworkCard artwork={a} />
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link to="/artworks" className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase hover:text-gold transition-colors">
                {t("cta.viewArtworks")} <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Periods preview */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">{t("nav.periods")}</p>
            <h2 className="font-serif text-3xl md:text-4xl">{t("pages.home.periodsTitle")}</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {(["georgian", "french", "abstract"] as const).map((p) => (
              <PeriodCard key={p} period={p} />
            ))}
          </div>
        </div>
      </section>


      {/* Room Preview teaser */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid md:grid-cols-[1.1fr_1fr] gap-10 items-center border border-border bg-card p-6 md:p-10">
            <div>
              <p className="text-gold text-[10px] tracking-[0.3em] uppercase mb-3">{t("pages.homeRoomTeaser.eyebrow")}</p>
              <h2 className="font-serif text-2xl md:text-3xl mb-4">{t("pages.homeRoomTeaser.title")}</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">{t("pages.homeRoomTeaser.body")}</p>
              <Link
                to="/artworks"
                className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase border border-foreground/60 px-5 py-3 hover:border-gold hover:text-gold transition-colors"
              >
                {t("pages.homeRoomTeaser.cta")} <ArrowRight size={14} />
              </Link>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${roomTeaserBg.url})` }}
              />
              <div className="absolute inset-0 bg-charcoal/10" />
            </div>
          </div>
        </div>
      </section>

      {/* Artist preview */}
      <section className="py-24 bg-background">

        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpSimple}>
              <img src={artistPortrait} alt="Levan Mosiashvili" className="w-full aspect-[3/4] object-cover" />
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
              <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">{t("nav.artist")}</p>
              <h2 className="font-serif text-3xl md:text-4xl mb-6">{t("pages.home.artistPreview")}</h2>
              <p className="text-muted-foreground leading-relaxed mb-6 line-clamp-6">
                {t("pages.artist.bio")}
              </p>
              <Link to="/artist" className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase hover:text-gold transition-colors">
                {t("pages.home.readMore")} <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Private Visit */}
      <section className="py-24 bg-charcoal text-cream">
        <div className="container mx-auto px-6 max-w-2xl text-center">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">{t("pages.home.viewingTitle")}</p>
          <h2 className="font-serif text-3xl md:text-4xl mb-6">{t("cta.planViewing")}</h2>
          <p className="text-cream/70 leading-relaxed mb-8">{t("pages.home.viewingBody")}</p>
          <div className="inline-flex items-center gap-2 text-cream/60 mb-8 text-sm">
            <MapPin size={16} className="text-gold" /> {t("footer.address")}
          </div>
          <div>
            <Link
              to="/private-viewing"
              className="inline-flex items-center gap-2 bg-gold text-charcoal px-8 py-3.5 text-xs tracking-[0.2em] uppercase hover:bg-gold-light transition-colors"
            >
              {t("cta.planViewing")} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 max-w-2xl text-center">
          <h2 className="font-serif text-3xl md:text-4xl mb-5">{t("pages.home.finalTitle")}</h2>
          <p className="text-muted-foreground leading-relaxed mb-8">{t("pages.home.finalBody")}</p>
          <Link
            to="/visit-list"
            className="inline-flex items-center gap-2 bg-charcoal text-cream px-8 py-3.5 text-xs tracking-[0.2em] uppercase hover:bg-charcoal-light transition-colors"
          >
            {t("nav.visitList")} <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
