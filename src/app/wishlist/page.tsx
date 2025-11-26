"use client";

import Link from "next/link";
import Sidebar from "@/components/SidebarNav";
import { useWishlist } from "@/context/WishlistContext";

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlist();

  return (
    <div className="app-shell">
      <aside className="sidebar-nav">
        <Sidebar />
      </aside>

      <main className="app-main">
        <section className="home-section">
          <div className="flex items-center justify-between mb-4">
            <h1 className="home-section-title">My Wishlist</h1>

            {items.length > 0 && (
              <button
                type="button"
                className="text-xs text-gray-500 hover:text-gray-800 underline"
                onClick={clearWishlist}
              >
                Clear all
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="text-sm text-gray-500">
              Your wishlist is empty.{" "}
              <Link href="/" className="underline">
                Continue shopping
              </Link>
              .
            </div>
          ) : (
            <div className="product-grid">
              {items.map((it) => (
                <div
                  key={it.handle}
                  className="laam-card rounded-xl border border-gray-100 bg-white overflow-hidden shadow-sm"
                >
                  <Link
                    href={`/products/${it.handle}`}
                    className="block aspect-[3/4] bg-gray-50 overflow-hidden"
                  >
                    {it.imageUrl && (
                      <img
                        src={it.imageUrl}
                        alt={it.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </Link>

                  <div className="px-3.5 pt-3 pb-3.5">
                    <div className="text-[11px] uppercase tracking-wide text-gray-500 mb-0.5">
                      {it.vendor}
                    </div>
                    <Link
                      href={`/products/${it.handle}`}
                      className="block text-sm font-medium text-gray-900 line-clamp-2 mb-1"
                    >
                      {it.title}
                    </Link>
                    {typeof it.price === "number" && (
                      <div className="text-[15px] font-semibold text-gray-900 mb-2">
                        PKR {it.price.toLocaleString("en-PK")}
                      </div>
                    )}

                    <button
                      type="button"
                      className="text-xs text-gray-500 underline"
                      onClick={() => removeItem(it.handle)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
