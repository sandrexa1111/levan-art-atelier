import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Artwork, ArtPeriod, ArtStatus } from "@/lib/artwork";
import ArtworkCard from "@/components/ArtworkCard";
import { useLang } from "@/i18n/LanguageContext";

type SortKey = "newest" | "priceAsc" | "priceDesc";

export default function Artworks() {
  const { t } = useLang();
  const [params, setParams] = useSearchParams();
  const [items, setItems] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  const period = (params.get("period") as ArtPeriod | null) || "";
  const status = (params.get("status") as ArtStatus | null) || "";
  const sort = (params.get("sort") as SortKey | null) || "newest";

  useEffect(() => {
    setLoading(true);
    supabase
      .from("artworks")
      .select("*")
      .eq("is_published", true)
      .then(({ data }) => {
        setItems((data as Artwork[]) || []);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    let arr = items.slice();
    if (period) arr = arr.filter((a) => a.period === period);
    if (status) arr = arr.filter((a) => a.status === status);
    if (sort === "newest") arr.sort((a, b) => b.created_at.localeCompare(a.created_at));
    if (sort === "priceAsc") arr.sort((a, b) => a.price_gel - b.price_gel);
    if (sort === "priceDesc") arr.sort((a, b) => b.price_gel - a.price_gel);
    return arr;
  }, [items, period, status, sort]);

  const update = (k: string, v: string) => {
    const next = new URLSearchParams(params);
    if (v) next.set(k, v);
    else next.delete(k);
    setParams(next, { replace: true });
  };

  const selectClass = "bg-card border border-border px-3 py-2 text-sm focus:outline-none focus:border-gold";

  return (
    <div className="py-20 bg-background min-h-[60vh]">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">{t("nav.artworks")}</p>
          <h1 className="font-serif text-4xl md:text-5xl mb-3">{t("pages.artworks.title")}</h1>
          <p className="text-muted-foreground">{t("pages.artworks.subtitle")}</p>
        </motion.div>

        <div className="flex flex-wrap gap-3 mb-10">
          <select className={selectClass} value={period} onChange={(e) => update("period", e.target.value)}>
            <option value="">{t("pages.artworks.filterPeriod")}: {t("pages.artworks.all")}</option>
            <option value="georgian">{t("period.georgian")}</option>
            <option value="french">{t("period.french")}</option>
            <option value="abstract">{t("period.abstract")}</option>
          </select>
          <select className={selectClass} value={status} onChange={(e) => update("status", e.target.value)}>
            <option value="">{t("pages.artworks.filterStatus")}: {t("pages.artworks.all")}</option>
            <option value="available">{t("status.available")}</option>
            <option value="reserved_for_viewing">{t("status.reserved_for_viewing")}</option>
            <option value="sold">{t("status.sold")}</option>
          </select>
          <select className={selectClass} value={sort} onChange={(e) => update("sort", e.target.value)}>
            <option value="newest">{t("pages.artworks.sortNewest")}</option>
            <option value="priceAsc">{t("pages.artworks.sortPriceAsc")}</option>
            <option value="priceDesc">{t("pages.artworks.sortPriceDesc")}</option>
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-secondary animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-20">{t("pages.artworks.none")}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(i, 6) * 0.05 }}
              >
                <ArtworkCard artwork={a} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
