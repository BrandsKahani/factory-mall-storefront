"use client";

import { useState } from "react";
import Link from "next/link";
import { MAIN_MENU } from "@/data/menu";
import { FiChevronRight, FiChevronLeft, FiX } from "react-icons/fi";

export default function MobileMegaMenu({ open, onClose }: any) {
  const [level, setLevel] = useState<"main" | "submenu">("main");
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
      className={`fixed inset-0 bg-black/40 z-50 transition-opacity ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className={`absolute left-0 top-0 w-80 h-full bg-white shadow-xl transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b">
          {level === "submenu" ? (
            <button onClick={goBack} className="p-2">
              <FiChevronLeft size={20} />
            </button>
          ) : (
            <div />
          )}

          <h2 className="text-base font-medium">
            {level === "main" ? "Menu" : submenu?.label}
          </h2>

          <button className="p-2" onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        {/* MAIN LEVEL */}
        {level === "main" && (
          <div className="p-3 space-y-1">
            {MAIN_MENU.map((item) => (
              <button
                key={item.label}
                className="w-full flex justify-between items-center py-3 border-b text-left"
                onClick={() => goToSubmenu(item)}
              >
                <span>{item.label}</span>
                <FiChevronRight />
              </button>
            ))}
          </div>
        )}

        {/* SUBMENU LEVEL */}
        {level === "submenu" && (
          <div className="p-3 space-y-1 animate-fade">
            {submenu?.children?.map((child: any) => (
              <Link
                key={child.href}
                href={child.href}
                onClick={onClose}
                className="block py-3 border-b text-sm"
              >
                {child.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
