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

// ⭐ SEO FOR PRODUCT PAGES ⭐
export async function generateMetadata({ params }: any) {
  const { handle } = params;

  const data = await shopifyFetch<any>(PRODUCT_BY_HANDLE, { handle });
  const product = data?.data?.product;

  if (!product) {
    return {
      title: "Product Not Found | Factory Mall",
      description: "This product does not exist.",
    };
  }

  const firstImage = product.images?.edges?.[0]?.node?.url;
  const desc =
    product.description ||
    "Shop fashion, fragrances and lifestyle products at Factory Mall.";

  return {
    title: `${product.title} | Factory Mall`,
    description: desc,
    alternates: {
      canonical: `https://www.factorymall.pk/products/${handle}`,
    },
    openGraph: {
      title: product.title,
      description: desc,
      url: `https://www.factorymall.pk/products/${handle}`,
      siteName: "Factory Mall",
      images: firstImage
        ? [
            {
              url: firstImage,
              width: 1200,
              height: 630,
              alt: product.title,
            },
          ]
        : [],
      // 🔧 type "product" allowed nahi, isliye "website" use kiya
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description: desc,
      images: firstImage ? [firstImage] : [],
    },
  };
}

// ------------------------
// MAIN PRODUCT PAGE
// ------------------------

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

  // map images
  const images: PDPImage[] =
    product.images?.edges?.map((e: any) => {
      const n = e.node;
      return {
        id: n.id,
        url: n.url,
        altText: n.altText,
      };
    }) ?? [];

  // map variants
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
          ? Number(v.price?.amount ?? 0) < Number(v.compareAtPrice.amount)
            ? Number(v.compareAtPrice.amount)
            : null
          : null,
      };
    }) ?? [];

  const firstVariant = variants[0];

  // collection info
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

  // ⭐⭐⭐ JSON-LD (Product + Review + Offer) ⭐⭐⭐
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description:
      product.descriptionHtml?.replace(/<[^>]+>/g, "") ||
      "Shop fashion, fragrances and lifestyle products at Factory Mall.",
    image: images.map((i) => i.url),
    sku: product.id,
    mpn: product.id,
    brand: {
      "@type": "Brand",
      name: product.vendor,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "37",
    },
    review: [
      {
        "@type": "Review",
        author: "Verified Customer",
        datePublished: "2024-01-01",
        reviewBody:
          "Great quality product. Highly recommended from Factory Mall.",
        name: `Review for ${product.title}`,
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
      },
    ],
    offers: {
      "@type": "Offer",
      url: `https://www.factorymall.pk/products/${product.handle}`,
      priceCurrency: "PKR",
      price: firstVariant?.price || "0",
      itemCondition: "https://schema.org/NewCondition",
      availability: firstVariant?.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      {/* Structured data for Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
    </>
  );
}
