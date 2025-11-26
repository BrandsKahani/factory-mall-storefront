import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Factory Mall",
  description: "Fashion & Lifestyle Store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <WishlistProvider>
            {/* GLOBAL HEADER */}
            <Header />

            {/* CART DRAWER */}
            <CartDrawer />

            {/* MAIN APP CONTENT */}
            <main className="min-h-screen">{children}</main>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
