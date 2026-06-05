import { useEffect, useState } from "react";
import { MapPin, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/i18n/LanguageContext";
import { useVisitList } from "@/context/VisitListContext";
import { Artwork, title } from "@/lib/artwork";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  email: z.string().trim().email().max(200).optional().or(z.literal("")),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
  preferred_date: z.string().optional().or(z.literal("")),
  preferred_time: z.string().max(40).optional().or(z.literal("")),
});

export default function PrivateViewing() {
  const { lang, t } = useLang();
  const { ids, clear } = useVisitList();
  const [items, setItems] = useState<Artwork[]>([]);
  const [form, setForm] = useState({ name: "", phone: "", email: "", preferred_date: "", preferred_time: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (ids.length === 0) return setItems([]);
    supabase.from("artworks").select("id,slug,title_ka,title_en,main_image,period,price_gel").in("id", ids).then(({ data }) => setItems((data as any[]) as Artwork[]));
  }, [ids]);

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
    const { error } = await supabase.from("private_viewing_requests").insert({
      name: form.name,
      phone: form.phone || null,
      email: form.email || null,
      preferred_date: form.preferred_date || null,
      preferred_time: form.preferred_time || null,
      selected_artwork_ids: ids,
      message: form.message || null,
      language: lang,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setDone(true);
    clear();
  };

  const input = "w-full bg-card border border-border px-3 py-2.5 text-sm focus:outline-none focus:border-gold";

  return (
    <div className="py-20 bg-background min-h-[60vh]">
      <div className="container mx-auto px-6 max-w-3xl">
        <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">{t("nav.privateViewing")}</p>
        <h1 className="font-serif text-4xl md:text-5xl mb-6">{t("pages.privateViewing.title")}</h1>

        <ul className="space-y-2 text-muted-foreground mb-10">
          <li className="flex gap-2"><Check size={16} className="text-gold mt-1 flex-shrink-0" />{t("pages.privateViewing.intro1")}</li>
          <li className="flex gap-2"><MapPin size={16} className="text-gold mt-1 flex-shrink-0" />{t("pages.privateViewing.intro2")}</li>
          <li className="flex gap-2"><Check size={16} className="text-gold mt-1 flex-shrink-0" />{t("pages.privateViewing.intro3")}</li>
          <li className="flex gap-2"><Check size={16} className="text-gold mt-1 flex-shrink-0" />{t("pages.privateViewing.intro4")}</li>
        </ul>

        {done ? (
          <div className="bg-secondary p-8 text-center">
            <p className="font-serif text-xl mb-2">✓</p>
            <p>{t("pages.privateViewing.success")}</p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3 bg-card border border-border p-6">
            {items.length > 0 && (
              <div className="pb-4 border-b border-border mb-2">
                <p className="text-xs tracking-widest uppercase text-muted-foreground mb-2">{t("nav.visitList")}</p>
                <ul className="text-sm space-y-1">
                  {items.map((a) => (
                    <li key={a.id}>· {title(a, lang)}</li>
                  ))}
                </ul>
              </div>
            )}
            <input className={input} placeholder={t("fields.name")} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <div className="grid sm:grid-cols-2 gap-3">
              <input className={input} placeholder={t("fields.phone")} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <input className={input} type="email" placeholder={t("fields.email")} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <input className={input} type="date" value={form.preferred_date} onChange={(e) => setForm({ ...form, preferred_date: e.target.value })} placeholder={t("fields.preferredDate")} />
              <input className={input} placeholder={t("fields.preferredTime")} value={form.preferred_time} onChange={(e) => setForm({ ...form, preferred_time: e.target.value })} />
            </div>
            <textarea className={input} rows={4} placeholder={t("fields.message")} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-charcoal text-cream py-3.5 text-xs tracking-[0.2em] uppercase hover:bg-charcoal-light transition-colors disabled:opacity-50"
            >
              {t("cta.submit")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
