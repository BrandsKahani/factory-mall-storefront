// src/app/page.tsx

import HomeHeroSection from "@/components/home/HomeHeroSection";
import HomeProductsSection from "@/components/home/HomeProductsSection";
import SidebarNav from "@/components/SidebarNav";

// ⭐ HOME PAGE SEO ⭐
export const metadata = {
  title: "Factory Mall – Fashion, Fragrances & Lifestyle in Pakistan",
  description:
    "Discover top fashion, perfumes, accessories and more at Factory Mall. Best prices, original products, and fast nationwide delivery.",
  keywords: [
    "Factory Mall",
    "fashion store pakistan",
    "perfume pakistan",
    "lifestyle accessories",
    "online shopping pakistan",
    "best fashion store",
    "factory mall pk",
    "factory mall online",
  ],
  alternates: {
    canonical: "https://www.factorymall.pk",
  },
  openGraph: {
    title: "Factory Mall – Fashion & Lifestyle Store",
    description:
      "Shop trending fashion, perfumes, and lifestyle products at unbeatable prices.",
    url: "https://www.factorymall.pk",
    siteName: "Factory Mall",
    images: [
      {
        url: "/og-image.png", // Place og-image.png inside /public
        width: 1200,
        height: 630,
        alt: "Factory Mall - Fashion & Lifestyle",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Factory Mall – Fashion & Lifestyle Store",
    description:
      "Premium online store for fashion, fragrances, and accessories.",
    images: ["/og-image.png"],
  },
};

export default function HomePage() {
  return (
    <div className="app-shell">

      {/* LEFT: Sidebar */}
      <aside className="sidebar-nav">
        <SidebarNav />
      </aside>

      {/* RIGHT: Main content */}
      <main className="app-main home-main">

        {/* Hero slider */}
        <HomeHeroSection />

        {/* Product sections (via Shopify collections) */}
        <HomeProductsSection
          sectionTitle="Trending Now"
          collectionHandle="home-trending-now"
        />

        <HomeProductsSection
          sectionTitle="New Arrivals"
          collectionHandle="home-new-arrivals"
        />

        <HomeProductsSection
          sectionTitle="Best Sellers"
          collectionHandle="home-best-sellers"
        />
      </main>
    </div>
  );
}
