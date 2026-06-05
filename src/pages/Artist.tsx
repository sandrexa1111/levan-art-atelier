import { useLang } from "@/i18n/LanguageContext";
import artistPortrait from "@/assets/artist-portrait.jpg";
import heroPainting from "@/assets/hero-painting.png.asset.json";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Calendar, Sparkles, Globe2, Home, Award, Palette } from "lucide-react";

const FACTS = [
  { icon: Calendar, l: "factBirthL", v: "factBirthV" },
  { icon: Palette, l: "factSelfL", v: "factSelfV" },
  { icon: Sparkles, l: "factYearsL", v: "factYearsV" },
  { icon: Globe2, l: "factIntlL", v: "factIntlV" },
  { icon: Award, l: "factCollL", v: "factCollV" },
  { icon: Home, l: "factGalL", v: "factGalV" },
] as const;

const JOURNEY = [
  { key: "georgian", t: "jGeorgianT", d: "jGeorgianD" },
  { key: "french", t: "jFrenchT", d: "jFrenchD" },
  { key: "abstract", t: "jAbstractT", d: "jAbstractD" },
] as const;

const TIMELINE = [
  { year: "1971", key: "tl1971" },
  { year: "1993", key: "tl1993" },
  { year: "1996", key: "tl1996" },
  { year: "1998", key: "tl1998" },
  { year: "2008", key: "tl2008" },
  { year: "2010", key: "tl2010" },
  { year: "2011", key: "tl2011" },
  { year: "2019", key: "tl2019" },
  { year: "2023", key: "tl2023" },
  { year: "2025", key: "tl2025" },
  { year: "2026", key: "tl2026" },
] as const;

const COUNTRIES_KA = [
  "საქართველო", "საფრანგეთი", "რუსეთი", "ესტონეთი", "სირია", "თურქეთი",
  "ავსტრია", "სამხრეთ აფრიკა", "შვეიცარია", "აშშ", "დუბაი", "გერმანია",
  "იტალია", "იაპონია", "კანადა", "ავსტრალია", "ინგლისი", "ჩინეთი",
];
const COUNTRIES_EN = [
  "Georgia", "France", "Russia", "Estonia", "Syria", "Turkey",
  "Austria", "South Africa", "Switzerland", "United States", "Dubai", "Germany",
  "Italy", "Japan", "Canada", "Australia", "England", "China",
];

const grain =
  "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)";

