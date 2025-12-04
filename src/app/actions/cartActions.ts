// src/app/actions/cartActions.ts
"use server";

import { cookies } from "next/headers";
import { shopifyFetch } from "@/lib/shopify";
import { CART_CREATE, CART_LINES_ADD } from "@/lib/queries";

const CART_COOKIE_NAME = "sfy_cart_id";

// -----------------------------------------------------
// 1) Cart ID lao ya naya banao
// -----------------------------------------------------
async function getOrCreateCartId(): Promise<string> {
  const cookieStore = cookies();

  // pehle existing cookie check
  const existing = cookieStore.get(CART_COOKIE_NAME)?.value;
  if (existing) {
    return existing;
  }

  // naya cart create karo
  const data = await shopifyFetch<any>(CART_CREATE, {
    // CART_CREATE ke GraphQL me variable ka naam $lines hai
    lines: [],
  });

  const createdCart = data?.data?.cartCreate?.cart;
  if (!createdCart?.id) {
    throw new Error("Unable to create Shopify cart");
  }

  const cartId = createdCart.id;

  // cookie set karo
  cookieStore.set({
    name: CART_COOKIE_NAME,
    value: cartId,
    path: "/", // har page pe available
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return cartId;
}

// -----------------------------------------------------
// 2) Server Action: Add to Cart
// -----------------------------------------------------
export async function addToCartAction(variantId: string, quantity: number) {
  const cartId = await getOrCreateCartId();

  const result = await shopifyFetch<any>(CART_LINES_ADD, {
    cartId,
    lines: [
      {
        merchandiseId: variantId,
        quantity,
      },
    ],
  });

  // updated cart return karo (optional)
  return result?.data?.cartLinesAdd?.cart ?? null;
}
