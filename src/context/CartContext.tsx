// src/context/CartContext.tsx
"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

export type CartItem = {
  id: string;
  title: string;
  variantTitle?: string | null;
  price: number; // per unit
  quantity: number;
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
  removeItem: (id: string) => void;
  setCheckoutUrl: (url: string | null) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [lastCheckoutUrl, setLastCheckoutUrl] = useState<string | null>(null);

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
          p === existing ? { ...p, quantity: p.quantity + item.quantity } : p
        );
      }
      return [...prev, item];
    });

    if (checkoutUrl) {
      setLastCheckoutUrl(checkoutUrl);
    }

    setIsOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
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
