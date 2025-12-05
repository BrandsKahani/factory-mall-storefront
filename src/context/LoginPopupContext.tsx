"use client";

import { createContext, useContext, useState } from "react";

type LoginPopupContextType = {
  open: boolean;
  openLogin: () => void;
  closeLogin: () => void;
};

const LoginPopupContext = createContext<LoginPopupContextType | null>(null);

export function LoginPopupProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const openLogin = () => setOpen(true);
  const closeLogin = () => setOpen(false);

  return (
    <LoginPopupContext.Provider value={{ open, openLogin, closeLogin }}>
      {children}
    </LoginPopupContext.Provider>
  );
}

export function useLoginPopup() {
  const ctx = useContext(LoginPopupContext);
  if (!ctx) {
    throw new Error("useLoginPopup must be used inside LoginPopupProvider");
  }
  return ctx;
}
