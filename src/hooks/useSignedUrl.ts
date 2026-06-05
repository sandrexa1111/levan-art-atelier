import { useEffect, useState } from "react";
import { getImageUrl } from "@/lib/artwork";

export function useSignedUrl(path: string | null | undefined) {
  const [url, setUrl] = useState<string>("");
  useEffect(() => {
    let alive = true;
    if (!path) {
      setUrl("");
      return;
    }
    getImageUrl(path).then((u) => {
      if (alive) setUrl(u);
    });
    return () => {
      alive = false;
    };
  }, [path]);
  return url;
}
