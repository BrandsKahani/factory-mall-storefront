"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

export type CartItem = {
  id: string;
  title: string;
  variantTitle?: string | null;
  price: number;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  checkoutUrl: string | null;

  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;

  addItem: (item: CartItem, checkoutUrl?: string | null) => void;
  removeItem: (id: string) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const count = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () =>
      items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items]
  );

  const openDrawer = () => setIsOpen(true);
  const closeDrawer = () => setIsOpen(false);
  const toggleDrawer = () => setIsOpen((v) => !v);

  const addItem = (item: CartItem, url?: string | null) => {
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

    if (url) setCheckoutUrl(url);

    openDrawer();
  };

  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((p) => p.id !== id));

  return (
    <CartContext.Provider
      value={{
        items,
        count,
        subtotal,
        isOpen,
        checkoutUrl,
        openDrawer,
        closeDrawer,
        toggleDrawer,
        addItem,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside provider");
  return ctx;
}
