"use client";

import type { FormEvent } from "react";
import { useState, useMemo } from "react";
import { useCart } from "@/context/CartContext";
import { FiTruck, FiRefreshCcw, FiZap } from "react-icons/fi";

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
  const { addItem } = useCart();

  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants?.[0]?.id ?? ""
  );
  const [qty, setQty] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [adding, setAdding] = useState(false);

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

  const maxQty =
    selectedVariant?.quantityAvailable &&
    selectedVariant.quantityAvailable > 0
      ? Math.min(selectedVariant.quantityAvailable, 10)
      : 10;

  const mainImg =
    product.images[activeImageIndex] ?? product.images[0] ?? null;

  const handleAddToCart = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedVariant) return;

    try {
      setAdding(true);

      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: [
            {
              merchandiseId: selectedVariant.id,
              quantity: qty,
            },
          ],
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok || !data.cart?.checkoutUrl) {
        console.error("Cart error", data);
        alert("Sorry, unable to add to cart right now.");
        return;
      }

      // Local drawer cart update + thumbnail
      addItem(
        {
          id: selectedVariant.id,
          title: product.title,
          variantTitle: selectedVariant.title,
          price: mainPrice,
          quantity: qty,
          imageUrl: mainImg?.url ?? null,
        },
        data.cart.checkoutUrl
      );
    } catch (error) {
      console.error("Cart error", error);
      alert("Sorry, unable to add to cart right now.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="pdp-page max-w-6xl mx-auto px-4 py-8 lg:py-10">
      {/* BREADCRUMB */}
      <div className="mb-3 text-xs text-gray-500">
        <a href="/" className="hover:underline">
          Home
        </a>
        {" / "}
        {product.collection ? (
          <>
            <a
              href={`/collections/${product.collection.handle}`}
              className="hover:underline"
            >
              {product.collection.title}
            </a>
            {" / "}
          </>
        ) : null}
        <span className="text-gray-700">{product.title}</span>
      </div>

      {/* MAIN GRID */}
      <div className="pdp-grid lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-10 lg:gap-12">
        {/* LEFT: GALLERY */}
        <div className="pdp-left">
          {product.images.length > 0 && mainImg ? (
            <div className="flex flex-col gap-4 lg:flex-row-reverse">
              {/* Main image */}
              <button
                type="button"
                className="pdp-gallery-main group overflow-hidden rounded-xl border border-gray-200 bg-white max-h-[550px] flex-1"
                onClick={() => setLightboxOpen(true)}
              >
                <img
                  src={mainImg.url}
                  alt={mainImg.altText || product.title}
                  className="pdp-gallery-main-img w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </button>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="pdp-gallery-thumbs flex lg:flex-col gap-2 max-h-[550px] overflow-auto pr-1">
                  {product.images.map((img, index) => {
                    const active = index === activeImageIndex;
                    return (
                      <button
                        key={img.id}
                        type="button"
                        className={
                          "pdp-gallery-thumb rounded-lg overflow-hidden border transition-all duration-200 w-20 h-24 flex-shrink-0 " +
                          (active
                            ? "border-gray-900 ring-1 ring-gray-900"
                            : "border-gray-200 hover:border-gray-400")
                        }
                        onClick={() => setActiveImageIndex(index)}
                      >
                        <img
                          src={img.url}
                          alt={img.altText || product.title}
                          className="pdp-gallery-thumb-img w-full h-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="pdp-gallery-empty">
              <div className="pdp-gallery-empty-box" />
            </div>
          )}
        </div>

        {/* RIGHT: DETAILS / PURCHASE PANEL */}
        <div className="pdp-right lg:sticky lg:top-24 self-start">
          {/* BRAND + TITLE */}
          {product.vendor && (
            <div className="pdp-vendor text-xs tracking-wide uppercase text-gray-500 mb-1">
              {product.vendor}
            </div>
          )}

          <h1 className="pdp-title text-xl md:text-2xl font-semibold text-gray-900 mb-2">
            {product.title}
          </h1>

          {/* PRICE ROW */}
          <div className="pdp-price-row flex items-baseline gap-3 mb-2">
            <div className="pdp-price-main text-xl font-semibold text-gray-900">
              PKR {mainPrice.toLocaleString("en-PK")}
            </div>

            {compareAt && (
              <>
                <div className="pdp-price-compare line-through text-sm text-gray-400">
                  PKR {compareAt.toLocaleString("en-PK")}
                </div>
                {discount && (
                  <div className="pdp-price-discount text-xs font-semibold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                    -{discount}% OFF
                  </div>
                )}
              </>
            )}
          </div>

          {/* PIECES / STOCK LINE */}
          {(piecesLabel || selectedVariant?.quantityAvailable !== null) && (
            <div className="text-xs text-gray-500 mb-1">
              {piecesLabel && <span>Pieces: {piecesLabel}</span>}
              {piecesLabel && " • "}
              {selectedVariant?.quantityAvailable !== null && (
                <span>
  Stock:{" "}
  {selectedVariant?.quantityAvailable ?? 0}{" "}
  {selectedVariant?.quantityAvailable === 1 ? "pc" : "pcs"}
</span>

              )}
            </div>
          )}

          {lowStock && (
            <div className="pdp-low-stock text-xs text-amber-600 mb-3">
              Only {selectedVariant?.quantityAvailable} pieces left – order
              now!
            </div>
          )}

          {/* INFO CARD */}
          <div className="pdp-info-card border border-gray-100 rounded-xl bg-gray-50/80 p-3 mb-4 space-y-2 text-sm">
            <div className="pdp-info-row flex gap-3 items-start">
              <span className="pdp-info-icon inline-flex items-center justify-center w-7 h-7 rounded-full bg-white border border-gray-200">
                <FiZap size={16} />
              </span>
              <div>
                <div className="pdp-info-title font-medium text-gray-900">
                  Express dispatch
                </div>
                <div className="pdp-info-sub text-xs text-gray-500">
                  Orders ship quickly from Factory Mall warehouse.
                </div>
              </div>
            </div>

            <div className="pdp-info-row flex gap-3 items-start">
              <span className="pdp-info-icon inline-flex items-center justify-center w-7 h-7 rounded-full bg-white border border-gray-200">
                <FiTruck size={16} />
              </span>
              <div>
                <div className="pdp-info-title font-medium text-gray-900">
                  Delivery in 3–5 working days
                </div>
                <div className="pdp-info-sub text-xs text-gray-500">
                  Karachi & Lahore usually 1–3 days • Other cities 3–5 days.
                </div>
              </div>
            </div>

            <div className="pdp-info-row flex gap-3 items-start">
              <span className="pdp-info-icon inline-flex items-center justify-center w-7 h-7 rounded-full bg-white border border-gray-200">
                <FiRefreshCcw size={16} />
              </span>
              <div>
                <div className="pdp-info-title font-medium text-gray-900">
                  7-day easy exchange
                </div>
                <div className="pdp-info-sub text-xs text-gray-500">
                  Size issue? Exchange allowed within 7 days.
                </div>
              </div>
            </div>
          </div>

          {/* VARIANTS / SIZES */}
          {product.variants.length > 0 && (
            <section className="pdp-section mb-4">
              <div className="pdp-section-header flex items-center justify-between mb-2">
                <div className="pdp-section-label text-xs font-semibold tracking-wide text-gray-700 uppercase">
                  Select Size / Variant
                </div>
                <button
                  type="button"
                  className="pdp-size-chart-btn text-xs text-gray-600 underline underline-offset-2"
                >
                  Size chart
                </button>
              </div>

              <div className="pdp-size-row flex flex-wrap gap-2">
                {product.variants.map((v) => {
                  const isSelected = v.id === selectedVariantId;
                  const isDisabled =
                    !v.availableForSale ||
                    (v.quantityAvailable ?? 0) <= 0;

                  return (
                    <button
                      key={v.id}
                      type="button"
                      className={
                        "pdp-size-pill px-3 py-1.5 rounded-full text-xs border transition-all " +
                        (isSelected
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-800 border-gray-200 hover:border-gray-400") +
                        (isDisabled
                          ? " opacity-40 cursor-not-allowed"
                          : "")
                      }
                      disabled={isDisabled}
                      onClick={() => setSelectedVariantId(v.id)}
                    >
                      {v.title}
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* QUANTITY */}
          <section className="pdp-section mb-4">
            <div className="pdp-section-label text-xs font-semibold tracking-wide text-gray-700 uppercase mb-1.5">
              Quantity
            </div>

            <div className="pdp-qty-row inline-flex items-center border border-gray-200 rounded-full overflow-hidden">
              <button
                type="button"
                className="pdp-qty-btn w-9 h-9 text-sm"
                onClick={() => setQty((q) => (q > 1 ? q - 1 : 1))}
                disabled={qty <= 1}
              >
                –
              </button>
              <div className="pdp-qty-value w-10 text-center text-sm">
                {qty}
              </div>
              <button
                type="button"
                className="pdp-qty-btn w-9 h-9 text-sm"
                onClick={() =>
                  setQty((q) => (q < maxQty ? q + 1 : maxQty))
                }
                disabled={qty >= maxQty}
              >
                +
              </button>
            </div>
          </section>

          {/* ADD TO BAG */}
          <form
            className="pdp-addtocart-form mb-5"
            onSubmit={handleAddToCart}
          >
            <button
              type="submit"
              className="pdp-addtocart-btn w-full h-11 rounded-full bg-gray-900 text-white text-sm font-medium flex items-center justify-center gap-2 shadow-sm hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={
                adding || !selectedVariant?.availableForSale
              }
            >
              {adding ? "Adding..." : "Add to Bag"}
            </button>
          </form>

          {/* HIGHLIGHTS */}
          <section className="pdp-section mb-4">
            <div className="pdp-section-label text-xs font-semibold tracking-wide text-gray-700 uppercase mb-1.5">
              Highlights
            </div>
            <ul className="pdp-highlights list-disc pl-4 text-xs text-gray-600 space-y-1">
              <li>Premium quality fabric & finishing</li>
              <li>Ready to wear / unstitched as mentioned</li>
              <li>Nationwide delivery across Pakistan</li>
            </ul>
          </section>

          {/* DESCRIPTION */}
          {product.descriptionHtml && (
            <section className="pdp-section">
              <div className="pdp-section-label text-xs font-semibold tracking-wide text-gray-700 uppercase mb-1.5">
                Description
              </div>
              <div
                className="pdp-description prose prose-sm max-w-none text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: product.descriptionHtml,
                }}
              />
            </section>
          )}
        </div>
      </div>

      {/* LIGHTBOX OVERLAY */}
      {lightboxOpen && mainImg && (
        <div
          className="pdp-lightbox fixed inset-0 bg-black/70 z-40 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="pdp-lightbox-inner max-w-4xl max-h-[90vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={mainImg.url}
              alt={mainImg.altText || product.title}
              className="pdp-lightbox-img w-full h-full object-contain rounded-xl"
            />
          </div>

          <button
            type="button"
            className="pdp-lightbox-close absolute top-4 right-4 text-white text-sm bg-black/40 rounded-full px-3 py-1"
            onClick={() => setLightboxOpen(false)}
          >
            Close ✕
          </button>
        </div>
      )}
    </div>
  );
}
