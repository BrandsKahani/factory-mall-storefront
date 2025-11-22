// src/lib/queries.ts

/* ============================
   PRODUCT BY HANDLE (PDP MAIN)
============================ */

export const PRODUCT_BY_HANDLE = /* GraphQL */ `
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      vendor
      descriptionHtml

      collections(first: 1) {
        edges {
          node {
            id
            handle
            title
          }
        }
      }

      images(first: 12) {
        edges {
          node {
            id
            url
            altText
            width
            height
          }
        }
      }

      variants(first: 20) {
        edges {
          node {
            id
            title
            availableForSale
            quantityAvailable

            selectedOptions {
              name
              value
            }

            price {
              amount
              currencyCode
            }

            compareAtPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

/* ============================
   PRODUCT RECOMMENDATIONS
============================ */

export const PRODUCT_RECOMMENDATIONS = /* GraphQL */ `
  query ProductRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
      id
      handle
      title
      vendor

      images(first: 2) {
        edges {
          node {
            id
            url
            altText
          }
        }
      }

      variants(first: 1) {
        edges {
          node {
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

/* ============================
   COLLECTION BY HANDLE (PLP)
============================ */

export const COLLECTION_BY_HANDLE = /* GraphQL */ `
  query CollectionByHandle($handle: String!) {
    collection(handle: $handle) {
      id
      title
      description

      products(first: 50) {
        edges {
          node {
            id
            handle
            title
            vendor

            images(first: 5) {
              edges {
                node {
                  id
                  url
                  altText
                }
              }
            }

            variants(first: 2) {
              edges {
                node {
                  price {
                    amount
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

/* ============================
   HOME PRODUCTS (HOME PAGE)
============================ */

export const HOME_PRODUCTS = /* GraphQL */ `
  query HomeProducts {
    products(first: 24, sortKey: UPDATED_AT, reverse: true) {
      edges {
        node {
          id
          handle
          title
          vendor

          images(first: 2) {
            edges {
              node {
                url
                altText
              }
            }
          }

          variants(first: 1) {
            edges {
              node {
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;

// ============================
// HOME COLLECTIONS (from Shop metafield)
// - Shopify: Settings → Custom data → Store → "home.collections_slider"
// - Type: List of Collection reference
// ============================
export const HOME_COLLECTIONS = /* GraphQL */ `
  query HomeCollectionsFromMetafield {
    shop {
      metafield(namespace: "home", key: "collections_slider") {
        references(first: 20) {
          edges {
            node {
              ... on Collection {
                id
                handle
                title
                image {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
`;


/* ============================
   SHOPIFY CART (Storefront Cart API)
============================ */

export const CART_CREATE_MUTATION = /* GraphQL */ `
  mutation CartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        id
        checkoutUrl
        totalQuantity
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CART_LINES_ADD_MUTATION = /* GraphQL */ `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        totalQuantity
      }
      userErrors {
        field
        message
      }
    }
  }
`;

/* ============================
   BRAND PRODUCTS SOURCE
   - Brands listing + Brand detail pages
============================ */

export const BRAND_PRODUCTS_SOURCE = /* GraphQL */ `
  query BrandProductsSource {
    products(first: 250, sortKey: UPDATED_AT, reverse: true) {
      edges {
        node {
          id
          handle
          title
          vendor

          images(first: 3) {
            edges {
              node {
                id
                url
                altText
                width
                height
              }
            }
          }

          variants(first: 3) {
            edges {
              node {
                id
                title
                availableForSale
                quantityAvailable

                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;
/* ============================
   HOME COLLECTIONS (from menu)
   - Uses Online Store navigation menu "Home Collections"
============================ */

export const HOME_COLLECTIONS_MENU = /* GraphQL */ `
  query HomeCollectionsMenu {
    menu(handle: "home-collections") {
      items {
        id
        title
        resource {
          __typename
          ... on Collection {
            id
            handle
            title
            image {
              url
              altText
            }
          }
        }
      }
    }
  }
`;
// ============================
// COLLECTION SLIDER BY KEY (Store metafield -> collection_tile metaobjects)
// ============================
export const COLLECTION_SLIDER_BY_KEY = /* GraphQL */ `
  query CollectionSliderByKey($key: String!) {
    shop {
      metafield(namespace: "home", key: $key) {
        references(first: 50) {
          edges {
            node {
              ... on Metaobject {
                id
                fields {
                  key
                  value
                  reference {
                    # collection field
                    ... on Collection {
                      handle
                      title
                      image {
                        url
                        altText
                      }
                    }
                    # image field (file)
                    ... on MediaImage {
                      image {
                        url
                        altText
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
