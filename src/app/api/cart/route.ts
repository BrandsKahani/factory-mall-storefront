// src/app/api/cart/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { shopifyFetch } from "@/lib/shopify";
import { CART_CREATE, CART_LINES_ADD } from "@/lib/queries";

const CART_COOKIE_NAME = "sfy_cart_id";

async function getOrCreateCartId() {
  const cookieStore = cookies();
  const existing = cookieStore.get(CART_COOKIE_NAME)?.value;
  if (existing) return existing;

  const data = await shopifyFetch<any>(CART_CREATE, {
    lines: [],
  });

  const cart = data?.data?.cartCreate?.cart;
  if (!cart?.id) {
    throw new Error("Failed to create cart");
  }

  const cartId = cart.id;

  cookieStore.set({
    name: CART_COOKIE_NAME,
    value: cartId,
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });

  return cartId;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const lines = body?.lines ?? [];

    if (!Array.isArray(lines) || lines.length === 0) {
      return NextResponse.json(
        { ok: false, error: "No lines to add" },
        { status: 400 }
      );
    }

    const cartId = await getOrCreateCartId();

    const data = await shopifyFetch<any>(CART_LINES_ADD, {
      cartId,
      lines,
    });

    const userErrors = data?.data?.cartLinesAdd?.userErrors;
    if (userErrors?.length) {
      console.error("Shopify cartLinesAdd errors:", userErrors);
      return NextResponse.json(
        { ok: false, error: "Shopify error", userErrors },
        { status: 400 }
      );
    }

    const cart = data?.data?.cartLinesAdd?.cart;
    return NextResponse.json({ ok: true, cart });
  } catch (err) {
    console.error("Cart API error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
