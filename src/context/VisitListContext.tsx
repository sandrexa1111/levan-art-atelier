import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface VisitListContextValue {
  ids: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  toggle: (id: string) => void;
  has: (id: string) => boolean;
  clear: () => void;
  count: number;
}

const VisitListContext = createContext<VisitListContextValue | undefined>(undefined);

const KEY = "visit_list_v1";

export function VisitListProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(ids));
  }, [ids]);

  const add = (id: string) => setIds((arr) => (arr.includes(id) ? arr : [...arr, id]));
  const remove = (id: string) => setIds((arr) => arr.filter((x) => x !== id));
  const toggle = (id: string) =>
    setIds((arr) => (arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]));
  const has = (id: string) => ids.includes(id);
  const clear = () => setIds([]);

  return (
    <VisitListContext.Provider value={{ ids, add, remove, toggle, has, clear, count: ids.length }}>
      {children}
    </VisitListContext.Provider>
  );
}

export function useVisitList() {
  const ctx = useContext(VisitListContext);
  if (!ctx) throw new Error("useVisitList must be used within VisitListProvider");
  return ctx;
}
