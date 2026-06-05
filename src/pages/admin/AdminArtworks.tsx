import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Artwork, title } from "@/lib/artwork";
import { useLang } from "@/i18n/LanguageContext";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { toast } from "sonner";

export default function AdminArtworks() {
  const { lang, t } = useLang();
  const [items, setItems] = useState<Artwork[]>([]);

  const load = () => {
    supabase.from("artworks").select("*").order("created_at", { ascending: false }).then(({ data }) => setItems((data as Artwork[]) || []));
  };
  useEffect(load, []);

  const del = async (id: string) => {
    if (!confirm("Delete?")) return;
    const { error } = await supabase.from("artworks").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl">{t("admin.artworks")}</h1>
        <Link to="/admin/artworks/new" className="bg-charcoal text-cream px-4 py-2 text-xs tracking-widest uppercase inline-flex items-center gap-2 hover:bg-charcoal-light">
          <Plus size={14} /> New
        </Link>
      </div>
      <div className="border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-widest text-muted-foreground border-b border-border">
            <tr>
              <th className="text-left p-3">{t("fields.title")}</th>
              <th className="text-left p-3">{t("nav.periods")}</th>
              <th className="text-left p-3">{t("fields.price")}</th>
              <th className="text-left p-3">{t("fields.status")}</th>
              <th className="text-left p-3">Pub</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((a) => (
              <tr key={a.id} className="border-b border-border last:border-0">
                <td className="p-3">
                  <span className="font-serif">{title(a, lang)}</span>
                  {a.is_featured && <Star size={12} className="inline ml-2 text-gold" />}
                </td>
                <td className="p-3 text-muted-foreground">{t(`period.${a.period}`)}</td>
                <td className="p-3">{a.price_gel.toLocaleString()} ₾</td>
                <td className="p-3 text-xs">{t(`status.${a.status}`)}</td>
                <td className="p-3 text-xs">{a.is_published ? "✓" : "—"}</td>
                <td className="p-3 text-right">
                  <Link to={`/admin/artworks/${a.id}`} className="inline-block p-1.5 text-muted-foreground hover:text-foreground">
                    <Pencil size={14} />
                  </Link>
                  <button onClick={() => del(a.id)} className="inline-block p-1.5 text-muted-foreground hover:text-destructive">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">—</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
