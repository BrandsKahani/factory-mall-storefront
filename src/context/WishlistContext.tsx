"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type WishlistItem = {
  handle: string;
  title: string;
  vendor?: string;
  imageUrl?: string | null;
  price?: number;
};

type WishlistContextType = {
  items: WishlistItem[];
  count: number;
  toggleWishlist: (item: WishlistItem) => void;
  removeItem: (handle: string) => void;
  clearWishlist: () => void;
  isInWishlist: (handle: string) => boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

const STORAGE_KEY = "fm_wishlist_v1";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);

  // 🔹 Load from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed: WishlistItem[] = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setItems(parsed);
      }
    } catch (err) {
      console.warn("Wishlist localStorage parse error", err);
    }
  }, []);

  // 🔹 Save to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.warn("Wishlist localStorage save error", err);
    }
  }, [items]);

  const count = useMemo(() => items.length, [items]);

  const isInWishlist = (handle: string) =>
    items.some((it) => it.handle === handle);

  const toggleWishlist = (item: WishlistItem) => {
    setItems((prev) => {
      const exists = prev.some((p) => p.handle === item.handle);
      if (exists) {
        // remove
        return prev.filter((p) => p.handle !== item.handle);
      }
      // add on top
      return [item, ...prev];
    });
  };

  const removeItem = (handle: string) => {
    setItems((prev) => prev.filter((it) => it.handle !== handle));
  };

  const clearWishlist = () => setItems([]);

  const value: WishlistContextType = {
    items,
    count,
    toggleWishlist,
    removeItem,
    clearWishlist,
    isInWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return ctx;
}
