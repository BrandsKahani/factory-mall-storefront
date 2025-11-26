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

        {/* Product sections */}
        <HomeProductsSection
          sectionTitle="Trending Now"
          queryType="trending"
        />
        <HomeProductsSection
          sectionTitle="New Arrivals"
          queryType="new"
        />
        <HomeProductsSection
          sectionTitle="Best Sellers"
          queryType="best"
        />
      </main>
    </div>
  );
}
