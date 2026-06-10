import { useReducer, useEffect, useCallback, useRef } from "react";
import { BrowsingEntry } from "../types/browsingEntry";

const STORAGE_KEY = "browsing_cache";
const MAX_ITEMS = 50;
const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

type Action =
  | { type: "INIT"; payload: BrowsingEntry[] }
  | { type: "ADD"; payload: Omit<BrowsingEntry, "viewedAt"> }
  | { type: "CLEAR" };

// --- Storage layer (isolated, easy to swap for IndexDB later) ---
const storage = {
  load(): BrowsingEntry[] {
    if (typeof window === "undefined") return []; // SSR guard
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const entries: BrowsingEntry[] = JSON.parse(raw);
      const cutoff = Date.now() - TTL_MS; // Product viewed must be within the last 7 days
      // Filter out expired entries
      return entries.filter((entry) => entry.viewedAt >= cutoff); // Remove products viewed outside 7 days
    } catch {
      return [];
    }
  },
  save(entries: BrowsingEntry[]): void {
    if (typeof window === "undefined") return; // SSR guard
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (e) {
      console.warn("[BrowsingCache] Failed to save browsing cache:", e);
    }
  },
  clear(): void {
    if (typeof window === "undefined") return; // SSR guard
    localStorage.removeItem(STORAGE_KEY);
  },
};

function reducer(state: BrowsingEntry[], action: Action): BrowsingEntry[] {
  switch (action.type) {
    case "INIT":
      return action.payload;

    case "ADD": {
      // Deduplicate by slug - a re-visit bumps entry to the top
      const deduped = state.filter(
        (entry) => entry.slug !== action.payload.slug,
      );

      return [{ ...action.payload, viewedAt: Date.now() }, ...deduped].slice(
        0,
        MAX_ITEMS,
      ); // Keep only the most recent MAX_ITEMS items
    }

    case "CLEAR":
      return [];

    default:
      return state;
  }
}

export function useBrowsingCache() {
  const [history, dispatch] = useReducer(reducer, []);
  const initialised = useRef(false);

  // Hydrate from localStorage once on mount (avoids SSR mismatch)
  useEffect(() => {
    if (!initialised.current) {
      initialised.current = true;
      dispatch({ type: "INIT", payload: storage.load() });
    }
  }, []);

  // Sync to localStorage whenever history changes
  useEffect(() => {
    if (initialised.current) {
      storage.save(history);
    }
  }, [history]);

  const addEntry = useCallback((entry: Omit<BrowsingEntry, "viewedAt">) => {
    dispatch({ type: "ADD", payload: entry });
  }, []);

  const clearCache = useCallback(() => {
    dispatch({ type: "CLEAR" });
    storage.clear();
  }, []);

  return {
    history,
    addEntry,
    clearCache,
    isEmpty: history.length === 0,
  };
}
