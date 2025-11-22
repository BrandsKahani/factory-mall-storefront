// src/lib/shopify.ts

export async function shopifyFetch<T>(
  query: string,
  variables: Record<string, any> = {},
  cacheSeconds = 60
): Promise<T> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const version = process.env.SHOPIFY_STOREFRONT_API_VERSION;
  const token = process.env.SHOPIFY_STOREFRONT_API_TOKEN;

  if (!domain || !version || !token) {
    throw new Error(
      "Missing Shopify env vars. Check SHOPIFY_STORE_DOMAIN, SHOPIFY_STOREFRONT_API_VERSION, SHOPIFY_STOREFRONT_API_TOKEN."
    );
  }

  const endpoint = `https://${domain}/api/${version}/graphql.json`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: cacheSeconds },
  });

  const text = await res.text();
  console.log("SHOPIFY STATUS ===", res.status);
  console.log("SHOPIFY RAW BODY ===", text);

  if (!res.ok) {
    throw new Error(`Shopify HTTP error ${res.status}: ${text}`);
  }

  return JSON.parse(text);
}