export default function Artist() {
  const { t, lang } = useLang();
  const countries = lang === "ka" ? COUNTRIES_KA : COUNTRIES_EN;

  return (
    <div className="bg-background">
      {/* 1. Cinematic hero */}
      <section className="relative overflow-hidden bg-charcoal text-cream">
        <div
          className="absolute inset-0 opacity-25 bg-cover bg-center scale-110 blur-sm"
          style={{ backgroundImage: `url(${heroPainting.url})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal/85 to-[#1a0a0a]" />
        <div
          className="absolute inset-0 opacity-50 pointer-events-none"
          style={{ backgroundImage: grain, backgroundSize: "3px 3px" }}
        />

        <div className="relative container mx-auto px-6 py-24 md:py-32 max-w-6xl">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
              className="lg:col-span-5 relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-br from-gold/30 via-transparent to-gold/10 blur-2xl" />
              <div className="relative p-3 border border-gold/30 bg-charcoal/40 backdrop-blur-sm">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-gold -translate-x-1 -translate-y-1" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gold translate-x-1 translate-y-1" />
                <img
                  src={artistPortrait}
                  alt="Levan Mosiashvili"
                  className="w-full aspect-[3/4] object-cover grayscale-[10%]"
                />
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-[10px] tracking-[0.3em] uppercase text-cream/80">
                  <span>Mosiashvili</span>
                  <span className="text-gold">— 1971</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15 }}
              className="lg:col-span-7"
            >
              <p className="text-gold text-[11px] tracking-[0.35em] uppercase mb-6">
                {t("pages.artist.eyebrow")}
              </p>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-8">
                {t("pages.artist.title")}
              </h1>
              <div className="h-px w-24 bg-gold/60 mb-8" />
              <p className="text-cream/80 text-lg leading-relaxed mb-10 max-w-xl">
                {t("pages.artist.lead")}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/artworks"
                  className="inline-flex items-center justify-center gap-2 bg-gold text-charcoal px-8 py-3.5 text-xs tracking-[0.25em] uppercase hover:bg-cream transition-colors"
                >
                  {t("cta.viewArtworks")} <ArrowRight size={14} />
                </Link>
                <Link
                  to="/private-viewing"
                  className="inline-flex items-center justify-center gap-2 border border-cream/30 text-cream px-8 py-3.5 text-xs tracking-[0.25em] uppercase hover:border-gold hover:text-gold transition-colors"
                >
                  {t("cta.planViewing")}
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Facts */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <p className="text-gold text-[11px] tracking-[0.35em] uppercase mb-3">— 01</p>
              <h2 className="font-serif text-3xl md:text-4xl">{t("pages.artist.factsTitle")}</h2>
            </div>
            <div className="h-px flex-1 bg-border ml-8 hidden md:block" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            {FACTS.map(({ icon: Icon, l, v }, i) => (
              <motion.div
                key={l}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="bg-background p-8 group hover:bg-card transition-colors"
              >
                <Icon className="text-gold mb-5" size={22} strokeWidth={1.2} />
                <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2">
                  {t(`pages.artist.${l}`)}
                </p>
                <p className="font-serif text-xl leading-snug">{t(`pages.artist.${v}`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Biography text block */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6 max-w-3xl">
          <p className="text-gold text-[11px] tracking-[0.35em] uppercase mb-3 text-center">— 02</p>
          <h2 className="font-serif text-3xl md:text-4xl text-center mb-12">
            {lang === "ka" ? "ბიოგრაფია" : "Biography"}
          </h2>
          <div className="text-foreground/80 leading-[1.9] whitespace-pre-line text-[15px] md:text-base">
            {t("pages.artist.bio")}
          </div>
        </div>
      </section>

      {/* 3. Creative Journey */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-14">
            <p className="text-gold text-[11px] tracking-[0.35em] uppercase mb-3">— 03</p>
            <h2 className="font-serif text-3xl md:text-5xl">{t("pages.artist.journeyTitle")}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {JOURNEY.map((j, i) => (
              <motion.div
                key={j.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <Link
                  to={`/artworks?period=${j.key}`}
                  className="group relative block h-full p-8 md:p-10 bg-charcoal text-cream overflow-hidden hover:bg-[#1a1a1a] transition-colors"
                >
                  <div
                    className="absolute inset-0 opacity-[0.07] pointer-events-none"
                    style={{ backgroundImage: grain, backgroundSize: "3px 3px" }}
                  />
                  <p className="text-gold text-[10px] tracking-[0.35em] uppercase mb-6">
                    0{i + 1} — {j.key === "georgian" ? "GE" : j.key === "french" ? "FR" : "ABS"}
                  </p>
                  <h3 className="font-serif text-2xl md:text-3xl mb-5 leading-tight">
                    {t(`pages.artist.${j.t}`)}
                  </h3>
                  <div className="h-px w-12 bg-gold/50 mb-5" />
                  <p className="text-cream/70 leading-relaxed text-sm mb-8">
                    {t(`pages.artist.${j.d}`)}
                  </p>
                  <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-gold group-hover:gap-3 transition-all">
                    {t("pages.periods.explore")} <ArrowRight size={12} />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Timeline */}
      <section className="py-24 bg-charcoal text-cream relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{ backgroundImage: grain, backgroundSize: "3px 3px" }}
        />
        <div className="container mx-auto px-6 max-w-4xl relative">
          <div className="text-center mb-16">
            <p className="text-gold text-[11px] tracking-[0.35em] uppercase mb-3">— 04</p>
            <h2 className="font-serif text-3xl md:text-5xl">{t("pages.artist.timelineTitle")}</h2>
          </div>
          <div className="relative">
            <div className="absolute left-[68px] md:left-[88px] top-2 bottom-2 w-px bg-gradient-to-b from-gold/10 via-gold/40 to-gold/10" />
            <div className="space-y-8">
              {TIMELINE.map((m, i) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.04 }}
                  className="relative flex items-start gap-6 md:gap-10"
                >
                  <div className="font-serif text-2xl md:text-3xl text-gold w-14 md:w-20 shrink-0 text-right tabular-nums">
                    {m.year}
                  </div>
                  <div className="relative shrink-0 mt-3">
                    <div className="w-3 h-3 rounded-full bg-gold ring-4 ring-charcoal" />
                  </div>
                  <p className="text-cream/85 leading-relaxed pt-2 text-[15px]">
                    {t(`pages.artist.${m.key}`)}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. International */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-gold text-[11px] tracking-[0.35em] uppercase mb-3">— 05</p>
            <h2 className="font-serif text-3xl md:text-5xl mb-6">{t("pages.artist.intlTitle")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t("pages.artist.intlBody")}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mt-10">
            {countries.map((c, i) => (
              <motion.span
                key={c}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.02 }}
                className="px-4 py-2 border border-border bg-background text-sm hover:border-gold hover:text-gold transition-colors"
              >
                {c}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* 6. 130-year house */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid md:grid-cols-5 gap-12 items-center">
            <div className="md:col-span-3">
              <p className="text-gold text-[11px] tracking-[0.35em] uppercase mb-4">— 06</p>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-8 leading-tight">
                {t("pages.artist.houseTitle")}
              </h2>
              <div className="h-px w-16 bg-gold/60 mb-8" />
              <p className="text-foreground/80 leading-relaxed mb-8 text-base md:text-lg">
                {t("pages.artist.houseBody")}
              </p>
              <div className="flex items-center gap-2 text-muted-foreground mb-8 text-sm">
                <MapPin size={16} className="text-gold" /> {t("footer.address")}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/private-viewing"
                  className="inline-flex items-center justify-center gap-2 bg-charcoal text-cream px-7 py-3 text-xs tracking-[0.25em] uppercase hover:bg-gold hover:text-charcoal transition-colors"
                >
                  {t("cta.planViewing")} <ArrowRight size={14} />
                </Link>
                <Link
                  to="/visit-list"
                  className="inline-flex items-center justify-center gap-2 border border-foreground/20 px-7 py-3 text-xs tracking-[0.25em] uppercase hover:border-gold hover:text-gold transition-colors"
                >
                  {t("nav.visitList")}
                </Link>
              </div>
            </div>
            <div className="md:col-span-2 relative">
              <div className="aspect-[4/5] bg-gradient-to-br from-[#2a1a14] via-charcoal to-[#1a0a0a] relative overflow-hidden border border-gold/20">
                <div
                  className="absolute inset-0 opacity-30 bg-cover bg-center"
                  style={{ backgroundImage: `url(${heroPainting.url})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-cream">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-gold mb-2">Est.</p>
                  <p className="font-serif text-5xl">130</p>
                  <p className="text-cream/70 text-xs tracking-[0.2em] uppercase mt-1">
                    {lang === "ka" ? "წლის სახლი" : "year-old house"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Final CTA */}
      <section className="py-28 bg-charcoal text-cream relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroPainting.url})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/95 via-charcoal/90 to-charcoal" />
        <div className="container mx-auto px-6 max-w-3xl text-center relative">
          <p className="text-gold text-[11px] tracking-[0.35em] uppercase mb-4">{t("footer.byAppointment")}</p>
          <h2 className="font-serif text-3xl md:text-5xl mb-8 leading-tight">
            {t("pages.artist.finalTitle")}
          </h2>
          <p className="text-cream/75 leading-relaxed mb-10 max-w-xl mx-auto">
            {t("pages.artist.finalBody")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/private-viewing"
              className="inline-flex items-center justify-center gap-2 bg-gold text-charcoal px-8 py-3.5 text-xs tracking-[0.25em] uppercase hover:bg-cream transition-colors"
            >
              {t("cta.planViewing")} <ArrowRight size={14} />
            </Link>
            <Link
              to="/artworks"
              className="inline-flex items-center justify-center gap-2 border border-cream/40 text-cream px-8 py-3.5 text-xs tracking-[0.25em] uppercase hover:border-gold hover:text-gold transition-colors"
            >
              {t("cta.viewArtworks")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
