"use client";

import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/context/WishlistContext";

export default function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();

  const hasItems = items.length > 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
            Wishlist
          </h1>
          <p className="text-sm text-gray-500">
            {hasItems
              ? `${items.length} item${items.length > 1 ? "s" : ""} saved for later`
              : "No items in your wishlist yet."}
          </p>
        </div>

        {hasItems && (
          <button
            type="button"
            onClick={clearWishlist}
            className="text-xs text-gray-500 underline underline-offset-2 hover:text-gray-700"
          >
            Clear all
          </button>
        )}
      </div>

      {!hasItems && (
        <div className="border border-dashed border-gray-200 rounded-xl p-6 text-center text-sm text-gray-500 bg-gray-50">
          <p className="mb-3">
            Start exploring products and tap the heart icon to save them here.
          </p>
          <Link
            href="/collections/women-clothing"
            className="inline-flex items-center justify-center px-4 py-2 text-xs font-medium rounded-full bg-gray-900 text-white hover:bg-black"
          >
            Browse collections
          </Link>
        </div>
      )}

      {hasItems && (
        <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.handle}
              className="rounded-xl border border-gray-100 bg-white overflow-hidden shadow-sm flex flex-col"
            >
              <Link
                href={`/products/${item.handle}`}
                className="relative aspect-[3/4] bg-gray-50"
              >
                {item.imageUrl && (
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                )}
              </Link>

              <div className="px-3.5 py-3 flex-1 flex flex-col">
                {item.vendor && (
                  <div className="text-[11px] uppercase tracking-wide text-gray-500 mb-0.5">
                    {item.vendor}
                  </div>
                )}
                <Link
                  href={`/products/${item.handle}`}
                  className="text-sm font-medium text-gray-900 line-clamp-2 mb-1"
                >
                  {item.title}
                </Link>

                {typeof item.price === "number" && (
                  <div className="text-[15px] font-semibold text-gray-900 mb-2">
                    PKR {item.price.toLocaleString("en-PK")}
                  </div>
                )}

                <div className="mt-auto flex items-center justify-between gap-2">
                  <Link
                    href={`/products/${item.handle}`}
                    className="inline-flex flex-1 items-center justify-center rounded-full border border-gray-200 text-xs font-medium py-1.5 hover:border-gray-400"
                  >
                    View product
                  </Link>

                  <button
                    type="button"
                    onClick={() => removeFromWishlist(item.handle)}
                    className="text-[11px] text-gray-500 hover:text-gray-800"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
