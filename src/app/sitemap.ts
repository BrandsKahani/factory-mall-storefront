import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.factorymall.pk";

  // ---- Static Pages ----
  const routes = ["", "/collections", "/brands", "/wishlist"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));

  // ---- Example Dynamic Products (Replace with Shopify API) ----
  // If you have Shopify products API setup, fetch actual handles here
  // const products = await fetchProductsFromShopify();
  const products: string[] = []; // keep empty for now

  const productRoutes = products.map((handle) => ({
    url: `${baseUrl}/products/${handle}`,
    lastModified: new Date().toISOString(),
  }));

  return [...routes, ...productRoutes];
}
