// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";

import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { LoginPopupProvider } from "@/context/LoginPopupContext";

import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import StickyToolbar from "@/components/StickyToolbar";
import LoginPopup from "@/components/LoginPopup";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Factory Mall – Fashion & Lifestyle Store",
  description: "Shop latest fashion products.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>

        {/* Favicon */}
  <link rel="icon" href="/favicon.ico" />
  <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
  <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png" />

        {/* ✅ Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-QZT9YTDBMH"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-QZT9YTDBMH');
          `}
        </Script>
      </head>

      <body className={inter.className}>
        <LoginPopupProvider>
          <CartProvider>
            <WishlistProvider>
              <Header />
              <CartDrawer />

              <main className="min-h-screen pb-20">{children}</main>

              <StickyToolbar />
              <LoginPopup />
            </WishlistProvider>
          </CartProvider>
        </LoginPopupProvider>
      </body>
    </html>
  );
}
