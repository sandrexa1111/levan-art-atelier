import { Link, NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { Bookmark, Menu, X } from "lucide-react";
import { useVisitList } from "@/context/VisitListContext";
import { useLang } from "@/i18n/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const { count } = useVisitList();
  const { lang, setLang, t } = useLang();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/", key: "nav.home" },
    { to: "/artworks", key: "nav.artworks" },
    { to: "/periods", key: "nav.periods" },
    { to: "/artist", key: "nav.artist" },
    { to: "/private-viewing", key: "nav.privateViewing" },
  ];

  const linkClass = (active: boolean) =>
    `text-xs tracking-[0.2em] uppercase transition-colors duration-300 ${
      active ? "text-gold" : "text-cream/70 hover:text-cream"
    }`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-charcoal/95 backdrop-blur-sm border-b border-cream/5">
      <div className="container mx-auto flex items-center justify-between px-6 py-4 gap-6">
        <Link to="/" className="font-serif text-sm md:text-base tracking-wider text-cream leading-tight">
          {t("brand")}
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => linkClass(isActive)} end={l.to === "/"}>
              {t(l.key)}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1 text-[11px] tracking-widest">
            <button
              onClick={() => setLang("ka")}
              className={lang === "ka" ? "text-gold" : "text-cream/50 hover:text-cream"}
            >
              KA
            </button>
            <span className="text-cream/30">/</span>
            <button
              onClick={() => setLang("en")}
              className={lang === "en" ? "text-gold" : "text-cream/50 hover:text-cream"}
            >
              EN
            </button>
          </div>
          <Link to="/visit-list" className="relative text-cream/70 hover:text-cream transition-colors" aria-label={t("nav.visitList")}>
            <Bookmark size={20} />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-charcoal text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-semibold">
                {count}
              </span>
            )}
          </Link>
          <button onClick={() => setOpen(!open)} className="lg:hidden text-cream" aria-label="menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-charcoal border-t border-cream/10 overflow-hidden"
          >
            <div className="flex flex-col px-6 py-4 gap-4">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={linkClass(location.pathname === l.to)}
                >
                  {t(l.key)}
                </Link>
              ))}
              <div className="flex items-center gap-2 pt-2 border-t border-cream/10 text-[11px] tracking-widest">
                <button onClick={() => setLang("ka")} className={lang === "ka" ? "text-gold" : "text-cream/50"}>KA</button>
                <span className="text-cream/30">/</span>
                <button onClick={() => setLang("en")} className={lang === "en" ? "text-gold" : "text-cream/50"}>EN</button>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
