// src/components/home/HomeHeroSection.tsx
import { shopifyFetch } from "@/lib/shopify";
import { HOME_HERO_BANNERS } from "@/lib/queries";
import HomeHero, { HeroBanner } from "./HomeHero";

type MetaobjectField = {
  key: string;
  value?: string | null;
  reference?: {
    image?: {
      url: string;
      altText?: string | null;
    } | null;
  } | null;
};

type MetaobjectNode = {
  id: string;
  fields: MetaobjectField[];
};

function mapMetaobjectToBanner(node: MetaobjectNode): HeroBanner | null {
  const fields = node?.fields ?? [];

  let desktopUrl: string | null = null;
  let desktopAlt: string | null = null;
  let mobileUrl: string | null = null;
  let mobileAlt: string | null = null;
  let linkUrl: string | null = null;
  let title: string | null = null;

  for (const f of fields) {
    if (f.key === "desktop_image" && f.reference?.image?.url) {
      desktopUrl = f.reference.image.url;
      desktopAlt = f.reference.image.altText ?? null;
    }
    if (f.key === "mobile_image" && f.reference?.image?.url) {
      mobileUrl = f.reference.image.url;
      mobileAlt = f.reference.image.altText ?? null;
    }
    if (f.key === "link_url") {
      linkUrl = f.value || null;
    }
    if (f.key === "title") {
      title = f.value || null;
    }
  }

  // agar desktop image hi nahi, to skip
  if (!desktopUrl) return null;

  return {
    id: node.id,
    desktopUrl,
    mobileUrl,
    altText: mobileAlt || desktopAlt || title || null,
    linkUrl,
  };
}

export default async function HomeHeroSection() {
  try {
    const data = await shopifyFetch<any>(HOME_HERO_BANNERS, {}, 60);

    const edges = data?.data?.metaobjects?.edges ?? [];
    const banners: HeroBanner[] = edges
      .map((e: any) => mapMetaobjectToBanner(e.node))
      .filter(Boolean) as HeroBanner[];

    // agar Shopify se kuch na mila to purana local fallback
    if (!banners.length) {
      const fallback: HeroBanner[] = [
        {
          id: "fallback-1",
          desktopUrl: "/banners/banner1.webp",
          mobileUrl: "/banners/banner1.webp",
          altText: "Factory Mall banner 1",
        },
        {
          id: "fallback-2",
          desktopUrl: "/banners/banner2.webp",
          mobileUrl: "/banners/banner2.webp",
          altText: "Factory Mall banner 2",
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
