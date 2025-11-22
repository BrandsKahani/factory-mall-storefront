// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { CartProvider } from "@/context/CartContext";

export const metadata: Metadata = {
  title: "Factory Mall",
  description: "Factory Mall – Fashion marketplace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Header />
          {/* main app shell / pages */}
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
