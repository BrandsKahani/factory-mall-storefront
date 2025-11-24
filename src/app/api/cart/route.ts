import { shopifyFetch } from "@/lib/shopify";

const SHOPIFY_CHECKOUT_DOMAIN = "ut3g5g-i6.myshopify.com";

export async function POST(req: Request) {
  try {
    const { lines } = await req.json();

    const result = await shopifyFetch<any>(
      `
      mutation CartCreate($lines: [CartLineInput!]!) {
        cartCreate(input: { lines: $lines }) {
          cart {
            id
            checkoutUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
      { lines }
    );

    const cart = result?.data?.cartCreate?.cart;

    if (!cart?.checkoutUrl) return Response.json({ ok: false });

    let checkoutUrl = cart.checkoutUrl.replace(
      "factorymall.pk",
      SHOPIFY_CHECKOUT_DOMAIN
    );

    return Response.json({ ok: true, cart: { id: cart.id, checkoutUrl } });
  } catch (e) {
    return Response.json({ ok: false });
  }
}
