"use client";

import { useState, MouseEvent, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { FaShoppingBag, FaHeart, FaRegHeart } from "react-icons/fa";

export type ProductCardProps = {
  handle: string;
  title: string;
  vendor?: string;
  image?: { url: string; altText?: string | null };
  hoverImage?: { url: string; altText?: string | null };
  price: number;
  compareAtPrice?: number | null;
  variantId?: string;
  variantTitle?: string | null;
};

export default function ProductCard({
  handle,
  title,
  vendor,
  image,
  hoverImage,
  price,
  compareAtPrice,
  variantId,
  variantTitle,
}: ProductCardProps) {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [wish, setWish] = useState<boolean>(false);
  const [adding, setAdding] = useState(false);

  // sync local wish flag with context
  useEffect(() => {
    setWish(isInWishlist(handle));
  }, [handle, isInWishlist]);

  const discount =
    compareAtPrice && compareAtPrice > price
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : null;

  const hasQuickAdd = !!variantId;

  const handleQuickAdd = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!variantId) {
      window.location.href = `/products/${handle}`;
      return;
    }

    try {
      setAdding(true);

      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: [
            {
              merchandiseId: variantId,
              quantity: 1,
            },
          ],
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok || !data.cart?.checkoutUrl) {
        console.error("Quick add cart error", data);
        alert("Unable to add to cart right now. Please try again.");
        return;
      }

      // Local drawer cart update + thumbnail
      addItem(
        {
          id: variantId,
          title,
          variantTitle: variantTitle ?? null,
          price,
          quantity: 1,
          imageUrl: image?.url ?? null,
        },
        data.cart.checkoutUrl
      );
    } catch (err) {
      console.error("Quick add failed", err);
      alert("Something went wrong while adding to cart.");
    } finally {
      setAdding(false);
    }
  };

  const handleWishlistClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    toggleWishlist({
      handle,
      title,
      vendor,
      imageUrl: image?.url ?? null,
      price,
    });

    setWish((prev) => !prev);
  };

  return (
    <div className="laam-card group rounded-xl border border-gray-100 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* IMAGE AREA */}
      <Link
        href={`/products/${handle}`}
        className="laam-card-imgbox relative block aspect-[3/4] overflow-hidden bg-gray-50"
      >
        {image && (
          <img
            src={image.url}
            alt={image.altText || title}
            className="laam-card-img main-img w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}

        {hoverImage && (
          <img
            src={hoverImage.url}
            alt={hoverImage.altText || title}
            className="laam-card-img hover-img w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
        )}

        {/* TOP BADGES + WISHLIST */}
        <div className="laam-card-top absolute top-2 left-2 right-2 flex items-start justify-between">
          <div className="flex flex-col gap-1">
            {discount && (
              <span className="laam-discount-badge inline-flex items-center rounded-full bg-red-500 text-white text-[11px] font-semibold px-2 py-0.5 shadow-sm">
                -{discount}% OFF
              </span>
            )}
            <span className="inline-flex items-center rounded-full bg-white/80 backdrop-blur text-[11px] text-gray-700 px-2 py-0.5">
              ⚡ Express
            </span>
          </div>

          <button
            type="button"
            className="laam-heart inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/90 backdrop-blur shadow-sm hover:scale-105 transition-transform"
            onClick={handleWishlistClick}
            aria-label="Add to wishlist"
          >
            {wish ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
          </button>
        </div>
      </Link>

      {/* BODY */}
      <div className="laam-card-body px-3.5 pt-3 pb-3.5">
        {vendor && (
          <div className="laam-vendor text-[11px] uppercase tracking-wide text-gray-500 mb-0.5">
            {vendor}
          </div>
        )}

        <Link
          href={`/products/${handle}`}
          className="laam-title block text-sm font-medium text-gray-900 line-clamp-2 mb-1"
        >
          {title}
        </Link>

        {/* PRICE + QUICK ADD */}
        <div className="laam-price-row flex items-end justify-between mt-1">
          <div className="space-y-0.5">
            <div className="laam-price text-[15px] font-semibold text-gray-900">
              PKR {price.toLocaleString("en-PK")}
            </div>
            {compareAtPrice && (
              <div className="laam-compare text-xs text-gray-400 line-through">
                PKR {compareAtPrice.toLocaleString("en-PK")}
              </div>
            )}
          </div>

          <button
            type="button"
            className="laam-add-btn inline-flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 bg-gray-900 text-white hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            onClick={handleQuickAdd}
            disabled={!hasQuickAdd || adding}
            aria-label="Add to cart"
          >
            {adding ? (
              <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <FaShoppingBag size={15} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
