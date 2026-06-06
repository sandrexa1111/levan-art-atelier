import living from "@/assets/rooms/room-living.jpg.asset.json";
import bedroom from "@/assets/rooms/room-bedroom.jpg.asset.json";
import workspace from "@/assets/rooms/room-workspace.jpg.asset.json";
import office from "@/assets/rooms/room-office.jpg.asset.json";
import restaurant from "@/assets/rooms/room-restaurant.jpg.asset.json";
import gallery from "@/assets/rooms/room-gallery.jpg.asset.json";

export type RoomKey =
  | "living"
  | "bedroom"
  | "workspace"
  | "office"
  | "restaurant"
  | "gallery";

// Wall anchor: where the artwork's vertical centerline sits on the room image.
// `topPct` is where the top edge of a "medium" wall would start.
// Width scales by the "size" preference.
export interface RoomTemplate {
  key: RoomKey;
  url: string;
  // % of room image width that "medium" artwork occupies
  mediumWidthPct: number;
  // center X (% from left), center Y (% from top) for placement
  centerXPct: number;
  centerYPct: number;
}

export const ROOM_TEMPLATES: RoomTemplate[] = [
  { key: "living", url: living.url, mediumWidthPct: 26, centerXPct: 50, centerYPct: 38 },
  { key: "bedroom", url: bedroom.url, mediumWidthPct: 24, centerXPct: 50, centerYPct: 34 },
  { key: "workspace", url: workspace.url, mediumWidthPct: 28, centerXPct: 50, centerYPct: 32 },
  { key: "office", url: office.url, mediumWidthPct: 30, centerXPct: 50, centerYPct: 36 },
  { key: "restaurant", url: restaurant.url, mediumWidthPct: 26, centerXPct: 50, centerYPct: 38 },
  { key: "gallery", url: gallery.url, mediumWidthPct: 28, centerXPct: 32, centerYPct: 42 },
];

export const SIZE_SCALE: Record<"small" | "medium" | "large", number> = {
  small: 0.7,
  medium: 1,
  large: 1.35,
};
