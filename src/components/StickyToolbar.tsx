"use client";

import Link from "next/link";
import {
  FiHome,
  FiGrid,
  FiSearch,
  FiHeart,
  FiShoppingBag,
} from "react-icons/fi";
import { useCart } from "@/context/CartContext";

export default function StickyToolbar() {
  const { items, toggleDrawer } = useCart();

  const openSearchDrawer = () => {
    window.dispatchEvent(new CustomEvent("open-search"));
  };

  return (
    <div
      className="
        fixed bottom-0 left-0 right-0 z-[999]
        bg-white border-t border-gray-200 
        flex justify-between items-center
        px-6 py-3
        md:hidden
      "
    >
      {/* HOME */}
      <Link
        href="/"
        className="flex flex-col items-center text-gray-600 hover:text-black transition"
      >
        <FiHome size={22} />
        <span className="text-[11px] mt-1">Home</span>
      </Link>

      {/* COLLECTIONS */}
      <Link
        href="/collections"
        className="flex flex-col items-center text-gray-600 hover:text-black transition"
      >
        <FiGrid size={22} />
        <span className="text-[11px] mt-1">Collections</span>
      </Link>

      {/* SEARCH */}
      <button
        className="flex flex-col items-center text-gray-600 hover:text-black transition"
        onClick={openSearchDrawer}
      >
        <FiSearch size={22} />
        <span className="text-[11px] mt-1">Search</span>
      </button>

      {/* WISHLIST */}
      <Link
        href="/wishlist"
        className="flex flex-col items-center text-gray-600 hover:text-black transition"
      >
        <FiHeart size={22} />
        <span className="text-[11px] mt-1">Wishlist</span>
      </Link>

      {/* CART (FIXED VERSION) */}
      <button
        type="button"
        onClick={toggleDrawer}
        className="relative flex flex-col items-center text-gray-600 hover:text-black transition"
      >
        <FiShoppingBag size={22} />

        {items.length > 0 && (
          <span
            className="
              absolute -top-1.5 -right-2
              bg-red-500 text-white 
              text-[10px] px-1.5 py-[1px]
              rounded-full font-medium
            "
          >
            {items.length}
          </span>
        )}

        <span className="text-[11px] mt-1">Cart</span>
      </button>
    </div>
  );
}
