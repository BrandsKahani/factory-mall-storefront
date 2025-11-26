// src/components/home/HomeHero.tsx
"use client";

import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

/** Shopify se ane wala hero banner */
export type HeroBanner = {
  id: string;
  desktopUrl: string;
  mobileUrl?: string | null;
  altText?: string | null;
  linkUrl?: string | null;
};

type Props = {
  banners: HeroBanner[];
};

export default function HomeHero({ banners }: Props) {
  const [index, setIndex] = useState(0);

  // safety
  if (!banners || banners.length === 0) return null;

  // Auto slide
  useEffect(() => {
    if (!banners.length) return;

    const id = setInterval(() => {
      setIndex((i) => (i + 1) % banners.length);
    }, 4000);

    return () => clearInterval(id);
  }, [banners.length]);

  const goNext = () => {
    setIndex((i) => (i + 1) % banners.length);
  };

  const goPrev = () => {
    setIndex((i) => (i - 1 + banners.length) % banners.length);
  };

  return (
    <section className="home-hero">
      <div className="hero-slider">
        {/* Slides */}
        {banners.map((b, i) => (
          <a
            key={b.id}
            href={b.linkUrl || "#"}
            className={`hero-slide ${i === index ? "active" : ""}`}
          >
            <picture>
              {/* Mobile: 4:5 */}
              <source
                media="(max-width: 767px)"
                srcSet={b.mobileUrl || b.desktopUrl}
              />
              {/* Desktop: wide */}
              <img
                src={b.desktopUrl}
                alt={b.altText || "Factory Mall banner"}
              />
            </picture>
          </a>
        ))}

        {/* LEFT ARROW */}
        <button className="hero-arrow hero-arrow-left" onClick={goPrev}>
          <FaChevronLeft size={20} />
        </button>

        {/* RIGHT ARROW */}
        <button className="hero-arrow hero-arrow-right" onClick={goNext}>
          <FaChevronRight size={20} />
        </button>

        {/* DOT INDICATORS */}
        <div className="hero-dots">
          {banners.map((b, i) => (
            <button
              key={b.id}
              className={`hero-dot ${i === index ? "active" : ""}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
