"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (!banners.length) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % banners.length);
    }, 4000);
    return () => clearInterval(id);
  }, [banners.length]);

  if (!banners.length) return null;

  const current = banners[index];
  const isMulti = banners.length > 1;

  return (
    <section className="w-full">
      <div className="relative w-full h-[300px] sm:h-[380px] md:h-[450px] lg:h-[520px] overflow-hidden rounded-none">

        {/* Banner Image */}
        <a href={current.linkUrl || "#"} className="block w-full h-full">
          <picture>
            {current.mobileImageUrl && (
              <source
                srcSet={current.mobileImageUrl}
                media="(max-width: 768px)"
              />
            )}
            <img
              src={current.imageUrl}
              alt={current.alt || "Banner"}
              className="w-full h-full object-cover"
            />
          </picture>
        </a>

        {/* Left Arrow */}
        {isMulti && (
          <button
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow hover:bg-white transition"
            onClick={() =>
              setIndex((i) => (i - 1 + banners.length) % banners.length)
            }
          >
            <FaChevronLeft size={18} />
          </button>
        )}

        {/* Right Arrow */}
        {isMulti && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow hover:bg-white transition"
            onClick={() => setIndex((i) => (i + 1) % banners.length)}
          >
            <FaChevronRight size={18} />
          </button>
        )}

        {/* Dots */}
        {isMulti && (
          <div className="absolute bottom-3 left-0 w-full flex justify-center gap-2">
            {banners.map((b, i) => (
              <button
                key={b.id}
                className={`w-2.5 h-2.5 rounded-full ${
                  i === index ? "bg-white" : "bg-white/40"
                }`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
