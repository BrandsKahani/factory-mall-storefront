"use client";

import Link from "next/link";
import { useState } from "react";
import { FaHeart, FaRegHeart, FaShoppingBag } from "react-icons/fa";

export type ProductCardProps = {
  handle: string;
  title: string;
  vendor?: string;
  image?: any;
  hoverImage?: any;
  price: number;
  compareAtPrice?: number | null;
};

export default function ProductCard({
  handle,
  title,
  vendor,
  image,
  hoverImage,
  price,
  compareAtPrice,
}: ProductCardProps) {
  const [wish, setWish] = useState(false);

  const discount =
    compareAtPrice && compareAtPrice > price
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : null;

  return (
    <div className="laam-card">
      {/* ============ IMAGE AREA ============ */}
      <Link href={`/products/${handle}`} className="laam-card-imgbox">
        {/* MAIN IMAGE */}
        {image && (
          <img
            src={image.url}
            alt={title}
            className="laam-card-img main-img"
          />
        )}

        {/* OPTIONAL HOVER IMAGE (future use) */}
        {hoverImage && (
          <img
            src={hoverImage.url}
            alt={title}
            className="laam-card-img hover-img"
          />
        )}

        {/* TOP BADGES + WISHLIST (overlay) */}
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

      {/* ============ BODY ============ */}
      <div className="laam-card-body">
        {vendor && <div className="laam-vendor">{vendor}</div>}

        {/* ONE-LINE TITLE WITH ELLIPSIS */}
        <Link href={`/products/${handle}`} className="laam-title">
          {title}
        </Link>

        {/* PRICE ROW + ADD TO CART ICON */}
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
            onClick={(e) => {
              e.preventDefault();
              alert("Add to cart will be connected later!");
            }}
            aria-label="Add to cart"
          >
            <FaShoppingBag size={16} />
          </button>
        </div>

        {/* EXPRESS BADGE */}
        <div className="laam-express">⚡ Express</div>
      </div>
    </div>
  );
}
