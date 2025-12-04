// src/components/home/HomeProductsSection.tsx
import ProductCard, { ProductCardProps } from "@/components/ProductCard";
import { shopifyFetch } from "@/lib/shopify";
import { HOME_SECTION_COLLECTION } from "@/lib/queries";

type Props = {
  sectionTitle: string;
  collectionHandle: string;      // Shopify collection handle
  limit?: number;                // default 8
  showViewAllLink?: boolean;     // default true
};

export default async function HomeProductsSection({
  sectionTitle,
  collectionHandle,
  limit = 8,
  showViewAllLink = true,
}: Props) {
  const data = await shopifyFetch<any>(HOME_SECTION_COLLECTION, {
    handle: collectionHandle,
    count: limit,
  });

  const collection = data?.data?.collection;
  const edges = collection?.products?.edges ?? [];

  if (!collection || !edges.length) {
    // agar collection empty ho to section hide
    return null;
  }

  const products: ProductCardProps[] = edges.map((e: any) => {
    const n = e.node;

    const firstImage = n.images?.edges?.[0]?.node ?? null;
    const secondImage = n.images?.edges?.[1]?.node ?? null;
    const firstVariant = n.variants?.edges?.[0]?.node ?? null;

    return {
      handle: n.handle,
      title: n.title,
      vendor: n.vendor,
      image: firstImage ?? undefined,
      hoverImage: secondImage ?? undefined,
      price: Number(firstVariant?.price?.amount ?? 0),
      compareAtPrice: firstVariant?.compareAtPrice?.amount
        ? Number(firstVariant.compareAtPrice.amount)
        : null,
      variantId: firstVariant?.id ?? null,
      variantTitle: firstVariant?.title ?? null,
    };
  });

  return (
    <section className="home-section">
      <div className="home-section-header">
        <h2 className="home-section-title">{sectionTitle}</h2>

        {showViewAllLink && (
          <a
            href={`/collections/${collectionHandle}`}
            className="home-section-link"
          >
            View all
          </a>
        )}
      </div>

      <div className="product-grid">
        {products.map((p) => (
          <ProductCard key={p.handle} {...p} />
        ))}
      </div>
    </section>
  );
}
