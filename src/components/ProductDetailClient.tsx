// src/components/ProductDetailClient.tsx
"use client";

import { useState, useTransition, useMemo } from "react";
import { addToCartAction } from "@/app/actions/cartActions";

/* ---------- Types ---------- */

export type PDPImage = {
  id: string;
  url: string;
  altText?: string | null;
};

export type PDPVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable: number | null;
  price: number;
  compareAtPrice: number | null;
  selectedOptions: { name: string; value: string }[];
};

export type PDPCollection = {
  handle: string;
  title: string;
} | null;

export type ProductForPDP = {
  id: string;
  handle: string;
  title: string;
  vendor?: string | null;
  descriptionHtml?: string | null;
  images: PDPImage[];
  variants: PDPVariant[];
  collection: PDPCollection;
};

type PDPProps = {
  product: ProductForPDP;
};

/* ---------- Helpers ---------- */

function extractPieces(title: string): string | null {
  const match = title.match(/(\d+)\s*(pc|pcs|piece|pieces)/i);
  if (!match) return null;
  const num = match[1];
  return `${num} Piece`;
}

/* ---------- Component ---------- */

export default function ProductDetailClient({ product }: PDPProps) {
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants?.[0]?.id ?? ""
  );
  const [qty, setQty] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isPending, startTransition] = useTransition();

  const selectedVariant = useMemo(
    () => product.variants.find((v) => v.id === selectedVariantId),
    [product.variants, selectedVariantId]
  );

  const mainPrice =
    selectedVariant?.price ?? product.variants[0]?.price ?? 0;
  const compareAt = selectedVariant?.compareAtPrice ?? null;

  const discount =
    compareAt && compareAt > mainPrice
      ? Math.round(((compareAt - mainPrice) / compareAt) * 100)
      : null;

  const piecesLabel = selectedVariant
    ? extractPieces(selectedVariant.title)
    : null;

  const lowStock =
    (selectedVariant?.quantityAvailable ?? 0) > 0 &&
    (selectedVariant?.quantityAvailable ?? 0) <= 5;

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    startTransition(async () => {
      try {
        await addToCartAction(selectedVariant.id, qty);
        console.log("Added to cart:", selectedVariant.id, qty);
      } catch (error) {
        console.error("Cart error", error);
        alert("Sorry, unable to add to cart right now.");
      }
    });
  };

  const mainImg =
    product.images[activeImageIndex] ?? product.images[0];

  return (
    <div className="pdp-grid">
      {/* LEFT: GALLERY */}
      <div className="pdp-left">
        {product.images.length > 0 && mainImg ? (
          <div className="pdp-gallery">
            <button
              type="button"
              className="pdp-gallery-main"
              onClick={() => {
                // future lightbox
              }}
            >
              <img
                src={mainImg.url}
                alt={mainImg.altText || product.title}
                className="pdp-gallery-main-img"
              />
            </button>

            <div className="pdp-gallery-thumbs">
              {product.images.map((img, index) => (
                <button
                  key={img.id}
                  type="button"
                  className={
                    "pdp-gallery-thumb" +
                    (index === activeImageIndex
                      ? " pdp-gallery-thumb--active"
                      : "")
                  }
                  onClick={() => setActiveImageIndex(index)}
                >
                  <img
                    src={img.url}
                    alt={img.altText || product.title}
                    className="pdp-gallery-thumb-img"
                  />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="pdp-gallery-empty">
            <div className="pdp-gallery-empty-box" />
          </div>
        )}
      </div>

      {/* RIGHT: DETAILS */}
      <div className="pdp-right">
        {/* Breadcrumbs */}
        <div
          style={{
            fontSize: "0.8rem",
            color: "#6b7280",
            marginBottom: "0.4rem",
          }}
        >
          <a href="/">Home</a>
          {" / "}
          {product.collection ? (
            <>
              <a href={`/collections/${product.collection.handle}`}>
                {product.collection.title}
              </a>
              {" / "}
            </>
          ) : null}
          <span>{product.title}</span>
        </div>

        {product.vendor && (
          <div className="pdp-vendor">{product.vendor}</div>
        )}

        <h1 className="pdp-title">{product.title}</h1>

        {/* PRICE ROW */}
        <div className="pdp-price-row">
          <div className="pdp-price-main">
            PKR {mainPrice.toLocaleString("en-PK")}
          </div>

          {compareAt && (
            <>
              <div className="pdp-price-compare">
                PKR {compareAt.toLocaleString("en-PK")}
              </div>
              {discount && (
                <div className="pdp-price-discount">
                  -{discount}% OFF
                </div>
              )}
            </>
          )}
        </div>

        {lowStock && (
          <div className="pdp-low-stock">
            Only {selectedVariant?.quantityAvailable} pieces left – order
            now!
          </div>
        )}

        {/* INFO CARD */}
        <div className="pdp-info-card">
          <div className="pdp-info-row">
            <div className="pdp-info-pill">Express</div>
            <div>
              <div className="pdp-info-title">Fast Delivery</div>
              <div className="pdp-info-sub">
                Karachi & Lahore 1–3 days • Other cities 3–5 days.
              </div>
            </div>
          </div>

          <div className="pdp-info-row">
            <div className="pdp-info-icon">↺</div>
            <div>
              <div className="pdp-info-title">7-Day Easy Exchange</div>
              <div className="pdp-info-sub">
                Size issue? Exchange allowed within 7 days.
              </div>
            </div>
          </div>

          <div className="pdp-info-row">
            <div className="pdp-info-icon">₨</div>
            <div>
              <div className="pdp-info-title">Cash on Delivery</div>
              <div className="pdp-info-sub">
                Pay via COD or online for faster processing.
              </div>
            </div>
          </div>
        </div>

        {/* VARIANTS / SIZES */}
        {product.variants.length > 0 && (
          <section className="pdp-section">
            <div className="pdp-section-header">
              <div className="pdp-section-label">Select Variant</div>
              <button type="button" className="pdp-size-chart-btn">
                Size chart
              </button>
            </div>

            <div className="pdp-size-row">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  className={
                    "pdp-size-pill" +
                    (v.id === selectedVariantId
                      ? " pdp-size-pill--active"
                      : "")
                  }
                  disabled={!v.availableForSale}
                  onClick={() => setSelectedVariantId(v.id)}
                >
                  {v.title}
                </button>
              ))}
            </div>

            {selectedVariant && (
              <div
                style={{
                  marginTop: "0.35rem",
                  fontSize: "0.8rem",
                  color: "#6b7280",
                }}
              >
                {piecesLabel && <>Pieces: {piecesLabel} • </>}
                Stock:{" "}
                {selectedVariant.quantityAvailable !== null
                  ? `${selectedVariant.quantityAvailable} pcs`
                  : "In stock"}
              </div>
            )}

            {/* Quantity */}
            <div style={{ marginTop: "0.75rem" }}>
              <div
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  marginBottom: "0.3rem",
                  color: "#4b5563",
                }}
              >
                Quantity
              </div>
              <div className="pdp-qty-row">
                <button
                  type="button"
                  className="pdp-qty-btn"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  -
                </button>
                <div className="pdp-qty-value">{qty}</div>
                <button
                  type="button"
                  className="pdp-qty-btn"
                  onClick={() => setQty((q) => q + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ADD TO BAG */}
        <form
          className="pdp-addtocart-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleAddToCart();
          }}
        >
          <button
            type="submit"
            className="pdp-addtocart-btn"
            disabled={isPending || !selectedVariant?.availableForSale}
          >
            {isPending ? "Adding..." : "Add to Bag"}
          </button>
        </form>

        {/* DESCRIPTION */}
        {product.descriptionHtml && (
          <section className="pdp-section">
            <div className="pdp-section-label">Description</div>
            <div
              className="pdp-description"
              dangerouslySetInnerHTML={{
                __html: product.descriptionHtml,
              }}
            />
          </section>
        )}
      </div>
    </div>
  );
}
