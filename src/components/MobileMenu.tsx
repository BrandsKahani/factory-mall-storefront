"use client";

import { FiX, FiChevronRight } from "react-icons/fi";
import Link from "next/link";

export default function MobileMenu({ close }: { close: () => void }) {
  return (
    <div className="mobile-menu-overlay">
      <div className="mobile-menu">
        
        <div className="mobile-menu-header">
          <h3>Menu</h3>
          <button onClick={close}>
            <FiX size={22} />
          </button>
        </div>

        <div className="mobile-menu-list">
          <Link href="/collections/women" className="mobile-item">
            Women <FiChevronRight size={16} />
          </Link>

          <Link href="/collections/men" className="mobile-item">
            Men <FiChevronRight size={16} />
          </Link>

          <Link href="/collections/kids" className="mobile-item">
            Kids <FiChevronRight size={16} />
          </Link>

          <Link href="/collections/brands" className="mobile-item">
            Brands <FiChevronRight size={16} />
          </Link>
        </div>

      </div>
    </div>
  );
}
