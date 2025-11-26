"use client";

import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const {
    items,
    subtotal,
    isOpen,
    closeDrawer,
    lastCheckoutUrl,
    removeItem,
    updateItemQuantity,
    clearCart,
  } = useCart();

  if (!isOpen) return null;

  const handleOverlayClick = () => {
    closeDrawer();
  };

  const handleInnerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleDec = (
    id: string,
    variantTitle: string | null | undefined,
    qty: number
  ) => {
    if (qty <= 1) return;
    updateItemQuantity(id, variantTitle ?? null, qty - 1);
  };

  const handleInc = (
    id: string,
    variantTitle: string | null | undefined,
    qty: number
  ) => {
    updateItemQuantity(id, variantTitle ?? null, qty + 1);
  };

  const handleCheckout = () => {
    if (!lastCheckoutUrl) return;
    window.location.href = lastCheckoutUrl;
  };

  return (
    <div
      className="cart-overlay fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px]"
      onClick={handleOverlayClick}
    >
      <aside
        className="cart-drawer absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in"
        onClick={handleInnerClick}
      >
        {/* HEADER */}
        <div className="cart-header flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h2 className="cart-title text-sm font-semibold tracking-wide uppercase text-gray-700">
            Shopping Bag {items.length > 0 && `(${items.length})`}
          </h2>
          <button
            type="button"
            className="cart-close text-xs text-gray-500 hover:text-gray-900"
            onClick={closeDrawer}
          >
            Close ✕
          </button>
        </div>

        {/* BODY */}
        <div className="cart-items flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {items.length === 0 ? (
            <div className="cart-empty text-sm text-gray-500 mt-6 text-center">
              Your bag is empty.
            </div>
          ) : (
            items.map((it) => (
              <div
                key={`${it.id}-${it.variantTitle ?? "default"}`}
                className="cart-line flex items-start justify-between gap-3 border-b border-gray-100 pb-3 last:border-0"
              >
                {/* LEFT: thumbnail + info */}
                <div className="flex gap-3">
                  {it.imageUrl && (
                    <div className="w-16 h-20 rounded-md overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0">
                      <img
                        src={it.imageUrl}
                        alt={it.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div>
                    <div className="cart-line-title text-sm font-medium text-gray-900">
                      {it.title}
                    </div>
                    {it.variantTitle && (
                      <div className="cart-line-variant text-xs text-gray-500 mt-0.5">
                        {it.variantTitle}
                      </div>
                    )}

                    {/* QTY STEP + REMOVE */}
                    <div className="cart-line-meta mt-2 flex items-center gap-2 text-xs text-gray-600">
                      <span>Qty:</span>
                      <div className="inline-flex items-center rounded-full border border-gray-200 overflow-hidden">
                        <button
                          type="button"
                          className="pdp-qty-btn w-6 h-6 text-xs"
                          onClick={() =>
                            handleDec(
                              it.id,
                              it.variantTitle ?? null,
                              it.quantity
                            )
                          }
                          disabled={it.quantity <= 1}
                        >
                          –
                        </button>
                        <span className="px-2">{it.quantity}</span>
                        <button
                          type="button"
                          className="pdp-qty-btn w-6 h-6 text-xs"
                          onClick={() =>
                            handleInc(
                              it.id,
                              it.variantTitle ?? null,
                              it.quantity
                            )
                          }
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        className="cart-line-remove text-[11px] text-gray-400 hover:text-red-500 ml-1"
                        onClick={() =>
                          removeItem(it.id, it.variantTitle ?? null)
                        }
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>

                {/* RIGHT: price */}
                <div className="text-right text-sm font-medium text-gray-900">
                  PKR {(it.price * it.quantity).toLocaleString("en-PK")}
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER */}
        {items.length > 0 && (
          <div className="cart-footer border-t border-gray-100 px-4 py-3 space-y-3">
            <div className="cart-subtotal-row flex items-center justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold text-gray-900">
                PKR {subtotal.toLocaleString("en-PK")}
              </span>
            </div>

            <button
              type="button"
              className="cart-checkout-btn w-full h-11 rounded-full bg-gray-900 text-white text-sm font-medium shadow-sm hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              onClick={handleCheckout}
              disabled={!lastCheckoutUrl}
            >
              Secure Checkout
            </button>

            <button
              type="button"
              className="cart-secondary-link w-full text-xs text-gray-500 underline underline-offset-2"
              onClick={clearCart}
            >
              Clear bag
            </button>

            <p className="cart-note text-[11px] text-gray-400">
              Checkout is processed securely on Shopify.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
