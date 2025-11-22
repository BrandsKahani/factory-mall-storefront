// src/components/RecentlyViewedClient.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type MiniProduct = {
  handle: string;
  title: string;
  imageUrl?: string;
  price?: number;
};

type RecentlyViewedProps = {
  current: MiniProduct;
};

const STORAGE_KEY = "fm_recently_viewed";

export default function RecentlyViewedClient({ current }: RecentlyViewedProps) {
  const [items, setItems] = useState<MiniProduct[]>([]);

  useEffect(() => {
    if (!current?.handle) return;

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      let list: MiniProduct[] = raw ? JSON.parse(raw) : [];

      // remove current if already exist
      list = list.filter((p) => p.handle !== current.handle);
      list.unshift(current);

      if (list.length > 10) list = list.slice(0, 10);

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));

      // show others (excluding current)
      setItems(list.slice(1, 5));
    } catch (e) {
      console.error("Recently viewed error", e);
    }
  }, [current]);

  if (!items.length) return null;

  return (
    <section className="home-section" style={{ marginTop: "2rem" }}>
      <div className="home-section-title" style={{ marginBottom: "0.75rem" }}>
        Recently Viewed
      </div>

      <div className="product-grid">
        {items.map((p) => (
          <Link key={p.handle} href={`/products/${p.handle}`} className="laam-card">
            <div className="laam-card-imgbox">
              {p.imageUrl && (
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  className="laam-card-img main-img"
                />
              )}
            </div>
            <div className="laam-card-body">
              <div className="laam-title">{p.title}</div>
              {typeof p.price === "number" && (
                <div className="laam-price-row">
                  <div className="laam-price">
                    PKR {p.price.toLocaleString("en-PK")}
                  </div>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
