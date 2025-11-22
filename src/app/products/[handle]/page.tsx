// src/app/products/[handle]/page.tsx
import { notFound } from "next/navigation";
import Sidebar from "@/components/SidebarNav";
import ProductDetailClient, {
  PDPImage,
  PDPVariant,
  ProductForPDP,
} from "@/components/ProductDetailClient";
import { shopifyFetch } from "@/lib/shopify";
import { PRODUCT_BY_HANDLE } from "@/lib/queries";

type PageProps = {
  params: { handle: string };
};

export default async function ProductPage({ params }: PageProps) {
  const { handle } = params;

  const data = await shopifyFetch<any>(PRODUCT_BY_HANDLE, {
    handle,
  });

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

  // variants map (safe)
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

  const productForClient: ProductForPDP = {
    id: product.id,
    handle: product.handle,
    title: product.title,
    vendor: product.vendor,
    descriptionHtml: product.descriptionHtml,
    images,
    variants,
    collection: null, // agar baad me collection query add karni ho to yahan bharo
  };

  return (
    <div className="app-shell">
      {/* LEFT: sidebar (same as home) */}
      <aside className="sidebar-nav">
        <Sidebar />
      </aside>

      {/* RIGHT: PDP */}
      <main className="app-main">
        <ProductDetailClient product={productForClient} />
      </main>
    </div>
  );
}
