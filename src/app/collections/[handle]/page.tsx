import ProductCard, { ProductCardProps } from "@/components/ProductCard";
import { shopifyFetch } from "@/lib/shopify";
import { COLLECTION_BY_HANDLE } from "@/lib/queries";

export const metadata = {
  title: "Collections | Factory Mall",
  description: "Explore products from curated collections.",
};

export default async function CollectionPage({ params }: { params: { handle: string } }) {
  const { handle } = params;

  const response = await shopifyFetch<any>(COLLECTION_BY_HANDLE, { handle }, 60);

  const collection = response?.data?.collection;
  const productsEdges = collection?.products?.edges ?? [];

  if (!collection) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-xl font-semibold">Collection not found</h1>
      </div>
    );
  }

  const products: ProductCardProps[] = productsEdges.map((edge: any) => {
    const n = edge.node;

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
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Collection Title */}
      <h1 className="text-2xl font-semibold mb-6">{collection.title}</h1>

      {/* Optional Description */}
      {collection.description && (
        <p className="text-gray-600 mb-6 max-w-2xl">{collection.description}</p>
      )}

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.handle} {...p} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mt-6">No products found in this collection.</p>
      )}
    </div>
  );
}
