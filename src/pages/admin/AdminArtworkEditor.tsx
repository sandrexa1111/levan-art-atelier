import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Artwork } from "@/lib/artwork";
import { useLang } from "@/i18n/LanguageContext";
import { useSignedUrl } from "@/hooks/useSignedUrl";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";

const EMPTY: Partial<Artwork> = {
  slug: "",
  title_ka: "",
  title_en: "",
  period: "georgian",
  subcategory: "",
  year: null,
  medium_ka: "",
  medium_en: "",
  width_cm: null,
  height_cm: null,
  price_gel: 0,
  status: "available",
  main_image: null,
  gallery_images: [],
  description_ka: "",
  description_en: "",
  story_ka: "",
  story_en: "",
  why_see_in_person_ka: "",
  why_see_in_person_en: "",
  room_types: [],
  is_featured: false,
  is_published: false,
};

const ROOMS = ["home", "living_room", "office", "restaurant", "private_collection"];

export default function AdminArtworkEditor() {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const nav = useNavigate();
  const { t } = useLang();
  const [a, setA] = useState<Partial<Artwork>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isNew) return;
    supabase.from("artworks").select("*").eq("id", id!).maybeSingle().then(({ data }) => {
      if (data) setA(data as Artwork);
    });
  }, [id, isNew]);

  const set = <K extends keyof Artwork>(k: K, v: any) => setA((s) => ({ ...s, [k]: v }));

  const uploadImage = async (file: File, asMain: boolean) => {
    setUploading(true);
    const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const { error } = await supabase.storage.from("artworks").upload(path, file);
    setUploading(false);
    if (error) return toast.error(error.message);
    if (asMain) set("main_image", path);
    else set("gallery_images", [...(a.gallery_images || []), path]);
    toast.success("Uploaded");
  };

  const removeGallery = (p: string) => set("gallery_images", (a.gallery_images || []).filter((x) => x !== p));

  const save = async () => {
    if (!a.title_ka || !a.title_en || !a.slug) {
      toast.error("Title (KA/EN) and slug are required");
      return;
    }
    setSaving(true);
    const payload = { ...a, price_gel: Number(a.price_gel) || 0 };
    const res = isNew
      ? await supabase.from("artworks").insert(payload as any).select().single()
      : await supabase.from("artworks").update(payload as any).eq("id", id!).select().single();
    setSaving(false);
    if (res.error) return toast.error(res.error.message);
    toast.success("Saved");
    nav("/admin/artworks");
  };

  const input = "w-full bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:border-gold";

  return (
    <div className="max-w-4xl">
      <h1 className="font-serif text-3xl mb-6">{isNew ? "New artwork" : "Edit artwork"}</h1>

      <div className="space-y-6 bg-card border border-border p-6">
        <section className="grid sm:grid-cols-2 gap-3">
          <Field label="Slug"><input className={input} value={a.slug || ""} onChange={(e) => set("slug", e.target.value)} /></Field>
          <Field label="Year"><input className={input} type="number" value={a.year ?? ""} onChange={(e) => set("year", e.target.value ? Number(e.target.value) : null)} /></Field>
          <Field label="Title (KA)"><input className={input} value={a.title_ka || ""} onChange={(e) => set("title_ka", e.target.value)} /></Field>
          <Field label="Title (EN)"><input className={input} value={a.title_en || ""} onChange={(e) => set("title_en", e.target.value)} /></Field>
          <Field label="Medium (KA)"><input className={input} value={a.medium_ka || ""} onChange={(e) => set("medium_ka", e.target.value)} /></Field>
          <Field label="Medium (EN)"><input className={input} value={a.medium_en || ""} onChange={(e) => set("medium_en", e.target.value)} /></Field>
          <Field label="Width (cm)"><input className={input} type="number" value={a.width_cm ?? ""} onChange={(e) => set("width_cm", e.target.value ? Number(e.target.value) : null)} /></Field>
          <Field label="Height (cm)"><input className={input} type="number" value={a.height_cm ?? ""} onChange={(e) => set("height_cm", e.target.value ? Number(e.target.value) : null)} /></Field>
          <Field label="Price (GEL)"><input className={input} type="number" value={a.price_gel ?? 0} onChange={(e) => set("price_gel", Number(e.target.value))} /></Field>
          <Field label="Subcategory"><input className={input} value={a.subcategory || ""} onChange={(e) => set("subcategory", e.target.value)} /></Field>
          <Field label="Period">
            <select className={input} value={a.period} onChange={(e) => set("period", e.target.value)}>
              <option value="georgian">Georgian</option>
              <option value="french">French</option>
              <option value="abstract">Abstract</option>
            </select>
          </Field>
          <Field label="Status">
            <select className={input} value={a.status} onChange={(e) => set("status", e.target.value)}>
              <option value="available">Available</option>
              <option value="reserved_for_viewing">Reserved for viewing</option>
              <option value="sold">Sold</option>
            </select>
          </Field>
        </section>

        <Field label="Description (KA)"><textarea className={input} rows={3} value={a.description_ka || ""} onChange={(e) => set("description_ka", e.target.value)} /></Field>
        <Field label="Description (EN)"><textarea className={input} rows={3} value={a.description_en || ""} onChange={(e) => set("description_en", e.target.value)} /></Field>
        <Field label="Story (KA)"><textarea className={input} rows={3} value={a.story_ka || ""} onChange={(e) => set("story_ka", e.target.value)} /></Field>
        <Field label="Story (EN)"><textarea className={input} rows={3} value={a.story_en || ""} onChange={(e) => set("story_en", e.target.value)} /></Field>
        <Field label="Why see in person (KA)"><textarea className={input} rows={2} value={a.why_see_in_person_ka || ""} onChange={(e) => set("why_see_in_person_ka", e.target.value)} /></Field>
        <Field label="Why see in person (EN)"><textarea className={input} rows={2} value={a.why_see_in_person_en || ""} onChange={(e) => set("why_see_in_person_en", e.target.value)} /></Field>

        <Field label="Room types">
          <div className="flex flex-wrap gap-2">
            {ROOMS.map((r) => {
              const on = (a.room_types || []).includes(r);
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => set("room_types", on ? (a.room_types || []).filter((x) => x !== r) : [...(a.room_types || []), r])}
                  className={`px-3 py-1 text-xs border ${on ? "bg-gold text-charcoal border-gold" : "border-border"}`}
                >
                  {t(`rooms.${r}`)}
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="Main image">
          <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
            მთავარი ფოტო გამოიყენება კატალოგში და ნამუშევრის მთავარ გვერდზე. ატვირთეთ სუფთა, სწორი, მაღალი ხარისხის ფოტო, სადაც ნამუშევარი სრულად ჩანს.
            <br />
            <span className="opacity-70">The main image is used in the catalog and on the artwork detail page. Upload a clean, straight, high-quality image where the full artwork is visible.</span>
          </p>
          <ImageUpload path={a.main_image || null} onUpload={(f) => uploadImage(f, true)} onClear={() => set("main_image", null)} uploading={uploading} />
        </Field>

        <Field label="Gallery images">
          <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
            გალერეის ფოტოები დამატებითი კადრებია: დეტალები, ტექსტურა, ჩარჩო, კედელზე განთავსება ან ახლო ხედები.
            <br />
            <span className="opacity-70">Gallery images are optional supporting images: details, texture, frame, wall placement, or close-up views.</span>
          </p>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-3">
              {(a.gallery_images || []).map((p) => (
                <GalleryThumb key={p} path={p} onRemove={() => removeGallery(p)} />
              ))}
            </div>
            <label className="inline-flex items-center gap-2 text-xs cursor-pointer border border-dashed border-border px-4 py-2 hover:border-gold">
              <Upload size={14} /> Add image
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && uploadImage(e.target.files[0], false)} />
            </label>
          </div>
        </Field>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!a.is_featured} onChange={(e) => set("is_featured", e.target.checked)} /> Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!a.is_published} onChange={(e) => set("is_published", e.target.checked)} /> Published
          </label>
        </div>

        <div className="flex gap-3">
          <button disabled={saving} onClick={save} className="bg-charcoal text-cream px-6 py-3 text-xs tracking-[0.2em] uppercase hover:bg-charcoal-light disabled:opacity-50">
            Save
          </button>
          <button onClick={() => nav("/admin/artworks")} className="border border-border px-6 py-3 text-xs tracking-[0.2em] uppercase">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] tracking-widest uppercase text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

