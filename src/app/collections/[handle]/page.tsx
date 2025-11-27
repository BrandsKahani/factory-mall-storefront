// src/app/collections/[handle]/page.tsx

import Sidebar from "@/components/SidebarNav";
import ProductCard, { ProductCardProps } from "@/components/ProductCard";
import { shopifyFetch } from "@/lib/shopify";
import { COLLECTION_BY_HANDLE } from "@/lib/queries";

type PageProps = {
  params: { handle: string };
};

// ⭐ DYNAMIC SEO FOR COLLECTION PAGES ⭐
export async function generateMetadata({ params }: PageProps) {
  const { handle } = params;

  const data = await shopifyFetch<any>(
    COLLECTION_BY_HANDLE,
    { handle },
    120
  );
  const c = data?.data?.collection;

  if (!c) {
    return {
      title: "Collection Not Found | Factory Mall",
      description: "This collection does not exist.",
      alternates: {
        canonical: `https://www.factorymall.pk/collections/${handle}`,
      },
    };
  }

  return {
    title: `${c.title} | Factory Mall`,
    description:
      c.description ||
      `Discover premium ${c.title} at Factory Mall. Best prices and fast delivery.`,
    alternates: {
      canonical: `https://www.factorymall.pk/collections/${handle}`,
    },
    openGraph: {
      title: c.title,
      description:
        c.description ||
        `Explore the latest ${c.title} collection at Factory Mall.`,
      url: `https://www.factorymall.pk/collections/${handle}`,
      siteName: "Factory Mall",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: c.title,
      description:
        c.description ||
        `Shop trending ${c.title} products at Factory Mall.`,
    },
  };
}

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
    (c.products?.edges ?? []).map((e: any, index: number) => {
      const n = e.node;

      const firstImage = n.images?.edges?.[0]?.node ?? null;
      const secondImage = n.images?.edges?.[1]?.node ?? null;
      const firstVariant = n.variants?.edges?.[0]?.node ?? null;

      return {
        handle: n.handle,
        title: n.title,
        vendor: n.vendor,
        image: firstImage,
        hoverImage: secondImage,
        price: Number(firstVariant?.price?.amount ?? 0),
        compareAtPrice: firstVariant?.compareAtPrice?.amount
          ? Number(firstVariant.compareAtPrice.amount)
          : null,
        variantId: firstVariant?.id ?? null,
        variantTitle: firstVariant?.title ?? null,
      };
    }) ?? [];

  // ⭐ JSON-LD ItemList Schema ⭐ (Improves Google indexing)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: c.title,
    description: c.description,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://www.factorymall.pk/products/${p.handle}`,
    })),
  };

  return (
  <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />

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
  </>
);
}
