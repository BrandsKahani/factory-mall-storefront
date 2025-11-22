// src/app/brands/page.tsx
import Sidebar from "@/components/SidebarNav";
import { shopifyFetch } from "@/lib/shopify";
import { BRAND_PRODUCTS_SOURCE } from "@/lib/queries";
import BrandsGridClient, {
  BrandData,
} from "@/components/BrandsGridClient";

export default async function BrandsPage() {
  const res = await shopifyFetch<any>(BRAND_PRODUCTS_SOURCE, {});
  const edges = res?.data?.products?.edges ?? [];

  const brandMap: Record<string, BrandData> = {};

  edges.forEach((e: any) => {
    const vendor = (e?.node?.vendor || "").trim();
    if (!vendor) return;

    if (!brandMap[vendor]) {
      brandMap[vendor] = {
        name: vendor,
        productCount: 0,
        imageUrl: null,
      };
    }

    brandMap[vendor].productCount++;

    const img = e?.node?.images?.edges?.[0]?.node?.url;
    if (img && !brandMap[vendor].imageUrl) {
      brandMap[vendor].imageUrl = img;
    }
  });

  const brands: BrandData[] = Object.values(brandMap);

  return (
    <div className="app-shell">
      {/* LEFT sidebar */}
      <aside className="sidebar-nav">
        <Sidebar />
      </aside>

      {/* RIGHT content */}
      <main className="app-main">
        <section className="brands-hero">
          <h1 className="brands-title">Brands at Factory Mall</h1>
          <p className="brands-subtitle">
            Shop your favorite clothing & fragrance brands.
          </p>
        </section>

        {/* Sorting + Grid handled in client component */}
        <BrandsGridClient initialBrands={brands} />
      </main>
    </div>
  );
}
