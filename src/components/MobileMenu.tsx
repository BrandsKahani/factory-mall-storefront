"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FiChevronRight,
  FiChevronLeft,
  FiX,
  FiHeart,
  FiUser,
  FiShoppingBag,
  FiSearch,
} from "react-icons/fi";

// ✅ CORRECT IMPORT (matches your folder structure)
import { MAIN_MENU } from "@/data/menu";

type Level = "main" | "submenu";

export default function MobileMegaMenu({ open, onClose }: any) {
  const [level, setLevel] = useState<Level>("main");
  const [submenu, setSubmenu] = useState<any>(null);

  const goToSubmenu = (item: any) => {
    setSubmenu(item);
    setLevel("submenu");
  };

  const goBack = () => {
    setLevel("main");
    setSubmenu(null);
  };

  return (
    <div
      className={`fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      {/* Drawer Panel */}
      <div
        className={`absolute left-0 top-0 h-full w-80 max-w-[82%] bg-white shadow-2xl rounded-r-3xl flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ========== TOP BAR ========== */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-gray-50">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/factorymall-logo.png" width={80} height={32} alt="Logo" />
          </Link>

          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-gray-200 transition">
              <FiSearch size={20} />
            </button>

            <button
              className="p-2 rounded-full hover:bg-gray-200 transition"
              onClick={onClose}
            >
              <FiX size={22} />
            </button>
          </div>
        </div>

        {/* ========== MENU TITLE BAR ========== */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
          {level === "submenu" ? (
            <button
              onClick={goBack}
              className="p-2 rounded-full hover:bg-gray-200 transition"
            >
              <FiChevronLeft size={20} />
            </button>
          ) : (
            <span className="w-6" />
          )}

          <h2 className="text-sm font-semibold tracking-wide">
            {level === "main" ? "Browse Categories" : submenu?.label}
          </h2>

          <span className="w-6" />
        </div>

        {/* ========== SLIDING CONTENT ========== */}
        <div className="relative flex-1 overflow-hidden">
          {/* MAIN MENU */}
          <div
            className={`absolute inset-0 px-4 pt-4 pb-6 space-y-2 transition-transform duration-300 ${
              level === "main" ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {MAIN_MENU.map((item) => (
              <button
                key={item.label}
                onClick={() => goToSubmenu(item)}
                className="w-full flex items-center justify-between px-5 py-3.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition text-[15px] font-medium"
              >
                {item.label}
                <FiChevronRight className="text-gray-400" />
              </button>
            ))}
          </div>

          {/* SUBMENU */}
          <div
            className={`absolute inset-0 px-4 pt-4 pb-6 space-y-2 transition-transform duration-300 ${
              level === "submenu" ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {submenu?.children?.map((child: any) => (
              <Link
                key={child.href}
                href={child.href}
                onClick={onClose}
                className="block px-5 py-3.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition text-[15px]"
              >
                {child.label}
              </Link>
            ))}
          </div>
        </div>

        {/* ========== FOOTER ICONS ========== */}
        <div className="border-t border-gray-200 bg-gray-50 px-5 py-4 flex items-center justify-between">
          <Link
            href="/account"
            className="flex flex-col items-center text-gray-700 hover:text-black transition"
          >
            <FiUser size={20} />
            <span className="text-[11px] mt-1">Account</span>
          </Link>

          <Link
            href="/wishlist"
            className="flex flex-col items-center text-gray-700 hover:text-black transition"
          >
            <FiHeart size={20} />
            <span className="text-[11px] mt-1">Wishlist</span>
          </Link>

          <Link
            href="/cart"
            className="flex flex-col items-center text-gray-700 hover:text-black transition"
          >
            <FiShoppingBag size={20} />
            <span className="text-[11px] mt-1">Cart</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
