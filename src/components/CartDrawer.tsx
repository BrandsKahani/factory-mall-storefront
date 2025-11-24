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
  } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full p-4 relative shadow-xl">
        <button
          onClick={closeDrawer}
          className="absolute top-3 right-3 text-sm underline"
        >
          Close
        </button>

        <h2 className="text-lg font-semibold mb-3">
          Shopping Bag ({items.length})
        </h2>

        {items.length === 0 ? (
          <p>Your bag is empty.</p>
        ) : (
          <>
            {/* LIST */}
            <div className="max-h-[60vh] overflow-auto pr-2">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="border-b py-2 flex justify-between text-sm"
                >
                  <div>
                    <div className="font-medium">{it.title}</div>
                    {it.variantTitle && (
                      <div className="text-xs text-gray-500">
                        {it.variantTitle}
                      </div>
                    )}
                    <div className="text-xs">Qty: {it.quantity}</div>
                  </div>

                  <div className="text-right">
                    PKR {(it.price * it.quantity).toLocaleString()}
                    <div>
                      <button
                        onClick={() => removeItem(it.id)}
                        className="text-xs underline text-gray-400"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* FOOTER */}
            <div className="border-t mt-4 pt-3">
              <div className="flex justify-between mb-3">
                <span>Subtotal</span>
                <span>PKR {subtotal.toLocaleString()}</span>
              </div>

              <a
                href={lastCheckoutUrl ?? "#"}
                className="pdp-addtocart-btn block text-center"
              >
                Secure Checkout
              </a>

              <p className="text-xs text-gray-500 mt-2">
                Checkout securely on Shopify.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
