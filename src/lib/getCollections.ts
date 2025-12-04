export async function getCollections() {
  const res = await fetch(
    "https://factorymall.myshopify.com/api/2023-07/graphql.json",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!,
      },
      body: JSON.stringify({
        query: `
          {
            collections(first: 50) {
              edges {
                node {
                  id
                  title
                  handle
                  image {
                    url
                  }
                }
              }
            }
          }
        `,
      }),
    }
  );

  const json = await res.json();
  return json.data.collections.edges.map((col: any) => col.node);
}
