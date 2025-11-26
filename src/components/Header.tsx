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
import { useWishlist } from "@/context/WishlistContext";
import MobileMegaMenu from "@/components/MobileMenu";

type NavItem = { label: string; href: string };

const COLLECTIONS: NavItem[] = [
  { label: "Women Clothing", href: "/collections/women-clothing" },
  { label: "Scents", href: "/collections/scents" },
  { label: "Ready to Wear", href: "/collections/ready-to-wear" },
];

const BRANDS: NavItem[] = [
  { label: "Looms", href: "/brands/looms" },
  { label: "MTJ Fragrances", href: "/brands/mtj-fragrances" },
];

/* Desktop Dropdown Item */
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
        className={"header-dropdown" + (open ? " header-dropdown--open" : "")}
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
  const { count: cartCount, toggleDrawer } = useCart();
  const { count: wishlistCount } = useWishlist();
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const isActivePrefix = (prefix: string) =>
    pathname === prefix || pathname?.startsWith(prefix + "/");

  // Prevent body scroll when menu or search is open
  useEffect(() => {
    const lock = mobileMenuOpen || searchOpen;
    document.body.style.overflow = lock ? "hidden" : "";
  }, [mobileMenuOpen, searchOpen]);

  return (
    <>
      <div className="sticky-header">
        {/* TOP BAR */}
        <div className="header-topbar">
          <div className="header-topbar-inner">
            Mega Sale • Upto 25% Off • Delivery Nationwide
          </div>
        </div>

        {/* MAIN HEADER */}
        <header className="header-main">
          <div className="header-main-inner">
            {/* LEFT SIDE */}
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button */}
              <button
                type="button"
                className="header-mobile-toggle"
                onClick={() => setMobileMenuOpen(true)}
              >
                <FiMenu size={20} />
              </button>

              {/* Logo */}
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

            {/* NAV — Desktop Only */}
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

            {/* RIGHT ICONS */}
            <div className="header-right">
              {/* Search */}
              <button
                type="button"
                className="header-icon-btn"
                onClick={() => setSearchOpen(true)}
              >
                <FiSearch size={18} />
              </button>

              {/* Wishlist */}
              <Link href="/wishlist" className="header-icon-btn relative">
                <FiHeart size={18} />
                {wishlistCount > 0 && (
                  <span className="header-cart-badge">{wishlistCount}</span>
                )}
              </Link>

              {/* Account / Login */}
              <Link href="/account/login" className="header-icon-btn">
                <FiUser size={18} />
              </Link>

              {/* Cart */}
              <button
                type="button"
                className="header-cart-btn"
                onClick={toggleDrawer}
              >
                <FiShoppingBag size={16} />
                <span className="hidden sm:inline">Cart</span>
                {cartCount > 0 && (
                  <span className="header-cart-badge">{cartCount}</span>
                )}
              </button>
            </div>
          </div>

          {/* SEARCH OVERLAY */}
          {searchOpen && (
            <div className="search-overlay" onClick={() => setSearchOpen(false)}>
              <div
                className="search-modal"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="search-header">
                  <h2 className="text-sm font-medium">Search Products</h2>
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
                    placeholder="Search brands, products..."
                  />
                  <p className="search-hint">
                    Example: “Looms”, “Fragrance”, “Women”
                  </p>
                </div>
              </div>
            </div>
          )}
        </header>
      </div>

      {/* MOBILE MENU */}
      <MobileMegaMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}
