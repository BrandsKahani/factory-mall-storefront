"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
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
  const [wish, setWish] = useState(false);
  const [adding, setAdding] = useState(false);

  const discount =
    compareAtPrice && compareAtPrice > price
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : null;

  const hasQuickAdd = !!variantId;

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();

    // agar variantId hi nahi mila to PDP par bhej do
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

      // Local drawer cart update
      addItem(
        {
          id: variantId,
          title,
          variantTitle: variantTitle ?? null,
          price,
          quantity: 1,
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

  return (
    <div className="laam-card">
      {/* IMAGE AREA */}
      <Link href={`/products/${handle}`} className="laam-card-imgbox">
        {image && (
          <img
            src={image.url}
            alt={image.altText || title}
            className="laam-card-img main-img"
          />
        )}

        {hoverImage && (
          <img
            src={hoverImage.url}
            alt={hoverImage.altText || title}
            className="laam-card-img hover-img"
          />
        )}

        {/* TOP BADGES + WISHLIST */}
        <div className="laam-card-top">
          {discount && (
            <span className="laam-discount-badge">-{discount}%</span>
          )}

          <button
            type="button"
            className="laam-heart"
            onClick={(e) => {
              e.preventDefault();
              setWish((prev) => !prev);
            }}
            aria-label="Add to wishlist"
          >
            {wish ? <FaHeart color="#ef4444" /> : <FaRegHeart />}
          </button>
        </div>
      </Link>

      {/* BODY */}
      <div className="laam-card-body">
        {vendor && <div className="laam-vendor">{vendor}</div>}

        <Link href={`/products/${handle}`} className="laam-title">
          {title}
        </Link>

        {/* PRICE + QUICK ADD */}
        <div className="laam-price-row">
          <div>
            <div className="laam-price">
              PKR {price.toLocaleString("en-PK")}
            </div>
            {compareAtPrice && (
              <div className="laam-compare">
                PKR {compareAtPrice.toLocaleString("en-PK")}
              </div>
            )}
          </div>

          <button
            type="button"
            className="laam-add-btn"
            onClick={handleQuickAdd}
            disabled={!hasQuickAdd || adding}
            aria-label="Add to cart"
          >
            <FaShoppingBag size={16} />
          </button>
        </div>

        <div className="laam-express">⚡ Express</div>
      </div>
    </div>
  );
}