function ImageUpload({ path, onUpload, onClear, uploading }: { path: string | null; onUpload: (f: File) => void; onClear: () => void; uploading: boolean }) {
  const url = useSignedUrl(path);
  return (
    <div className="flex items-center gap-3">
      {path && url ? (
        <div className="relative w-28 h-28 bg-secondary">
          <img src={url} alt="" className="w-full h-full object-cover" />
          <button onClick={onClear} className="absolute -top-2 -right-2 bg-charcoal text-cream rounded-full p-1"><X size={12} /></button>
        </div>
      ) : (
        <div className="w-28 h-28 bg-secondary border border-dashed border-border" />
      )}
      <label className="inline-flex items-center gap-2 text-xs cursor-pointer border border-border px-3 py-2 hover:border-gold">
        <Upload size={14} /> {uploading ? "..." : "Upload"}
        <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && onUpload(e.target.files[0])} />
      </label>
    </div>
  );
}

function GalleryThumb({ path, onRemove }: { path: string; onRemove: () => void }) {
  const url = useSignedUrl(path);
  return (
    <div className="relative w-20 h-20 bg-secondary">
      {url && <img src={url} alt="" className="w-full h-full object-cover" />}
      <button onClick={onRemove} className="absolute -top-2 -right-2 bg-charcoal text-cream rounded-full p-1"><X size={12} /></button>
    </div>
  );
}
