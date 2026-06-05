import { supabase } from "@/integrations/supabase/client";
import type { Lang } from "@/i18n/translations";

export type ArtPeriod = "georgian" | "french" | "abstract";
export type ArtStatus = "available" | "reserved_for_viewing" | "sold";

export interface Artwork {
  id: string;
  slug: string;
  title_ka: string;
  title_en: string;
  period: ArtPeriod;
  subcategory: string | null;
  year: number | null;
  medium_ka: string | null;
  medium_en: string | null;
  width_cm: number | null;
  height_cm: number | null;
  price_gel: number;
  status: ArtStatus;
  main_image: string | null;
  gallery_images: string[];
  description_ka: string | null;
  description_en: string | null;
  story_ka: string | null;
  story_en: string | null;
  why_see_in_person_ka: string | null;
  why_see_in_person_en: string | null;
  room_types: string[];
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export const title = (a: Pick<Artwork, "title_ka" | "title_en">, lang: Lang) =>
  lang === "ka" ? a.title_ka : a.title_en;

export const medium = (a: Pick<Artwork, "medium_ka" | "medium_en">, lang: Lang) =>
  (lang === "ka" ? a.medium_ka : a.medium_en) || "";

export const description = (a: Pick<Artwork, "description_ka" | "description_en">, lang: Lang) =>
  (lang === "ka" ? a.description_ka : a.description_en) || "";

export const story = (a: Pick<Artwork, "story_ka" | "story_en">, lang: Lang) =>
  (lang === "ka" ? a.story_ka : a.story_en) || "";

export const whyInPerson = (
  a: Pick<Artwork, "why_see_in_person_ka" | "why_see_in_person_en">,
  lang: Lang
) => (lang === "ka" ? a.why_see_in_person_ka : a.why_see_in_person_en) || "";

export function formatPrice(price: number, lang: Lang) {
  const num = new Intl.NumberFormat(lang === "ka" ? "ka-GE" : "en-US").format(price);
  return `${num} ₾`;
}

export function formatSize(w: number | null, h: number | null) {
  if (!w || !h) return "";
  return `${w} × ${h} cm`;
}

// Storage helper: paths are stored in DB; we generate signed URLs for display.
const urlCache = new Map<string, { url: string; exp: number }>();

export async function getImageUrl(path: string | null | undefined): Promise<string> {
  if (!path) return "";
  if (/^https?:\/\//.test(path)) return path;
  const cached = urlCache.get(path);
  if (cached && cached.exp > Date.now()) return cached.url;
  const { data } = await supabase.storage.from("artworks").createSignedUrl(path, 60 * 60 * 24 * 7);
  const url = data?.signedUrl || "";
  if (url) urlCache.set(path, { url, exp: Date.now() + 1000 * 60 * 60 * 24 * 6 });
  return url;
}

export async function getImageUrls(paths: (string | null | undefined)[]): Promise<string[]> {
  return Promise.all(paths.map((p) => getImageUrl(p)));
}
