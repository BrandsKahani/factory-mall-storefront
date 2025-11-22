// src/app/products/[handle]/addToCartAction.ts
"use server";

import { cookies } from "next/headers";
import { shopifyFetch } from "@/lib/shopify";
import { CART_CREATE, CART_LINES_ADD } from "@/lib/queries";

const CART_COOKIE = "sf_cart_id";

export async function addToCartAction(variantId: string) {
  const cookieStore = cookies();
  const existingCartId = cookieStore.get(CART_COOKIE)?.value;

  if (!existingCartId) {
    const data = await shopifyFetch<any>(CART_CREATE, {
      lines: [{ merchandiseId: variantId, quantity: 1 }],
    });

    const cart = data?.data?.cartCreate?.cart;
    if (cart?.id) {
      cookieStore.set(CART_COOKIE, cart.id, {
        httpOnly: true,
        path: "/",
        secure: true,
      });
    }

    return cart;
  } else {
    const data = await shopifyFetch<any>(CART_LINES_ADD, {
      cartId: existingCartId,
      lines: [{ merchandiseId: variantId, quantity: 1 }],
    });

    return data?.data?.cartLinesAdd?.cart;
  }
}
