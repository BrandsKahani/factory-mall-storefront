// src/components/CartDrawer.tsx
"use client";

import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const {
    items,
    subtotal,
    count,
    isOpen,
    closeDrawer,
    removeItem,
    checkoutUrl,
  } = useCart();

  if (!isOpen) return null;

  const handleCheckout = () => {
  if (!checkoutUrl) return;

  try {
    const url = new URL(checkoutUrl);

    // Agar env set hai to host force kar do .myshopify.com pe
    const checkoutDomain =
      process.env.NEXT_PUBLIC_SHOPIFY_CHECKOUT_DOMAIN || url.host;

    url.protocol = "https:";
    url.host = checkoutDomain;

    window.location.href = url.toString();
  } catch (e) {
    // Agar parsing fail ho jaye to original URL hi open kar do
    console.error("Invalid checkoutUrl, redirecting raw:", e);
    window.location.href = checkoutUrl;
  }
};


  return (
    <div className="cart-overlay">
      <div className="cart-drawer">
        {/* Header */}
        <header className="cart-header">
          <h2 className="cart-title">Shopping Bag ({count})</h2>
          <button className="cart-close" onClick={closeDrawer}>
            Close
          </button>
        </header>

        {/* Body */}
        {items.length === 0 ? (
          <p className="cart-empty">Your bag is empty.</p>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <div key={item.id} className="cart-line">
                  <div className="cart-line-info">
                    <div className="cart-line-title">{item.title}</div>
                    {item.variantTitle && (
                      <div className="cart-line-variant">
                        {item.variantTitle}
                      </div>
                    )}
                    <div className="cart-line-meta">
                      Qty: {item.quantity} • PKR{" "}
                      {Math.round(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                  <button
                    className="cart-line-remove"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <footer className="cart-footer">
              <div className="cart-subtotal-row">
                <span>Subtotal</span>
                <span>PKR {Math.round(subtotal).toLocaleString()}</span>
              </div>

              <button
                className="cart-checkout-btn"
                onClick={handleCheckout}
                disabled={!checkoutUrl}
              >
                Secure checkout
              </button>

              {!checkoutUrl && (
                <p className="cart-note">
                  Checkout link will appear when Shopify cart responds.
                </p>
              )}
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
