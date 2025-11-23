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
    window.location.href = lastCheckoutUrl; // Shopify checkout
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-[9999] flex justify-end">
      <div className="bg-white w-full max-w-md h-full p-5 shadow-xl relative">
        <button
          onClick={closeDrawer}
          className="absolute right-4 top-4 text-sm underline"
        >
          Close
        </button>

        <h2 className="text-lg font-semibold mb-5">
          Shopping Bag ({count})
        </h2>

        {items.length === 0 ? (
          <p className="text-sm text-gray-600">Your cart is empty.</p>
        ) : (
          <>
            <div className="max-h-[60vh] overflow-auto space-y-4 pr-2">
              {items.map((i) => (
                <div key={i.id} className="border-b pb-3 text-sm">
                  <div className="font-medium">{i.title}</div>
                  {i.variantTitle && (
                    <div className="text-xs text-gray-500">
                      {i.variantTitle}
                    </div>
                  )}
                  <div className="text-xs text-gray-500">
                    Qty: {i.quantity}
                  </div>

                  <div className="flex justify-between mt-2">
                    <span>
                      PKR {(i.price * i.quantity).toLocaleString("en-PK")}
                    </span>
                    <button
                      className="text-red-500 underline text-xs"
                      onClick={() => removeItem(i.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between mb-3 font-medium">
                <span>Subtotal</span>
                <span>
                  PKR {Math.round(subtotal).toLocaleString("en-PK")}
                </span>
              </div>

              <button
                className="pdp-addtocart-btn w-full"
                disabled={!lastCheckoutUrl}
                onClick={handleCheckoutClick}
              >
                Secure Checkout
              </button>

              {!lastCheckoutUrl && (
                <p className="text-[11px] text-gray-500 mt-2">
                  Add an item again to generate checkout link.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
