"use client";

import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const banners = [
  "/banners/banner1.WEBP",
  "/banners/banner2.WEBP",
  "/banners/banner3.WEBP",
];

export default function HomeHero() {
  const [index, setIndex] = useState(0);

  // Auto slide
  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % banners.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

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
          <img
            key={i}
            src={b}
            className={`hero-slide ${i === index ? "active" : ""}`}
            alt="banner"
          />
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
          {banners.map((_, i) => (
            <button
              key={i}
              className={`hero-dot ${i === index ? "active" : ""}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
