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
    lastCheckoutUrl,
  } = useCart();

  if (!isOpen) return null;

  const handleCheckoutClick = () => {
    if (!lastCheckoutUrl) return;
    // Shopify checkout open
    window.location.href = lastCheckoutUrl;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
      <div className="bg-white h-full w-full max-w-md p-4 shadow-lg relative">
        <button
          className="absolute top-3 right-3 text-sm underline"
          onClick={closeDrawer}
        >
          Close
        </button>

        <h2 className="text-lg font-semibold mb-4">
          Shopping Bag ({count})
        </h2>

        {items.length === 0 ? (
          <p className="text-sm text-gray-500">Your bag is empty.</p>
        ) : (
          <>
            <div className="space-y-3 max-h-[60vh] overflow-auto pr-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b pb-2 text-sm"
                >
                  <div>
                    <div className="font-medium">{item.title}</div>
                    {item.variantTitle && (
                      <div className="text-xs text-gray-500">
                        {item.variantTitle}
                      </div>
                    )}
                    <div className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </div>
                  </div>
                  <div className="text-right">
                    <div>
                      PKR{" "}
                      {Math.round(
                        item.price * item.quantity
                      ).toLocaleString()}
                    </div>
                    <button
                      className="text-[11px] text-gray-500 underline mt-1"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t pt-3">
              <div className="flex justify-between text-sm mb-3">
                <span>Subtotal</span>
                <span>PKR {Math.round(subtotal).toLocaleString()}</span>
              </div>

              <button
                className="pdp-addtocart-btn"
                onClick={handleCheckoutClick}
                disabled={!lastCheckoutUrl}
              >
                Secure checkout
              </button>

              <p className="text-[11px] text-gray-500 mt-2">
                You will be redirected to secure Shopify checkout.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
