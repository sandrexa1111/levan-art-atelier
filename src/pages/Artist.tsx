import { useLang } from "@/i18n/LanguageContext";
import artistPortrait from "@/assets/artist-portrait.jpg";
import { motion } from "framer-motion";

export default function Artist() {
  const { t } = useLang();
  return (
    <div className="py-20 bg-background">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-14 items-start">
          <motion.img
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            src={artistPortrait}
            alt="Levan Mosiashvili"
            className="w-full aspect-[3/4] object-cover"
          />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">{t("nav.artist")}</p>
            <h1 className="font-serif text-4xl md:text-5xl mb-6">{t("pages.artist.title")}</h1>
            <p className="text-foreground/80 leading-relaxed whitespace-pre-line">{t("pages.artist.bio")}</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
