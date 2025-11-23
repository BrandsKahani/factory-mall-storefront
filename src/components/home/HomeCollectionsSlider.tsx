// src/components/home/HomeCollectionsSlider.tsx
"use client";

import Link from "next/link";
import { useRef } from "react";

export type CollectionTile = {
  title: string;
  link: string;
  imageUrl: string | null;
};

type Props = {
  items: CollectionTile[];
};

export default function HomeCollectionsSlider({ items }: Props) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scrollByX = (delta: number) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: delta, behavior: "smooth" });
  };

  if (!items.length) return null;

  return (
    <div className="home-collections-slider-wrapper">
      {/* LEFT ARROW */}
      <button
        type="button"
        className="home-collections-arrow left"
        onClick={() => scrollByX(-260)}
      >
        ‹
      </button>

      {/* SCROLL ROW */}
      <div className="home-collections-slider" ref={scrollRef}>
        {items.map((item, idx) => (
          <Link key={idx} href={item.link || "#"} className="home-collection-card">
            <div className="home-collection-imgbox">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="home-collection-img"
                />
              ) : (
                <div className="home-collection-img-placeholder">
                  {item.title}
                </div>
              )}
            </div>

            <div className="home-collection-text">
              <div className="home-collection-label">Collection</div>
              <div className="home-collection-title">{item.title}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* RIGHT ARROW */}
      <button
        type="button"
        className="home-collections-arrow right"
        onClick={() => scrollByX(260)}
      >
        ›
      </button>
    </div>
  );
}
