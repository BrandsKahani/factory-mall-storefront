// src/app/api/cart/route.ts
import { shopifyFetch } from "@/lib/shopify";

// agar future me domain change karo to sirf yahan update karna
const SHOPIFY_CHECKOUT_DOMAIN = "ut3g5g-i6.myshopify.com";

export async function POST(req: Request) {
  try {
    const { lines } = await req.json();

    if (!Array.isArray(lines) || lines.length === 0) {
      return Response.json(
        { ok: false, message: "No cart lines provided" },
        { status: 400 }
      );
    }

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
    const userErrors = result?.data?.cartCreate?.userErrors;

    if (!cart) {
      console.error("Shopify cartCreate error", userErrors);
      return Response.json(
        { ok: false, message: "Cart error", userErrors },
        { status: 500 }
      );
    }

    let checkoutUrl: string = cart.checkoutUrl;

    // 🔥 yahan custom domain ko hamisha myshopify.com se replace kar rahe hain
    if (checkoutUrl.includes("factorymall.pk")) {
      checkoutUrl = checkoutUrl.replace("factorymall.pk", SHOPIFY_CHECKOUT_DOMAIN);
    }

    return Response.json({
      ok: true,
      cart: {
        id: cart.id,
        checkoutUrl,
      },
    });
  } catch (err) {
    console.error("Cart route error", err);
    return Response.json(
      { ok: false, message: "Server error creating cart" },
      { status: 500 }
    );
  }
}
