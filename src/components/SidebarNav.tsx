// src/components/SidebarNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function SidebarNav() {
  const pathname = usePathname();

  const [openCollections, setOpenCollections] = useState(true);
  const [openBrands, setOpenBrands] = useState(true);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(href);
  };

  const itemClass = (href: string) =>
    "sidebar-item-link" + (isActive(href) ? " sidebar-item-link--active" : "");

  return (
    <nav className="sidebar-nav">
      <div className="sidebar-container">
        {/* HOME LINK */}
        <Link href="/" className={itemClass("/")}>
          Home
        </Link>

        {/* COLLECTIONS SECTION */}
        <button
          type="button"
          className="sidebar-head-btn"
          onClick={() => setOpenCollections((v) => !v)}
        >
          <span>Collections</span>
          <span
            className={
              "sidebar-arrow" +
              (openCollections ? " sidebar-arrow--open" : "")
            }
          >
            ˅
          </span>
        </button>

        {openCollections && (
          <div className="sidebar-list">
            <Link
              href="/collections/women-clothing"
              className={itemClass("/collections/women-clothing")}
            >
              Women Clothing
            </Link>
            <Link
              href="/collections/scents"
              className={itemClass("/collections/scents")}
            >
              Scents
            </Link>
            <Link
              href="/collections/ready-to-wear"
              className={itemClass("/collections/ready-to-wear")}
            >
              Ready to Wear
            </Link>
          </div>
        )}

        {/* BRANDS SECTION */}
        <button
          type="button"
          className="sidebar-head-btn"
          onClick={() => setOpenBrands((v) => !v)}
        >
          <span>Brands</span>
          <span
            className={
              "sidebar-arrow" + (openBrands ? " sidebar-arrow--open" : "")
            }
          >
            ˅
          </span>
        </button>

        {openBrands && (
          <div className="sidebar-list">
            {/* Brand Page */}
            <Link href="/brands" className={itemClass("/brands")}>
              All Brands
            </Link>

            <Link
              href="/brands/looms"
              className={itemClass("/brands/looms")}
            >
              Looms
            </Link>
            <Link
              href="/brands/mtj-fragrances"
              className={itemClass("/brands/mtj-fragrances")}
            >
              MTJ Fragrances
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
