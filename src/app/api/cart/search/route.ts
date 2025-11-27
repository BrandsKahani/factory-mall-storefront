import { NextResponse } from "next/server";
import { shopifyFetch } from "@/lib/shopify";
import { SEARCH_PRODUCTS } from "@/lib/queries";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() || "";

  if (!q) {
    return NextResponse.json({ ok: true, products: [] });
  }

  try {
    const data = await shopifyFetch<any>(SEARCH_PRODUCTS, { query: q }, 10);

    const edges = data?.data?.products?.edges ?? [];
    const products = edges.map((e: any) => {
      const n = e.node;
      const firstImage = n.images?.edges?.[0]?.node ?? null;
      const firstVariant = n.variants?.edges?.[0]?.node ?? null;

      return {
        handle: n.handle,
        title: n.title,
        vendor: n.vendor,
        imageUrl: firstImage?.url ?? null,
        price: firstVariant?.price?.amount
          ? Number(firstVariant.price.amount)
          : null,
      };
    });

    return NextResponse.json({ ok: true, products });
  } catch (e) {
    console.error("Search API error", e);
    return NextResponse.json({ ok: false, products: [] }, { status: 500 });
  }
}
