import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.factorymall.pk"),

  title: {
    default: "Factory Mall – Fashion & Lifestyle Store",
    template: "%s | Factory Mall",
  },

  description:
    "Shop latest fashion, perfumes, accessories and lifestyle products at Factory Mall. Fast delivery all over Pakistan.",

  verification: {
    google: "i_GhVI6p3MNPakgRm_3nmyO_dbKqjFLkbeqPiX1DrSU", // ✔ Google Search Console FIXED
  },

  openGraph: {
    title: "Factory Mall – Fashion & Lifestyle Store",
    description:
      "Trending fashion, perfumes, and accessories at unbeatable prices.",
    url: "https://www.factorymall.pk",
    siteName: "Factory Mall",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Factory Mall",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Factory Mall – Fashion & Lifestyle Store",
    description:
      "Explore premium fashion, perfumes and lifestyle accessories at Factory Mall.",
    images: ["/og-image.png"],
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <WishlistProvider>
            <Header />
            <CartDrawer />
            <main className="min-h-screen">{children}</main>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
