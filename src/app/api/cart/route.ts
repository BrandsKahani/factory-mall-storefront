// src/app/api/cart/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { shopifyFetch } from "@/lib/shopify";
import { CART_CREATE, CART_LINES_ADD } from "@/lib/queries";

const CART_COOKIE = "sf_cart_id";
const SHOPIFY_CHECKOUT_DOMAIN = "ut3g5g-i6.myshopify.com";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const lines = body?.lines;

    if (!Array.isArray(lines) || lines.length === 0) {
      return NextResponse.json(
        { ok: false, error: "No cart lines provided" },
        { status: 400 }
      );
    }

    const cookieStore = cookies();
    const existingCartId = cookieStore.get(CART_COOKIE)?.value;

    let cart: any = null;

    if (!existingCartId) {
      // 🧺 First time: create new cart with these lines
      const result = await shopifyFetch<any>(CART_CREATE, { lines });
      cart = result?.data?.cartCreate?.cart;

      if (cart?.id) {
        cookieStore.set(CART_COOKIE, cart.id, {
          httpOnly: true,
          path: "/",
          secure: true,
        });
      }
    } else {
      // ➕ Cart already exists: add lines into same cart
      const result = await shopifyFetch<any>(CART_LINES_ADD, {
        cartId: existingCartId,
        lines,
      });

      cart = result?.data?.cartLinesAdd?.cart;

      // agar kisi reason se cart null aa gaya ho to fallback: new cart banao
      if (!cart?.id) {
        const fallback = await shopifyFetch<any>(CART_CREATE, { lines });
        cart = fallback?.data?.cartCreate?.cart;
        if (cart?.id) {
          cookieStore.set(CART_COOKIE, cart.id, {
            httpOnly: true,
            path: "/",
            secure: true,
          });
        }
      }
    }

    if (!cart?.checkoutUrl) {
      return NextResponse.json(
        { ok: false, error: "No checkout URL returned from Shopify" },
        { status: 500 }
      );
    }

    // optional: primary domain ko myshopify domain se replace karna
    let checkoutUrl: string = cart.checkoutUrl;
    checkoutUrl = checkoutUrl.replace(
      "factorymall.pk",
      SHOPIFY_CHECKOUT_DOMAIN
    );

    return NextResponse.json({
      ok: true,
      cart: {
        id: cart.id,
        checkoutUrl,
        totalQuantity: cart.totalQuantity,
      },
    });
  } catch (e) {
    console.error("Cart API error", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
