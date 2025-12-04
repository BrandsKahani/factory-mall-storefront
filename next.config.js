/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: { allowedOrigins: ['*'] }
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.cdn.shopify.com"
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com"
      },
      {
        protocol: "https",
        hostname: "shopify.com"
      },
      {
        protocol: "https",
        hostname: "files.shopifycdn.com"
      },
      {
        protocol: "https",
        hostname: "**.shopifycdn.com"
      },
      {
        protocol: "https",
        hostname: "shopifycdn.net"
      }
    ]
  }
};

module.exports = nextConfig;
