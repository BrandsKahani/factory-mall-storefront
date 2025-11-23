import { shopifyFetch } from "@/lib/shopify";

export async function POST(req: Request) {
  try {
    const { lines } = await req.json();

    // STEP 1 — create an empty cart
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
      return Response.json({ ok: false, message: "Cart creation failed" });
    }

    // STEP 2 — add line items (Shopify generates REAL checkoutUrl here)
    const addRes = await shopifyFetch<any>(`
      mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            id
            checkoutUrl
          }
        }
      }
    `, { cartId, lines });

    const cart = addRes?.data?.cartLinesAdd?.cart;

    if (!cart) {
      return Response.json({ ok: false, message: "Adding lines failed" });
    }

    // STEP 3 — force correct Shopify checkout domain (safety)
    const checkoutUrl = cart.checkoutUrl.replace(
      "factorymall.pk",
      "ut3g5g-i6.myshopify.com"
    );

    return Response.json({
      ok: true,
      cart: { id: cart.id, checkoutUrl }
    });

  } catch (err) {
    return Response.json({ ok: false, error: err });
  }
}
