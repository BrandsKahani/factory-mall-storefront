"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  FiMenu,
  FiSearch,
  FiUser,
  FiHeart,
  FiShoppingBag,
  FiChevronDown,
} from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import MobileMegaMenu from "@/components/MobileMenu";
import SearchModal from "@/components/SearchModal";

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
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const isActivePrefix = (prefix: string) =>
    pathname === prefix || pathname?.startsWith(prefix + "/");

  // body scroll lock for mobile menu + search
  useEffect(() => {
    const shouldLock = mobileMenuOpen || searchOpen;
    if (shouldLock) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen, searchOpen]);

  return (
    <>
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
                onClick={() => setMobileMenuOpen(true)}
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

            {/* RIGHT: icons + cart  (Wishlist → Login → Search → Cart) */}
            <div className="header-right">
              {/* Wishlist */}
              <Link href="/wishlist" aria-label="Wishlist">
                <button type="button" className="header-icon-btn">
                  <FiHeart size={18} />
                </button>
              </Link>

              {/* Account / Login */}
              <button
                type="button"
                className="header-icon-btn"
                aria-label="Account"
                // TODO: link this to real login page later
              >
                <FiUser size={18} />
              </button>

              {/* Search */}
              <button
                type="button"
                className="header-icon-btn"
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
              >
                <FiSearch size={18} />
              </button>

              {/* Cart */}
              <button
                type="button"
                className="header-cart-btn"
                onClick={toggleDrawer}
                aria-label="Open cart"
              >
                <FiShoppingBag size={16} />
                <span className="hidden sm:inline">Cart</span>
                {count > 0 && (
                  <span className="header-cart-badge">{count}</span>
                )}
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* MOBILE MEGA MENU OVERLAY */}
      <MobileMegaMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* SEARCH MODAL (autocomplete) */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
