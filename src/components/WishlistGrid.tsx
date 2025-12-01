"use client";

import Image from "next/image";
import Link from "next/link";
import { FiX, FiShoppingBag } from "react-icons/fi";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

export default function WishlistGrid() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const moveToCart = (item: any) => {
    addToCart({
      handle: item.handle,
      title: item.title,
      imageUrl: item.imageUrl,
      price: item.price,
      quantity: 1,
    });

    removeFromWishlist(item.handle);
    toast.success("Moved to cart!");
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        Your wishlist is empty.
      </div>
    );
  }

  return (
    <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {items.map((item) => (
        <div
          key={item.handle}
          className="relative bg-white border rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
        >
          <button
            onClick={() => {
              removeFromWishlist(item.handle);
              toast.error("Removed from wishlist");
            }}
            className="absolute top-3 right-3 z-10 bg-white p-1.5 rounded-full shadow hover:bg-gray-100 transition"
          >
            <FiX size={16} />
          </button>

          <Link href={`/products/${item.handle}`}>
            <div className="relative w-full aspect-square">
              <Image
                src={item.imageUrl || "/placeholder.png"}
                alt={item.title}
                fill
                className="object-cover rounded-t-lg"
              />
            </div>
          </Link>

          <div className="p-3">
            <Link href={`/products/${item.handle}`}>
              <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 min-h-[40px]">
                {item.title}
              </h3>

              {item.price && (
                <p className="text-sm font-bold text-gray-900 mt-2">
                  PKR {item.price.toLocaleString()}
                </p>
              )}
            </Link>

            <button
              onClick={() => moveToCart(item)}
              className="w-full mt-3 py-2 text-sm font-medium bg-black text-white rounded-lg hover:bg-gray-800 flex items-center justify-center gap-2 transition"
            >
              <FiShoppingBag size={16} />
              Move to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
