// src/components/ProductCard.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { FaHeart, FaRegHeart, FaShoppingBag } from "react-icons/fa";
import { useCart } from "@/context/CartContext";

export type ProductCardProps = {
  handle: string;
  title: string;
  vendor?: string;
  image?: any;
  hoverImage?: any;
  price: number;
  compareAtPrice?: number | null;
  variantId?: string; // first variant id
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
}: ProductCardProps) {
  const { addItem, setCheckoutUrl } = useCart();
  const [wish, setWish] = useState(false);
  const [adding, setAdding] = useState(false);

  const discount =
    compareAtPrice && compareAtPrice > price
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : null;

  const handleQuickAdd = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (!variantId) {
      // agar variant id nahi mili to PDP pe bhej do
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
      if (!res.ok || !data.ok) {
        console.error("Quick add cart error", data);
        return;
      }

      if (data.cart?.checkoutUrl) {
        setCheckoutUrl(data.cart.checkoutUrl);
      }

      addItem({
        id: variantId,
        title,
        variantTitle: undefined,
        quantity: 1,
        price,
      });

      console.log("Quick add OK", data.cart);
    } catch (err) {
      console.error(err);
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
            alt={title}
            className="laam-card-img main-img"
          />
        )}

        {hoverImage && (
          <img
            src={hoverImage.url}
            alt={title}
            className="laam-card-img hover-img"
          />
        )}

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
            aria-label="Add to cart"
            disabled={adding}
          >
            {adding ? (
              <span className="text-xs">Adding…</span>
            ) : (
              <FaShoppingBag size={16} />
            )}
          </button>
        </div>

        <div className="laam-express">⚡ Express</div>
      </div>
    </div>
  );
}
