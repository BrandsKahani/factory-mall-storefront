// src/app/page.tsx

import HomeHeroSection from "@/components/home/HomeHeroSection";
import HomeProductsSection from "@/components/home/HomeProductsSection";
import SidebarNav from "@/components/SidebarNav";

export default function HomePage() {
  return (
    <div className="app-shell">
      {/* LEFT: Sidebar */}
      <aside className="sidebar-nav">
        <SidebarNav />
      </aside>

      {/* RIGHT: Main content */}
      <main className="app-main home-main">
        {/* Hero slider (Shopify + fallback) */}
        <HomeHeroSection />

        {/* Product sections – controlled via Shopify collections */}
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
