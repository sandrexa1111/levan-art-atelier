import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/i18n/LanguageContext";

export default function AdminDashboard() {
  const { t } = useLang();
  const [stats, setStats] = useState({ total: 0, available: 0, reserved: 0, sold: 0, viewingsNew: 0, tbcNew: 0 });

  useEffect(() => {
    (async () => {
      const [total, available, reserved, sold, viewings, tbc] = await Promise.all([
        supabase.from("artworks").select("id", { count: "exact", head: true }),
        supabase.from("artworks").select("id", { count: "exact", head: true }).eq("status", "available"),
        supabase.from("artworks").select("id", { count: "exact", head: true }).eq("status", "reserved_for_viewing"),
        supabase.from("artworks").select("id", { count: "exact", head: true }).eq("status", "sold"),
        supabase.from("private_viewing_requests").select("id", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("tbc_detail_requests").select("id", { count: "exact", head: true }).eq("status", "new"),
      ]);
      setStats({
        total: total.count || 0,
        available: available.count || 0,
        reserved: reserved.count || 0,
        sold: sold.count || 0,
        viewingsNew: viewings.count || 0,
        tbcNew: tbc.count || 0,
      });
    })();
  }, []);

  const Card = ({ label, value }: { label: string; value: number }) => (
    <div className="p-6 bg-card border border-border">
      <p className="text-xs tracking-widest uppercase text-muted-foreground">{label}</p>
      <p className="font-serif text-3xl mt-2">{value}</p>
    </div>
  );

  return (
    <div>
      <h1 className="font-serif text-3xl mb-8">{t("admin.dashboard")}</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card label={t("admin.artworks")} value={stats.total} />
        <Card label={t("status.available")} value={stats.available} />
        <Card label={t("status.reserved_for_viewing")} value={stats.reserved} />
        <Card label={t("status.sold")} value={stats.sold} />
        <Card label={t("admin.viewings") + " — new"} value={stats.viewingsNew} />
        <Card label={t("admin.tbcRequests") + " — new"} value={stats.tbcNew} />
      </div>
    </div>
  );
}
