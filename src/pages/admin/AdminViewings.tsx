import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/i18n/LanguageContext";
import { toast } from "sonner";

interface ViewingReq {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  selected_artwork_ids: string[];
  message: string | null;
  language: string;
  status: "new" | "contacted" | "scheduled" | "closed";
  admin_notes: string | null;
  created_at: string;
}

export default function AdminViewings() {
  const { t } = useLang();
  const [items, setItems] = useState<ViewingReq[]>([]);
  const [titles, setTitles] = useState<Record<string, string>>({});

  const load = async () => {
    const { data } = await supabase.from("private_viewing_requests").select("*").order("created_at", { ascending: false });
    const arr = (data as ViewingReq[]) || [];
    setItems(arr);
    const allIds = Array.from(new Set(arr.flatMap((r) => r.selected_artwork_ids)));
    if (allIds.length) {
      const { data: aws } = await supabase.from("artworks").select("id,title_ka,title_en").in("id", allIds);
      const m: Record<string, string> = {};
      (aws || []).forEach((a: any) => (m[a.id] = a.title_ka || a.title_en));
      setTitles(m);
    }
  };
  useEffect(() => { load(); }, []);

  const update = async (id: string, patch: Partial<ViewingReq>) => {
    const { error } = await supabase.from("private_viewing_requests").update(patch as any).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    load();
  };

  return (
    <div>
      <h1 className="font-serif text-3xl mb-6">{t("admin.viewings")}</h1>
      <div className="space-y-4">
        {items.map((r) => (
          <div key={r.id} className="bg-card border border-border p-5 space-y-3">
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <p className="font-serif text-lg">{r.name}</p>
                <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()} · {r.language.toUpperCase()}</p>
              </div>
              <select value={r.status} onChange={(e) => update(r.id, { status: e.target.value as any })} className="bg-background border border-border px-2 py-1 text-xs">
                <option value="new">new</option>
                <option value="contacted">contacted</option>
                <option value="scheduled">scheduled</option>
                <option value="closed">closed</option>
              </select>
            </div>
            <div className="grid sm:grid-cols-2 gap-2 text-sm">
              <div>📞 {r.phone || "—"}</div>
              <div>✉️ {r.email || "—"}</div>
              <div>📅 {r.preferred_date || "—"} {r.preferred_time}</div>
            </div>
            {r.message && <p className="text-sm text-muted-foreground whitespace-pre-line">{r.message}</p>}
            {r.selected_artwork_ids.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-widest text-gold mb-1">Selected artworks</p>
                <ul className="text-sm">
                  {r.selected_artwork_ids.map((id) => <li key={id}>· {titles[id] || id}</li>)}
                </ul>
              </div>
            )}
            <textarea
              defaultValue={r.admin_notes || ""}
              placeholder="Admin notes"
              onBlur={(e) => e.target.value !== (r.admin_notes || "") && update(r.id, { admin_notes: e.target.value || null })}
              className="w-full bg-background border border-border px-3 py-2 text-sm"
              rows={2}
            />
          </div>
        ))}
        {items.length === 0 && <p className="text-muted-foreground">—</p>}
      </div>
    </div>
  );
}
