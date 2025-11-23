import ProductCard from "@/components/ProductCard";
import { shopifyFetch } from "@/lib/shopify";
import { HOME_PRODUCTS } from "@/lib/queries";

export default async function HomeProductsSection({
  sectionTitle,
  queryType,
}: {
  sectionTitle: string;
  queryType: "trending" | "new" | "best";
}) {
  const res = await shopifyFetch<any>(HOME_PRODUCTS, {});
  const edges = res?.data?.products?.edges ?? [];

  let products = edges.map((e: any) => {
    const n = e.node;

    const firstImage = n.images?.edges?.[0]?.node ?? null;
    const secondImage = n.images?.edges?.[1]?.node ?? null;

    const firstVariant = n.variants?.edges?.[0]?.node ?? null;

    const price = firstVariant?.price?.amount
      ? Number(firstVariant.price.amount)
      : 0;

    const compareAtPrice =
      firstVariant?.compareAtPrice?.amount != null
        ? Number(firstVariant.compareAtPrice.amount)
        : null;

    return {
      handle: n.handle,
      title: n.title,
      vendor: n.vendor,
      image: firstImage,
      hoverImage: secondImage,
      price,
      compareAtPrice,
      variantId: firstVariant?.id ?? null,
      variantTitle: firstVariant?.title ?? null,
    };
  });

  // Future logic
  if (queryType === "trending") products = products.slice(0, 8);
  if (queryType === "new") products = products.slice(0, 8);
  if (queryType === "best") products = products.slice(0, 8);

  return (
    <section className="home-section">
      <h2 className="home-section-title">{sectionTitle}</h2>

      <div className="product-grid">
        {products?.map((p: any) => (
          <ProductCard key={p.handle} {...p} />
        ))}
      </div>
    </section>
  );
}
