import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useLang } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Artwork, title } from "@/lib/artwork";
import { toast } from "sonner";
import { z } from "zod";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  artwork: Artwork;
}

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  email: z.string().trim().email().max(200).optional().or(z.literal("")),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
});

export default function TbcRequestDialog({ open, onOpenChange, artwork }: Props) {
  const { lang, t } = useLang();
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Invalid input");
      return;
    }
    if (!form.phone && !form.email) {
      toast.error(lang === "ka" ? "მიუთითეთ ტელეფონი ან ელ. ფოსტა" : "Provide phone or email");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("tbc_detail_requests").insert({
      name: form.name,
      phone: form.phone || null,
      email: form.email || null,
      artwork_id: artwork.id,
      message: form.message || null,
      language: lang,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(t("pages.tbc.success"));
    setForm({ name: "", phone: "", email: "", message: "" });
    onOpenChange(false);
  };

  const input = "w-full bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:border-gold";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif">{t("pages.tbc.title")}</DialogTitle>
          <DialogDescription>{t("pages.tbc.intro")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div className="text-xs text-muted-foreground">
            {t("fields.artwork")}: <span className="text-foreground">{title(artwork, lang)}</span>
          </div>
          <input className={input} placeholder={t("fields.name")} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className={input} placeholder={t("fields.phone")} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input className={input} type="email" placeholder={t("fields.email")} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <textarea className={input} rows={3} placeholder={t("fields.message")} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-charcoal text-cream py-3 text-xs tracking-[0.2em] uppercase hover:bg-charcoal-light transition-colors disabled:opacity-50"
          >
            {t("cta.submit")}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
