import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/i18n/LanguageContext";
import { toast } from "sonner";

interface TbcReq {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  artwork_id: string | null;
  message: string | null;
  language: string;
  status: "new" | "sent" | "closed";
  admin_notes: string | null;
  created_at: string;
}

export default function AdminTbcRequests() {
  const { t } = useLang();
  const [items, setItems] = useState<TbcReq[]>([]);
  const [titles, setTitles] = useState<Record<string, string>>({});

  const load = async () => {
    const { data } = await supabase.from("tbc_detail_requests").select("*").order("created_at", { ascending: false });
    const arr = (data as TbcReq[]) || [];
    setItems(arr);
    const ids = Array.from(new Set(arr.map((r) => r.artwork_id).filter(Boolean) as string[]));
    if (ids.length) {
      const { data: aws } = await supabase.from("artworks").select("id,title_ka,title_en").in("id", ids);
      const m: Record<string, string> = {};
      (aws || []).forEach((a: any) => (m[a.id] = a.title_ka || a.title_en));
      setTitles(m);
    }
  };
  useEffect(() => { load(); }, []);

  const update = async (id: string, patch: Partial<TbcReq>) => {
    const { error } = await supabase.from("tbc_detail_requests").update(patch as any).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    load();
  };

  return (
    <div>
      <h1 className="font-serif text-3xl mb-6">{t("admin.tbcRequests")}</h1>
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
                <option value="sent">sent</option>
                <option value="closed">closed</option>
              </select>
            </div>
            <div className="grid sm:grid-cols-2 gap-2 text-sm">
              <div>📞 {r.phone || "—"}</div>
              <div>✉️ {r.email || "—"}</div>
              <div>🖼 {r.artwork_id ? (titles[r.artwork_id] || r.artwork_id) : "—"}</div>
            </div>
            {r.message && <p className="text-sm text-muted-foreground whitespace-pre-line">{r.message}</p>}
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
