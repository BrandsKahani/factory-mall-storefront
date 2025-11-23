"use client";

import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const { items, subtotal, count, isOpen, closeDrawer, removeItem, checkoutUrl } =
    useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
      <div className="bg-white h-full w-full max-w-md p-5 shadow-xl relative">
        <button
          className="absolute top-3 right-3 text-sm underline"
          onClick={closeDrawer}
        >
          Close
        </button>

        <h2 className="text-lg font-semibold mb-4">Shopping Bag ({count})</h2>

        {items.length === 0 ? (
          <p>Your bag is empty.</p>
        ) : (
          <>
            <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-3">
              {items.map((item) => (
                <div
                  key={item.id + item.variantTitle}
                  className="border-b pb-2 flex justify-between"
                >
                  <div>
                    <div className="font-medium">{item.title}</div>
                    {item.variantTitle && (
                      <div className="text-xs text-gray-600">
                        {item.variantTitle}
                      </div>
                    )}
                    <div className="text-xs">Qty: {item.quantity}</div>
                  </div>

                  <div className="text-right">
                    PKR {Math.round(item.price * item.quantity).toLocaleString()}
                    <button
                      className="block text-xs underline mt-1"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between text-sm mb-3">
                <span>Subtotal</span>
                <span>PKR {subtotal.toLocaleString()}</span>
              </div>

              <button
                className="pdp-addtocart-btn w-full"
                onClick={() => checkoutUrl && (window.location.href = checkoutUrl)}
              >
                Secure Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
