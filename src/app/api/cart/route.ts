// src/app/api/cart/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { shopifyFetch } from "@/lib/shopify";
import { CART_CREATE, CART_LINES_ADD } from "@/lib/queries";

const CART_COOKIE_NAME = "sfy_cart_id";

// --- Helper: normalize checkout URL to always use myshopify domain ---
function normalizeCheckoutUrl(raw?: string | null): string | null {
  if (!raw) return null;

  try {
    const url = new URL(raw);

    // Shopify Storefront domain -> env se lo
    const storeDomain =
      process.env.SHOPIFY_STORE_DOMAIN ||
      process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;

    if (storeDomain) {
      const hostname = storeDomain.replace(/^https?:\/\//, "");
      url.hostname = hostname;
    }

    return url.toString();
  } catch {
    return raw;
  }
}

// --- POST /api/cart ---
// Body: { lines: [{ merchandiseId: string, quantity: number }] }
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const lines = Array.isArray(body?.lines) ? body.lines : [];

    if (lines.length === 0) {
      return NextResponse.json(
        { ok: false, error: "No lines provided" },
        { status: 400 }
      );
    }

    const cookieStore = cookies();
    const existingCartId = cookieStore.get(CART_COOKIE_NAME)?.value;

    let cartResult: any;

    if (!existingCartId) {
      // -------- 1) NAYA CART CREATE ----------
      const data = await shopifyFetch<any>(CART_CREATE, {
        lines,
      });

      const cart = data?.data?.cartCreate?.cart;
      const userErrors = data?.data?.cartCreate?.userErrors;

      if (!cart?.id || (userErrors && userErrors.length > 0)) {
        console.error("Shopify cartCreate errors:", userErrors);
        return NextResponse.json(
          { ok: false, error: "Unable to create cart" },
          { status: 500 }
        );
      }

      // cart id cookie set karo
      cookieStore.set({
        name: CART_COOKIE_NAME,
        value: cart.id,
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });

      cartResult = cart;
    } else {
      // -------- 2) EXISTING CART ME LINES ADD ----------
      const data = await shopifyFetch<any>(CART_LINES_ADD, {
        cartId: existingCartId,
        lines,
      });

      const cart = data?.data?.cartLinesAdd?.cart;
      const userErrors = data?.data?.cartLinesAdd?.userErrors;

      if (!cart?.id || (userErrors && userErrors.length > 0)) {
        console.error("Shopify cartLinesAdd errors:", userErrors);
        return NextResponse.json(
          { ok: false, error: "Unable to add lines to cart" },
          { status: 500 }
        );
      }

      cartResult = cart;
    }

    const normalizedCheckoutUrl = normalizeCheckoutUrl(cartResult.checkoutUrl);

    const responseCart = {
      id: cartResult.id,
      checkoutUrl: normalizedCheckoutUrl,
      totalQuantity: cartResult.totalQuantity,
    };

    return NextResponse.json({ ok: true, cart: responseCart });
  } catch (err) {
    console.error("Cart API error:", err);
    return NextResponse.json(
      { ok: false, error: "Unexpected error" },
      { status: 500 }
    );
  }
}
