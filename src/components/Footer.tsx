import { Link } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="bg-charcoal text-cream/70 mt-24">
      <div className="container mx-auto px-6 py-14 grid gap-10 md:grid-cols-3">
        <div>
          <h3 className="font-serif text-cream text-lg mb-3">{t("brand")}</h3>
          <p className="text-sm leading-relaxed text-cream/60">{t("positioning")}</p>
        </div>
        <div className="text-sm">
          <p className="uppercase tracking-widest text-xs text-gold mb-3">{t("nav.privateViewing")}</p>
          <p className="text-cream/70">{t("footer.address")}</p>
          <p className="text-cream/50 mt-1">{t("footer.byAppointment")}</p>
        </div>
        <div className="text-sm">
          <p className="uppercase tracking-widest text-xs text-gold mb-3">{t("nav.home")}</p>
          <ul className="space-y-2">
            <li><Link to="/artworks" className="hover:text-cream">{t("nav.artworks")}</Link></li>
            <li><Link to="/periods" className="hover:text-cream">{t("nav.periods")}</Link></li>
            <li><Link to="/artist" className="hover:text-cream">{t("nav.artist")}</Link></li>
            <li><Link to="/private-viewing" className="hover:text-cream">{t("nav.privateViewing")}</Link></li>
            <li><Link to="/visit-list" className="hover:text-cream">{t("nav.visitList")}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <div className="container mx-auto px-6 py-5 text-xs text-cream/40 flex flex-wrap justify-between gap-2">
          <span>© {new Date().getFullYear()} {t("brand")}.</span>
          <span>{t("footer.rights")}</span>
        </div>
      </div>
    </footer>
  );
}
