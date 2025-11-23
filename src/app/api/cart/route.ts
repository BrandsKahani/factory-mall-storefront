import { shopifyFetch } from "@/lib/shopify";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { lines } = await req.json();

    if (!lines || !Array.isArray(lines)) {
      return NextResponse.json({ ok: false, message: "Missing lines" });
    }

    // Step 1 — create cart
    const createRes = await shopifyFetch<any>(`
      mutation {
        cartCreate {
          cart {
            id
          }
        }
      }
    `);

    const cartId = createRes?.data?.cartCreate?.cart?.id;
    if (!cartId) {
      return NextResponse.json({ ok: false, message: "Cart creation failed" });
    }

    // Step 2 — add items
    const addRes = await shopifyFetch<any>(
      `
      mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            id
            checkoutUrl
            lines(first: 20) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      product {
                        title
                        handle
                      }
                      price {
                        amount
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
      { cartId, lines }
    );

    const cart = addRes?.data?.cartLinesAdd?.cart;
    if (!cart) {
      return NextResponse.json({ ok: false, message: "Add lines failed" });
    }

    // Fix checkout URL
    const fixedCheckoutUrl = cart.checkoutUrl.replace(
      "factorymall.pk",
      "ut3g5g-i6.myshopify.com"
    );

    return NextResponse.json({
      ok: true,
      cart: {
        ...cart,
        checkoutUrl: fixedCheckoutUrl,
      },
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err });
  }
}
