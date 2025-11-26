// src/components/home/HomeHeroSection.tsx

import { shopifyFetch } from "@/lib/shopify";
import { HOME_HERO_BANNERS } from "@/lib/queries";
import HomeHero, { type HeroBanner } from "./HomeHero";

// ------------------ TYPES ------------------

type MediaImageRef = {
  image: {
    url: string;
    altText?: string | null;
  };
};

type MetaobjectField = {
  key: string;
  value: string | null;
  reference?: MediaImageRef | null;
};

type MetaobjectNode = {
  id: string;
  fields: MetaobjectField[];
};

type ShopifyResponse = {
  data?: {
    metaobjects?: {
      edges: { node: MetaobjectNode }[];
    };
  };
};

// ------------------ COMPONENT ------------------

export default async function HomeHeroSection() {
  try {
    // Fetch from Shopify with proper type
    const res = await shopifyFetch<ShopifyResponse>(
      HOME_HERO_BANNERS,
      {},
      60
    );

    const edges = res?.data?.metaobjects?.edges || [];

    // Transform Shopify → HeroBanner
    const banners: HeroBanner[] = edges
      .map(({ node }) => {
        let img = "";
        let mobile = "";
        let alt = "";
        let link = "";

        for (const f of node.fields) {
          if (f.key === "desktop_image") {
            img = f?.reference?.image?.url || f.value || "";
            alt = f?.reference?.image?.altText || alt;
          }

          if (f.key === "mobile_image") {
            mobile = f?.reference?.image?.url || f.value || "";
          }

          if (f.key === "link_url") {
            link = f.value || "";
          }

          if (f.key === "display_name") {
            alt = f.value || alt; // display_name used as ALT text fallback
          }
        }

        if (!img) return null;

        return {
          id: node.id,
          imageUrl: img,
          mobileImageUrl: mobile || null,
          alt: alt || "Banner",
          linkUrl: link || "#",
        };
      })
      .filter(Boolean) as HeroBanner[];

    return <HomeHero banners={banners} />;
  } catch (error) {
    console.error("HomeHeroSection error:", error);
    return null;
  }
}
