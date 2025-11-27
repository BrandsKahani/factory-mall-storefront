// src/app/brands/page.tsx

import Sidebar from "@/components/SidebarNav";
import { shopifyFetch } from "@/lib/shopify";
import { BRAND_PRODUCTS_SOURCE } from "@/lib/queries";
import BrandsGridClient, { BrandData } from "@/components/BrandsGridClient";

// ⭐ SEO Metadata for Brands Page ⭐
export const metadata = {
  title: "Shop Brands | Factory Mall",
  description:
    "Explore top fashion and fragrance brands at Factory Mall. Shop popular brands, original products, and fast delivery across Pakistan.",
  keywords: [
    "brands in pakistan",
    "factory mall brands",
    "perfume brands pakistan",
    "fashion brands pakistan",
    "Factory Mall brands",
  ],
  alternates: {
    canonical: "https://www.factorymall.pk/brands",
  },
  openGraph: {
    title: "Brands at Factory Mall",
    description:
      "Discover trending fashion and fragrance brands available at Factory Mall.",
    url: "https://www.factorymall.pk/brands",
    siteName: "Factory Mall",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brands at Factory Mall",
    description:
      "Shop the top-selling brands in fashion & fragrances at Factory Mall.",
  },
};

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

    // use first product image as brand image
    const img = e?.node?.images?.edges?.[0]?.node?.url;
    if (img && !brandMap[vendor].imageUrl) {
      brandMap[vendor].imageUrl = img;
    }
  });

  const brands: BrandData[] = Object.values(brandMap);

  // ⭐ Brand Schema ⭐
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Brand",
    name: "Factory Mall Brands",
    url: "https://www.factorymall.pk/brands",
    description:
      "Shop top brands in fashion, fragrances, and lifestyle at Factory Mall.",
  };

  return (
    <div className="app-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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

        <BrandsGridClient initialBrands={brands} />
      </main>
    </div>
  );
}
