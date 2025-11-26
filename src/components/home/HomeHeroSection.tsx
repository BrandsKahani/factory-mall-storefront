// src/components/home/HomeHeroSection.tsx
import { shopifyFetch } from "@/lib/shopify";
import { HOME_HERO_BANNERS } from "@/lib/queries";
import HomeHero, { type HeroBanner } from "./HomeHero";

type MetaobjectField = {
  key: string;
  value: string | null;
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

export default async function HomeHeroSection() {
  try {
    const data = await shopifyFetch<ShopifyResponse>(
      HOME_HERO_BANNERS,
      {},
      60
    );

    const edges = data?.data?.metaobjects?.edges ?? [];

    const banners: HeroBanner[] =
      edges
        .map(({ node }) => {
          const fields = node.fields ?? [];

          let desktop = "";
          let mobile = "";
          let alt = "";
          let link = "";

          for (const f of fields) {
            if (f.key === "desktop_image") desktop = f.value ?? "";
            if (f.key === "mobile_image") mobile = f.value ?? "";
            if (f.key === "alt") alt = f.value ?? "";
            if (f.key === "link") link = f.value ?? "";
          }

          if (!desktop) return null;

          const banner: HeroBanner = {
            id: node.id,
            imageUrl: desktop,
            mobileImageUrl: mobile || null,
            alt: alt || null,
            linkUrl: link || null,
          };

          return banner;
        })
        .filter(Boolean) as HeroBanner[];

    // Agar Shopify se kuch na mile to fallback
    if (!banners.length) {
      const fallback: HeroBanner[] = [
        {
          id: "fallback-1",
          imageUrl: "/banners/banner1.webp",
          mobileImageUrl: "/banners/banner1-mobile.webp",
          alt: "Factory Mall Hero",
          linkUrl: "/collections/women-clothing",
        },
      ];
      return <HomeHero banners={fallback} />;
    }

    return <HomeHero banners={banners} />;
  } catch (err) {
    console.error("HomeHeroSection error", err);
    return null;
  }
}
