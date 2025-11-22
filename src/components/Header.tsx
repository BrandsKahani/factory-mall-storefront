// src/components/Header.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  FiMenu,
  FiX,
  FiSearch,
  FiUser,
  FiHeart,
  FiShoppingBag,
  FiChevronDown,
} from "react-icons/fi";
import { useCart } from "@/context/CartContext";

type NavItem = {
  label: string;
  href: string;
};

const COLLECTIONS: NavItem[] = [
  { label: "Women Clothing", href: "/collections/women-clothing" },
  { label: "Scents", href: "/collections/scents" },
  { label: "Ready to Wear", href: "/collections/ready-to-wear" },
];

const BRANDS: NavItem[] = [
  { label: "Looms", href: "/brands/looms" },
  { label: "MTJ Fragrances", href: "/brands/mtj-fragrances" },
];

/** Desktop dropdown item */
function HeaderNavItem({
  label,
  items,
  active,
}: {
  label: string;
  items: NavItem[];
  active?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="header-nav-item-wrapper"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={
          "header-nav-button" + (active ? " header-nav-button--active" : "")
        }
      >
        <span>{label}</span>
        <FiChevronDown
          size={14}
          className={
            "header-nav-chevron" + (open ? " header-nav-chevron--open" : "")
          }
        />
      </button>

      <div
        className={
          "header-dropdown" + (open ? " header-dropdown--open" : "")
        }
      >
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="dropdown-item">
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Header() {
  const { count, toggleDrawer } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  const isActivePrefix = (prefix: string) =>
    pathname === prefix || pathname?.startsWith(prefix + "/");

  // body scroll lock for mobile menu
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div className="sticky-header">
      {/* Top black strip */}
      <div className="header-topbar">
        <div className="header-topbar-inner">
          Mega Sale • Upto 50% Off • Free Delivery Nationwide
        </div>
      </div>

      {/* Main header */}
      <header className="header-main">
        <div className="header-main-inner">
          {/* LEFT: mobile burger + logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="header-mobile-toggle"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <FiMenu size={20} />
            </button>

            <Link href="/">
              <Image
                src="/factorymall-logo.png"
                alt="Factory Mall"
                width={150}
                height={40}
                className="header-logo-img"
              />
            </Link>
          </div>

          {/* CENTER: desktop nav */}
          <nav className="header-nav-desktop">
            <Link
              href="/"
              className={
                "header-nav-link" +
                (pathname === "/" ? " header-nav-link--active" : "")
              }
            >
              Home
            </Link>

            <HeaderNavItem
              label="Collections"
              items={COLLECTIONS}
              active={isActivePrefix("/collections")}
            />

            <HeaderNavItem
              label="Brands"
              items={[{ label: "Brand Page", href: "/brands" }, ...BRANDS]}
              active={isActivePrefix("/brands")}
            />
          </nav>

          {/* RIGHT: icons + cart */}
          <div className="header-right">
            <button
              type="button"
              className="header-icon-btn"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <FiSearch size={18} />
            </button>

            <button
              type="button"
              className="header-icon-btn"
              aria-label="Wishlist"
            >
              <FiHeart size={18} />
            </button>

            <button
              type="button"
              className="header-icon-btn"
              aria-label="Account"
            >
              <FiUser size={18} />
            </button>

            <button
              type="button"
              className="header-cart-btn"
              onClick={toggleDrawer}
            >
              <FiShoppingBag size={16} />
              <span>Cart</span>
              {count > 0 && (
                <span className="header-cart-badge">{count}</span>
              )}
            </button>
          </div>
        </div>

        {/* MOBILE MENU DRAWER */}
        <div
          className={
            "mobile-menu-overlay" +
            (mobileOpen ? " mobile-menu-overlay--open" : "")
          }
          onClick={() => setMobileOpen(false)}
          aria-hidden={!mobileOpen}
        >
          <nav
            className={
              "mobile-menu" + (mobileOpen ? " mobile-menu--open" : "")
            }
            onClick={(e) => e.stopPropagation()}
            aria-label="Mobile navigation"
          >
            <div className="mobile-menu-header">
              <span className="mobile-menu-title">Menu</span>
              <button
                type="button"
                className="header-icon-btn"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="mobile-menu-list">
              <Link
                href="/"
                className="mobile-item"
                onClick={() => setMobileOpen(false)}
              >
                Home
              </Link>

              <span className="mobile-section-title">Collections</span>
              <Link
                href="/collections/women-clothing"
                className="mobile-item"
                onClick={() => setMobileOpen(false)}
              >
                Women Clothing
              </Link>
              <Link
                href="/collections/scents"
                className="mobile-item"
                onClick={() => setMobileOpen(false)}
              >
                Scents
              </Link>
              <Link
                href="/collections/ready-to-wear"
                className="mobile-item"
                onClick={() => setMobileOpen(false)}
              >
                Ready to Wear
              </Link>

              <span className="mobile-section-title">Brands</span>
              <Link
                href="/brands"
                className="mobile-item"
                onClick={() => setMobileOpen(false)}
              >
                Brand Page
              </Link>
              <Link
                href="/brands/looms"
                className="mobile-item"
                onClick={() => setMobileOpen(false)}
              >
                Looms
              </Link>
              <Link
                href="/brands/mtj-fragrances"
                className="mobile-item"
                onClick={() => setMobileOpen(false)}
              >
                MTJ Fragrances
              </Link>
            </div>
          </nav>
        </div>

        {/* SEARCH MODAL */}
        {searchOpen && (
          <div
            className="search-overlay"
            onClick={() => setSearchOpen(false)}
          >
            <div
              className="search-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="search-header">
                <h2>Search products</h2>
                <button
                  type="button"
                  className="header-icon-btn"
                  onClick={() => setSearchOpen(false)}
                >
                  <FiX size={18} />
                </button>
              </div>

              <div className="search-body">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search fashion, brands & more"
                />
                <p className="search-hint">
                  Example: &quot;Looms lawn&quot; or &quot;Scents&quot;
                </p>
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
