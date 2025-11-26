"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export type HeroBanner = {
  id: string;
  imageUrl: string;
  mobileImageUrl?: string | null;
  alt?: string | null;
  linkUrl?: string | null;
};

type Props = {
  banners: HeroBanner[];
};

export default function HomeHero({ banners }: Props) {
  const [index, setIndex] = useState(0);

  // ✅ Hooks always run, no condition – ESLint error solve
  useEffect(() => {
    if (!banners.length) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % banners.length);
    }, 4000);
    return () => clearInterval(id);
  }, [banners.length]);

  if (!banners.length) return null;

  const current = banners[index] ?? banners[0];
  const hasMultiple = banners.length > 1;

  const goNext = () => {
    setIndex((i) => (i + 1) % banners.length);
  };

  const goPrev = () => {
    setIndex((i) => (i - 1 + banners.length) % banners.length);
  };

  return (
    <section className="home-hero">
      <div className="hero-slider">

        {current.linkUrl ? (
          <a href={current.linkUrl} className="hero-slide-link">
            <picture>
              {current.mobileImageUrl && (
                <source
                  srcSet={current.mobileImageUrl}
                  media="(max-width: 768px)"
                />
              )}
              <Image
                src={current.imageUrl}
                alt={current.alt || "Hero banner"}
                fill
                priority
                className="hero-slide-image"
              />
            </picture>
          </a>
        ) : (
          <div className="hero-slide-link">
            <picture>
              {current.mobileImageUrl && (
                <source
                  srcSet={current.mobileImageUrl}
                  media="(max-width: 768px)"
                />
              )}
              <Image
                src={current.imageUrl}
                alt={current.alt || "Hero banner"}
                fill
                priority
                className="hero-slide-image"
              />
            </picture>
          </div>
        )}

        {/* Arrows */}
        {hasMultiple && (
          <>
            <button
              type="button"
              className="hero-arrow hero-arrow-left"
              onClick={goPrev}
              aria-label="Previous banner"
            >
              <FaChevronLeft size={18} />
            </button>

            <button
              type="button"
              className="hero-arrow hero-arrow-right"
              onClick={goNext}
              aria-label="Next banner"
            >
              <FaChevronRight size={18} />
            </button>
          </>
        )}

        {/* Dots */}
        {hasMultiple && (
          <div className="hero-dots">
            {banners.map((b, i) => (
              <button
                key={b.id}
                type="button"
                className={
                  "hero-dot" + (i === index ? " hero-dot--active" : "")
                }
                onClick={() => setIndex(i)}
                aria-label={`Go to banner ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
