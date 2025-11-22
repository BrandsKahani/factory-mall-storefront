// src/components/BrandsGridClient.tsx
"use client";

import { useMemo, useState } from "react";

export type BrandData = {
  name: string;
  productCount: number;
  imageUrl: string | null;
};

type Props = {
  initialBrands: BrandData[];
};

function slugifyBrand(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function BrandsGridClient({ initialBrands }: Props) {
  const [sortType, setSortType] = useState<"az" | "za" | "most">("az");

  const sortedBrands = useMemo(() => {
    const arr = [...initialBrands];

    if (sortType === "az") {
      arr.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortType === "za") {
      arr.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortType === "most") {
      arr.sort((a, b) => b.productCount - a.productCount);
    }

    return arr;
  }, [sortType, initialBrands]);

  return (
    <>
      {/* Sorting dropdown */}
      <div style={{ marginBottom: "1rem" }}>
        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value as any)}
          className="brand-sort-dropdown"
        >
          <option value="az">A → Z</option>
          <option value="za">Z → A</option>
          <option value="most">Most Products</option>
        </select>
      </div>

      {/* Brands grid */}
      <section className="brands-grid-section">
        <div className="brands-grid">
          {sortedBrands.map((brand) => (
            <a
              key={brand.name}
              href={`/brands/${slugifyBrand(brand.name)}`}
              className="brand-card"
            >
              <div className="brand-img-box">
                {brand.imageUrl ? (
                  <img src={brand.imageUrl} alt={brand.name} className="brand-img" />
                ) : (
                  <div className="brand-img-placeholder">No Image</div>
                )}
              </div>

              <div className="brand-name">Brand</div>
              <h3 className="brand-title">{brand.name}</h3>

              <div className="brand-meta">
                <span>{brand.productCount} Products</span>
                <span className="brand-link">View →</span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
