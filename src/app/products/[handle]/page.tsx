import { notFound } from "next/navigation";
import Sidebar from "@/components/SidebarNav";
import ProductDetailClient, {
  PDPImage,
  PDPVariant,
  ProductForPDP,
} from "@/components/ProductDetailClient";
import RecentlyViewedClient from "@/components/RecentlyViewedClient";
import { shopifyFetch } from "@/lib/shopify";
import { PRODUCT_BY_HANDLE } from "@/lib/queries";

type PageProps = {
  params: { handle: string };
};

export default async function ProductPage({ params }: PageProps) {
  const { handle } = params;

  const data = await shopifyFetch<any>(PRODUCT_BY_HANDLE, { handle });
  const product = data?.data?.product;

  if (!product) {
    notFound();
  }

  // images map
  const images: PDPImage[] =
    product.images?.edges?.map((e: any) => {
      const n = e.node;
      return {
        id: n.id,
        url: n.url,
        altText: n.altText,
      };
    }) ?? [];

  // variants map
  const variants: PDPVariant[] =
    product.variants?.edges?.map((e: any) => {
      const v = e.node;
      return {
        id: v.id,
        title: v.title,
        availableForSale: v.availableForSale,
        quantityAvailable: v.quantityAvailable ?? null,
        selectedOptions: v.selectedOptions ?? [],
        price: Number(v.price?.amount ?? 0),
        compareAtPrice: v.compareAtPrice
          ? Number(v.compareAtPrice.amount)
          : null,
      };
    }) ?? [];

  // collection breadcrumb
  let collection: ProductForPDP["collection"] = null;
  const colEdge = product.collections?.edges?.[0];
  if (colEdge?.node) {
    collection = {
      handle: colEdge.node.handle,
      title: colEdge.node.title,
    };
  }

  const productForClient: ProductForPDP = {
    id: product.id,
    handle: product.handle,
    title: product.title,
    vendor: product.vendor,
    descriptionHtml: product.descriptionHtml,
    images,
    variants,
    collection,
  };

  const firstVariant = variants[0];

  return (
    <div className="app-shell">
      <aside className="sidebar-nav">
        <Sidebar />
      </aside>

      <main className="app-main">
        <ProductDetailClient product={productForClient} />

        {firstVariant && images[0] && (
          <RecentlyViewedClient
            current={{
              handle: product.handle,
              title: product.title,
              imageUrl: images[0].url,
              price: firstVariant.price,
            }}
          />
        )}
      </main>
    </div>
  );
}
