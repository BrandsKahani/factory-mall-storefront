// src/app/collections/[handle]/page.tsx
import Sidebar from "@/components/SidebarNav";
import ProductCard, {
  ProductCardProps,
} from "@/components/ProductCard";
import { shopifyFetch } from "@/lib/shopify";
import { COLLECTION_BY_HANDLE } from "@/lib/queries";

type PageProps = {
  params: { handle: string };
};

export default async function CollectionPage({ params }: PageProps) {
  const data = await shopifyFetch<any>(
    COLLECTION_BY_HANDLE,
    { handle: params.handle },
    120
  );

  const c = data?.data?.collection;

  if (!c) {
    return (
      <div className="app-shell">
        <Sidebar />
        <main className="app-main">
          <div className="max-w-6xl mx-auto px-4 py-10 text-sm text-gray-500">
            Collection not found.
          </div>
        </main>
      </div>
    );
  }

  const products: ProductCardProps[] =
    (c.products?.edges ?? []).map((e: any) => {
      const n = e.node;
      const firstImage = n.images?.edges?.[0]?.node ?? null;
      const secondImage = n.images?.edges?.[1]?.node ?? null;
      const firstVariant = n.variants?.edges?.[0]?.node;

      const price = Number(firstVariant?.price?.amount ?? 0);
      const compareAt = firstVariant?.compareAtPrice?.amount
        ? Number(firstVariant.compareAtPrice.amount)
        : null;

      return {
        handle: n.handle,
        title: n.title,
        vendor: n.vendor,
        image: firstImage,
        hoverImage: secondImage,
        price,
        compareAtPrice: compareAt,
      };
    }) ?? [];

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="app-main">
        <section className="home-section">
          <h1 className="home-section-title mb-2">{c.title}</h1>
          {c.description && (
            <p className="text-sm text-gray-500 mb-4">{c.description}</p>
          )}

          <div className="product-grid">
            {products.map((p) => (
              <ProductCard key={p.handle} {...p} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
