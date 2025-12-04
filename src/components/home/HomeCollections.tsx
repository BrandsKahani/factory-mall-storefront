// src/components/home/HomeCollections.tsx
import { shopifyFetch } from "@/lib/shopify";
import { COLLECTION_SLIDER_BY_KEY } from "@/lib/queries";
import HomeCollectionsSlider, {
  CollectionTile,
} from "./HomeCollectionsSlider";

type Props = {
  metafieldKey?: string;   // kis slider ko load karna hai
  sectionTitle?: string;   // upar ka heading
};

// metaobject → CollectionTile mapping
function mapMetaobjectToTile(meta: any): CollectionTile | null {
  const fields = meta?.fields ?? [];

  let customTitle = "";
  let collectionHandle = "";
  let collectionTitle = "";
  let collectionImage: { url: string | null; altText: string | null } = {
    url: null,
    altText: null,
  };
  let customImageUrl: string | null = null;

  for (const f of fields) {
    if (f.key === "title") {
      customTitle = f.value || "";
    }

    if (f.key === "collection") {
      const col = f.reference;
      if (col) {
        collectionHandle = col.handle;
        collectionTitle = col.title;
        collectionImage = {
          url: col.image?.url ?? null,
          altText: col.image?.altText ?? null,
        };
      }
    }

    if (f.key === "image") {
      const img = f.reference?.image;
      if (img?.url) {
        customImageUrl = img.url;
      }
    }
  }

  // agar collection hi nahi mila to ignore
  if (!collectionHandle) return null;

  const title = customTitle || collectionTitle || "Collection";
  const link = `/collections/${collectionHandle}`;
  const imageUrl = customImageUrl || collectionImage.url;

  return { title, link, imageUrl };
}

export default async function HomeCollections({
  metafieldKey = "collection_slider_home",
  sectionTitle = "Shop by Collection",
}: Props) {
  const data = await shopifyFetch<any>(COLLECTION_SLIDER_BY_KEY, {
    key: metafieldKey,
  });

  const edges =
    data?.data?.shop?.metafield?.references?.edges ?? [];

  const items: CollectionTile[] = edges
    .map((e: any) => mapMetaobjectToTile(e?.node))
    .filter(Boolean) as CollectionTile[];

  if (!items.length) return null;

  return (
    <section className="home-collections">
      <div className="home-collections-header">
        <h2 className="home-section-title">{sectionTitle}</h2>
      </div>

      <HomeCollectionsSlider items={items} />
    </section>
  );
}
