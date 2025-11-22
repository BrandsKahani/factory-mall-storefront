import Sidebar from "@/components/SidebarNav";
import HomeHero from "@/components/home/HomeHero";
import HomeProductsSection from "@/components/home/HomeProductsSection";
import SidebarNav from "@/components/SidebarNav";

<aside className="sidebar-nav">
  <SidebarNav />
</aside>

export default function HomePage() {
  return (
    <div className="app-shell">
      <aside className="sidebar-nav">
        <Sidebar />
      </aside>

      <main className="app-main home-main">
        <HomeHero />

        <HomeProductsSection sectionTitle="Trending Now" queryType="trending" />
        <HomeProductsSection sectionTitle="New Arrivals" queryType="new" />
        <HomeProductsSection sectionTitle="Best Sellers" queryType="best" />
      </main>
    </div>
  );
}
