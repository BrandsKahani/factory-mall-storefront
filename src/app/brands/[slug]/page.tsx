// src/app/brands/[slug]/page.tsx
import Sidebar from "@/components/SidebarNav";
import ProductCard from "@/components/ProductCard";
import { shopifyFetch } from "@/lib/shopify";
import { BRAND_PRODUCTS_SOURCE } from "@/lib/queries";

type PageProps = {
  params: {
    slug: string;
  };
};

// helper: brand name -> slug (same logic as brands listing)
function slugifyBrand(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default async function BrandPage({ params }: PageProps) {
  const { slug } = params;

  // 1) saare products fetch (BRAND_PRODUCTS_SOURCE)
  const res = await shopifyFetch<any>(BRAND_PRODUCTS_SOURCE, {});
  const edges: any[] = res?.data?.products?.edges ?? [];

  // 2) unique vendors list
  const vendors: string[] = edges
    .map((e: any) => (e?.node?.vendor || "").trim())
    .filter((v: string, i: number, arr: string[]) => v && arr.indexOf(v) === i);

  // 3) URL slug se vendor match
  const matchedVendor =
    vendors.find((v: string) => slugifyBrand(v) === slug) || null;

  // 4) agar vendor hi nahi mila
  if (!matchedVendor) {
    return (
      <div className="app-shell">
        <aside className="sidebar-nav">
          <Sidebar />
        </aside>

        <main className="app-main">
          <h1 className="brands-title">Brand not found</h1>
          <p className="brands-subtitle">
            Sorry, we couldn&apos;t find this brand. Please go back to the
            brands page.
          </p>
        </main>
      </div>
    );
  }

  // 5) sirf is vendor ke products
  const brandProducts = edges
    .filter((e: any) => {
      const vendor = (e?.node?.vendor || "").trim();
      return vendor.toLowerCase() === matchedVendor.toLowerCase();
    })
    .map((e: any) => e.node);

  const productCount = brandProducts.length;

  return (
    <div className="app-shell">
      {/* LEFT: sidebar (same as home/brands) */}
      <aside className="sidebar-nav">
        <Sidebar />
      </aside>

      {/* RIGHT: brand detail + products */}
      <main className="app-main">
        {/* Header / breadcrumb style */}
        <section style={{ marginBottom: "1.5rem" }}>
          <p
            style={{
              fontSize: "0.8rem",
              color: "#6b7280",
              marginBottom: "0.25rem",
            }}
          >
            <a href="/">Home</a> / <a href="/brands">Brands</a> /{" "}
            <span>{matchedVendor}</span>
          </p>

          <h1 className="brands-title" style={{ marginBottom: "0.25rem" }}>
            {matchedVendor}
          </h1>
          <p className="brands-subtitle">
            Showing {productCount} product{productCount === 1 ? "" : "s"} from{" "}
            {matchedVendor}.
          </p>
        </section>

        {/* Products grid */}
        {productCount === 0 ? (
          <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>
            No products available for this brand yet.
          </p>
        ) : (
          <section>
            <div className="product-grid">
              {brandProducts.map((p: any) => {
                const firstImage = p?.images?.edges?.[0]?.node ?? null;
                const hoverImage = p?.images?.edges?.[1]?.node ?? null;
                const firstVariant = p?.variants?.edges?.[0]?.node ?? null;

                const price = firstVariant
                  ? Number(firstVariant.price.amount)
                  : 0;

                const compareAtPrice =
                  firstVariant?.compareAtPrice?.amount != null
                    ? Number(firstVariant.compareAtPrice.amount)
                    : null;

                return (
                  <ProductCard
                    key={p.id}
                    handle={p.handle}
                    title={p.title}
                    vendor={p.vendor}
                    image={firstImage}
                    hoverImage={hoverImage}
                    price={price}
                    compareAtPrice={compareAtPrice}
                  />
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
