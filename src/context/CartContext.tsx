// src/context/CartContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";

export type CartItem = {
  id: string;
  title: string;
  variantTitle?: string | null;
  price: number;
  quantity: number;
  imageUrl?: string | null; // 👈 NEW: thumbnail for cart drawer
};

type CartContextType = {
  items: CartItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  lastCheckoutUrl: string | null;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  addItem: (item: CartItem, checkoutUrl?: string | null) => void;
  removeItem: (id: string, variantTitle?: string | null) => void;
  updateItemQuantity: (
    id: string,
    variantTitle: string | null | undefined,
    quantity: number
  ) => void;
  clearCart: () => void;
  setCheckoutUrl: (url: string | null) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "fm_cart_state_v1";

type StoredCartState = {
  items: CartItem[];
  lastCheckoutUrl: string | null;
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [lastCheckoutUrl, setLastCheckoutUrl] = useState<string | null>(null);

  // -------------------------------
  // Hydrate from localStorage
  // -------------------------------
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed: StoredCartState = JSON.parse(raw);
      if (Array.isArray(parsed.items)) {
        setItems(parsed.items);
      }
      if (parsed.lastCheckoutUrl) {
        setLastCheckoutUrl(parsed.lastCheckoutUrl);
      }
    } catch (err) {
      console.warn("Cart localStorage parse error", err);
    }
  }, []);

  // -------------------------------
  // Persist to localStorage
  // -------------------------------
  useEffect(() => {
    if (typeof window === "undefined") return;

    const payload: StoredCartState = {
      items,
      lastCheckoutUrl,
    };

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
      console.warn("Cart localStorage save error", err);
    }
  }, [items, lastCheckoutUrl]);

  const count = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const openDrawer = () => setIsOpen(true);
  const closeDrawer = () => setIsOpen(false);
  const toggleDrawer = () => setIsOpen((v) => !v);

  const addItem = (item: CartItem, checkoutUrl?: string | null) => {
    setItems((prev) => {
      const existing = prev.find(
        (p) => p.id === item.id && p.variantTitle === item.variantTitle
      );
      if (existing) {
        return prev.map((p) =>
          p === existing
            ? { ...p, quantity: p.quantity + item.quantity }
            : p
        );
      }
      return [...prev, item];
    });

    if (checkoutUrl) {
      setLastCheckoutUrl(checkoutUrl);
    }

    setIsOpen(true);
  };

  const removeItem = (id: string, variantTitle?: string | null) => {
    setItems((prev) =>
      prev.filter(
        (p) =>
          !(p.id === id && (p.variantTitle ?? null) === (variantTitle ?? null))
      )
    );
  };

  const updateItemQuantity = (
    id: string,
    variantTitle: string | null | undefined,
    quantity: number
  ) => {
    const safeQty = Math.max(1, quantity || 1);

    setItems((prev) =>
      prev.map((p) =>
        p.id === id && (p.variantTitle ?? null) === (variantTitle ?? null)
          ? { ...p, quantity: safeQty }
          : p
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setLastCheckoutUrl(null);
  };

  const value: CartContextType = {
    items,
    count,
    subtotal,
    isOpen,
    lastCheckoutUrl,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    addItem,
    removeItem,
    updateItemQuantity,
    clearCart,
    setCheckoutUrl: setLastCheckoutUrl,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
