// src/app/api/cart/route.ts
import { NextResponse } from "next/server";

const SHOPIFY_STOREFRONT_ENDPOINT = process.env.SHOPIFY_STOREFRONT_ENDPOINT!;
const SHOPIFY_STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN!;

// Shopify GraphQL helper
async function shopifyGraphql(query: string, variables: any) {
  const res = await fetch(SHOPIFY_STOREFRONT_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    console.error(await res.text());
    throw new Error("Shopify GraphQL error");
  }

  return res.json();
}

// sirf cartCreate mutation
const CART_CREATE = /* GraphQL */ `
  mutation CartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        id
        checkoutUrl
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { lines } = body as {
      lines: { merchandiseId: string; quantity: number }[];
    };

    const result = await shopifyGraphql(CART_CREATE, {
      lines,
    });

    const data = result?.data?.cartCreate;

    if (data?.userErrors?.length) {
      console.error("CartCreate errors", data.userErrors);
      return NextResponse.json(
        { ok: false, errors: data.userErrors },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      cart: data.cart,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 }
    );
  }
}
