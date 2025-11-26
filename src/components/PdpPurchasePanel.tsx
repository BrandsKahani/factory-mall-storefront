// src/components/PdpPurchasePanel.tsx
"use client";

import * as React from "react";
import { FiZap, FiTruck, FiRefreshCcw } from "react-icons/fi";
import { useCart } from "@/context/CartContext";

type Variant = {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable?: number | null;
  price?: number;
  compareAtPrice?: number | null;
};

type Props = {
  vendor?: string;
  title: string;
  price: number;
  compareAtPrice?: number | null;
  variants: Variant[];
  descriptionHtml?: string | null;
  description?: string | null;
};

export default function PdpPurchasePanel({
  vendor,
  title,
  price,
  compareAtPrice,
  variants,
  descriptionHtml,
  description,
}: Props) {
  const { addItem } = useCart();

  const [selectedVariantId, setSelectedVariantId] = React.useState<string | null>(
    variants[0]?.id ?? null
  );
  const [qty, setQty] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [sizeChartOpen, setSizeChartOpen] = React.useState(false);

  const selectedVariant = React.useMemo(
    () => variants.find((v) => v.id === selectedVariantId) ?? null,
    [variants, selectedVariantId]
  );

  const isSelectedVariantOutOfStock =
    !selectedVariant ||
    !selectedVariant.availableForSale ||
    (selectedVariant.quantityAvailable ?? 0) <= 0;

  // agar variant me price/compareAtPrice hai to use karo, warna parent se
  const effectivePrice = selectedVariant?.price ?? price;
  const effectiveCompareAt =
    selectedVariant?.compareAtPrice ?? compareAtPrice ?? null;

  const discount =
    effectiveCompareAt && effectiveCompareAt > effectivePrice
      ? Math.round(
          ((effectiveCompareAt - effectivePrice) / effectiveCompareAt) * 100
        )
      : null;

  const getQtyLabel = (variant: Variant) => {
    const q = variant.quantityAvailable;
    if (q == null) return "";
    if (q <= 0) return " (Out of stock)";
    if (q <= 5) return ` (${q} left)`;
    return ` (${q} pcs)`;
  };

  const maxQty =
    selectedVariant?.quantityAvailable && selectedVariant.quantityAvailable > 0
      ? Math.min(selectedVariant.quantityAvailable, 10)
      : 10;

  const decQty = () => setQty((q) => (q > 1 ? q - 1 : 1));
  const incQty = () => setQty((q) => (q < maxQty ? q + 1 : maxQty));

  const showLowStockLine =
    selectedVariant &&
    (selectedVariant.quantityAvailable ?? 0) > 0 &&
    (selectedVariant.quantityAvailable ?? 0) <= 5;

  // -------------------------------
  // ADD TO BAG -> Shopify Cart API
  // -------------------------------
  const handleAddToBag = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedVariant || isSelectedVariantOutOfStock) return;

    try {
      setLoading(true);

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
        alert("Unable to add to cart right now. Please try again.");
        return;
      }

      // Local cart (drawer) update
      addItem(
        {
          id: selectedVariant.id,
          title,
          variantTitle: selectedVariant.title,
          price: effectivePrice,
          quantity: qty,
        },
        data.cart.checkoutUrl // => CartDrawer se secure checkout karega
      );
    } catch (err) {
      console.error("Add to cart failed", err);
      alert("Something went wrong while adding to cart.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        {/* BRAND + TITLE */}
        {vendor && <div className="pdp-vendor">{vendor}</div>}
        <h1 className="pdp-title">{title}</h1>

        {/* PRICE */}
        <div className="pdp-price-row">
          <div className="pdp-price-main">
            PKR {effectivePrice.toLocaleString("en-PK")}
          </div>

          {effectiveCompareAt && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div className="pdp-price-compare">
                PKR {effectiveCompareAt.toLocaleString("en-PK")}
              </div>
              {discount && (
                <span className="pdp-price-discount">-{discount}%</span>
              )}
            </div>
          )}
        </div>

        {/* STOCK LINE (fixed) */}
        {selectedVariant &&
          selectedVariant.quantityAvailable != null &&
          selectedVariant.quantityAvailable > 0 && (
            <div
              className="pdp-stock-line"
              style={{ fontSize: "0.8rem", color: "#4b5563", marginBottom: 6 }}
            >
              <span style={{ fontWeight: 500 }}>Stock:</span>{" "}
              <span>
                {selectedVariant.quantityAvailable}{" "}
                {selectedVariant.quantityAvailable === 1 ? "pc" : "pcs"}
              </span>
            </div>
          )}

        {/* LOW STOCK MESSAGE */}
        {showLowStockLine && (
          <div className="pdp-low-stock">
            Only a few pieces left — order soon!
          </div>
        )}

        {/* INFO CARD */}
        <div className="pdp-info-card">
          <div className="pdp-info-row">
            <span className="pdp-info-icon">
              <FiZap size={18} />
            </span>
            <div>
              <div className="pdp-info-title">Instant dispatch, no delays</div>
              <div className="pdp-info-sub">
                Orders ship quickly from Factory Mall warehouse.
              </div>
            </div>
          </div>

          <div className="pdp-info-row">
            <span className="pdp-info-icon">
              <FiTruck size={18} />
            </span>
            <div>
              <div className="pdp-info-title">
                Est. shipping within 3–5 working days
              </div>
              <div className="pdp-info-sub">Express delivery • Pakistan</div>
            </div>
          </div>

          <div className="pdp-info-row">
            <span className="pdp-info-icon">
              <FiRefreshCcw size={18} />
            </span>
            <div>
              <div className="pdp-info-title">
                Easy 7 days return and exchange
              </div>
              <div className="pdp-info-sub">
                Return for a different size within 7 days.
              </div>
            </div>
          </div>
        </div>

        {/* SIZE SELECTOR */}
        {variants.length > 0 && (
          <div className="pdp-section">
            <div className="pdp-section-header">
              <div className="pdp-section-label">Size</div>
              <button
                type="button"
                className="pdp-size-chart-btn"
                onClick={() => setSizeChartOpen(true)}
              >
                Size Chart
              </button>
            </div>

            <div className="pdp-size-row">
              {variants.map((v) => {
                const label = v.title + getQtyLabel(v);
                const isSelected = v.id === selectedVariantId;
                const isDisabled =
                  !v.availableForSale || (v.quantityAvailable ?? 0) <= 0;

                return (
                  <button
                    key={v.id}
                    type="button"
                    className={`pdp-size-pill ${
                      isSelected ? "pdp-size-pill--active" : ""
                    }`}
                    disabled={isDisabled}
                    onClick={() => setSelectedVariantId(v.id)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* QUANTITY */}
        <div className="pdp-section">
          <div className="pdp-section-label">Quantity</div>

          <div className="pdp-qty-row">
            <button
              type="button"
              className="pdp-qty-btn"
              onClick={decQty}
              disabled={qty <= 1}
            >
              –
            </button>

            <div className="pdp-qty-value">{qty}</div>

            <button
              type="button"
              className="pdp-qty-btn"
              onClick={incQty}
              disabled={qty >= maxQty}
            >
              +
            </button>
          </div>
        </div>

        {/* ADD TO BAG */}
        <form onSubmit={handleAddToBag} className="pdp-addtocart-form">
          <button
            type="submit"
            className="pdp-addtocart-btn"
            disabled={isSelectedVariantOutOfStock || loading}
          >
            {isSelectedVariantOutOfStock
              ? "Out of Stock"
              : loading
              ? "Adding..."
              : "Add to Bag"}
          </button>
        </form>

        {/* HIGHLIGHTS */}
        <div className="pdp-section">
          <div className="pdp-section-label">Highlights</div>
          <ul className="pdp-highlights">
            <li>Premium quality fabric & finishing</li>
            <li>Ready to wear / unstitched</li>
            <li>Nationwide delivery</li>
          </ul>
        </div>

        {/* DESCRIPTION */}
        <div className="pdp-section">
          <div className="pdp-section-label">Description</div>
          <div className="pdp-description">
            {descriptionHtml ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: descriptionHtml,
                }}
              />
            ) : description ? (
              <p>{description}</p>
            ) : (
              <p>No description available.</p>
            )}
          </div>
        </div>
      </div>

      {/* SIZE CHART MODAL */}
      {sizeChartOpen && (
        <div
          className="pdp-sizechart-overlay"
          onClick={() => setSizeChartOpen(false)}
        >
          <div
            className="pdp-sizechart-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pdp-sizechart-header">
              <h2>Size Chart</h2>
              <button
                type="button"
                className="pdp-sizechart-close"
                onClick={() => setSizeChartOpen(false)}
              >
                ×
              </button>
            </div>

            <p className="pdp-sizechart-sub">
              Measurements are in inches. Slight variations may occur.
            </p>

            <div className="pdp-sizechart-table-wrapper">
              <table className="pdp-sizechart-table">
                <thead>
                  <tr>
                    <th>Size</th>
                    <th>Bust</th>
                    <th>Waist</th>
                    <th>Hip</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>XS</td>
                    <td>32</td>
                    <td>26</td>
                    <td>34</td>
                  </tr>
                  <tr>
                    <td>S</td>
                    <td>34</td>
                    <td>28</td>
                    <td>36</td>
                  </tr>
                  <tr>
                    <td>M</td>
                    <td>36</td>
                    <td>30</td>
                    <td>38</td>
                  </tr>
                  <tr>
                    <td>L</td>
                    <td>38</td>
                    <td>32</td>
                    <td>40</td>
                  </tr>
                  <tr>
                    <td>XL</td>
                    <td>40</td>
                    <td>34</td>
                    <td>42</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="pdp-sizechart-note">
              Tip: If you fall between two sizes, we recommend choosing the
              larger size for a relaxed fit.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
