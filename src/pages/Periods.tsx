import { Link } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";
import { ArrowRight } from "lucide-react";

export default function Periods() {
  const { t } = useLang();
  const periods: { key: "georgian" | "french" | "abstract"; desc_ka: string; desc_en: string }[] = [
    {
      key: "georgian",
      desc_ka: "ნამუშევრები, რომლებიც ღრმად ეფუძნება ქართულ ფესვებსა და კულტურულ მეხსიერებას.",
      desc_en: "Works rooted in Georgian heritage and cultural memory.",
    },
    {
      key: "french",
      desc_ka: "საფრანგეთში გატარებული პერიოდის გავლენით შექმნილი ნამუშევრები.",
      desc_en: "Works shaped by the artist's time in France.",
    },
    {
      key: "abstract",
      desc_ka: "ფერისა და ფორმის თავისუფალი კვლევა აბსტრაქციის ენაზე.",
      desc_en: "A free exploration of color and form through abstraction.",
    },
  ];
  return (
    <div className="py-20 bg-background min-h-[60vh]">
      <div className="container mx-auto px-6 max-w-5xl">
        <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">{t("nav.periods")}</p>
        <h1 className="font-serif text-4xl md:text-5xl mb-3">{t("pages.periods.title")}</h1>
        <p className="text-muted-foreground mb-14 max-w-2xl">{t("pages.periods.subtitle")}</p>

        <div className="grid sm:grid-cols-3 gap-6">
          {periods.map((p) => (
            <Link
              key={p.key}
              to={`/artworks?period=${p.key}`}
              className="group block p-8 bg-card border border-border hover:border-gold transition-colors min-h-[220px] flex flex-col justify-between"
            >
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-3">{p.key}</p>
                <h2 className="font-serif text-2xl mb-3">{t(`period.${p.key}`)}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {useLangText(p.desc_ka, p.desc_en)}
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-1 text-xs tracking-widest uppercase group-hover:text-gold">
                {t("pages.periods.explore")} <ArrowRight size={12} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function useLangText(ka: string, en: string) {
  const { lang } = useLang();
  return lang === "ka" ? ka : en;
}
