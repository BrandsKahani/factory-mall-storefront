import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.factorymall.pk";

  // Fetch products from Shopify
  const productsData = await fetch(
    "https://YOUR_SHOPIFY_STORE.myshopify.com/api/2023-10/graphql.json",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": "YOUR_ACCESS_TOKEN",
      },
      body: JSON.stringify({
        query: `
        {
          products(first: 250) {
            edges {
              node {
                handle
                updatedAt
              }
            }
          }
        }
        `,
      }),
    }
  ).then((res) => res.json());

  const productRoutes =
    productsData?.data?.products?.edges?.map((edge: any) => ({
      url: `${baseUrl}/products/${edge.node.handle}`,
      lastModified: edge.node.updatedAt,
    })) || [];

  // Static Pages
  const staticRoutes = ["", "/collections", "/brands", "/wishlist"].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date().toISOString(),
    })
  );

  return [...staticRoutes, ...productRoutes];
}
