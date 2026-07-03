import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/i18n/LanguageContext";
import { useSignedUrl } from "@/hooks/useSignedUrl";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";

type PeriodKey = "georgian" | "french" | "abstract";
const PERIODS: PeriodKey[] = ["georgian", "french", "abstract"];

export default function AdminPeriods() {
  const { t } = useLang();
  const [rows, setRows] = useState<Record<PeriodKey, string | null>>({
    georgian: null,
    french: null,
    abstract: null,
  });
  const [busy, setBusy] = useState<PeriodKey | null>(null);

  const load = async () => {
    const { data } = await (supabase.from("period_settings" as any) as any).select("*");
    if (!data) return;
    const next: any = { georgian: null, french: null, abstract: null };
    for (const r of data) next[r.period as PeriodKey] = r.image_path ?? null;
    setRows(next);
  };

  useEffect(() => {
    load();
  }, []);

  const upload = async (period: PeriodKey, file: File) => {
    if (!file.type.startsWith("image/")) return toast.error("Image only");
    setBusy(period);
    const path = `periods/${period}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const { error: upErr } = await supabase.storage.from("artworks").upload(path, file);
    if (upErr) {
      setBusy(null);
      return toast.error(upErr.message);
    }
    const { error } = await (supabase.from("period_settings" as any) as any)
      .upsert({ period, image_path: path, updated_at: new Date().toISOString() });
    setBusy(null);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    load();
  };

  const clear = async (period: PeriodKey) => {
    const { error } = await (supabase.from("period_settings" as any) as any)
      .upsert({ period, image_path: null, updated_at: new Date().toISOString() });
    if (error) return toast.error(error.message);
    load();
  };

  return (
    <div>
      <h1 className="font-serif text-3xl mb-2">{t("admin.periods")}</h1>
      <p className="text-sm text-muted-foreground mb-8">{t("admin.periodsHelp")}</p>
      <div className="grid sm:grid-cols-3 gap-6">
        {PERIODS.map((p) => (
          <PeriodTile
            key={p}
            period={p}
            path={rows[p]}
            busy={busy === p}
            onUpload={(f) => upload(p, f)}
            onClear={() => clear(p)}
          />
        ))}
      </div>
    </div>
  );
}

function PeriodTile({
  period,
  path,
  busy,
  onUpload,
  onClear,
}: {
  period: PeriodKey;
  path: string | null;
  busy: boolean;
  onUpload: (f: File) => void;
  onClear: () => void;
}) {
  const { t } = useLang();
  const url = useSignedUrl(path);
  return (
    <div className="border border-border bg-card">
      <div className="p-4 border-b border-border">
        <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">{period}</p>
        <h3 className="font-serif text-lg">{t(`period.${period}`)}</h3>
      </div>
      <div className="aspect-[4/5] bg-secondary relative">
        {url ? (
          <img src={url} alt={period} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs uppercase tracking-widest text-muted-foreground">
            {t("admin.noImage")}
          </div>
        )}
        {path && (
          <button
            onClick={onClear}
            className="absolute top-2 right-2 bg-charcoal/80 text-cream p-1.5 hover:bg-charcoal"
            title="Clear"
          >
            <X size={14} />
          </button>
        )}
      </div>
      <label className="flex items-center justify-center gap-2 p-3 text-[11px] tracking-[0.2em] uppercase cursor-pointer hover:bg-secondary">
        <Upload size={14} />
        {busy ? "…" : t("admin.uploadImage")}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onUpload(f);
          }}
        />
      </label>
    </div>
  );
}
