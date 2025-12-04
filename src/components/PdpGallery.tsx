// src/components/PdpGallery.tsx
"use client";

type PdpGalleryProps = {
  images: { id?: string; url: string; altText?: string | null }[];
  title: string;
};

export default function PdpGallery({ images, title }: PdpGalleryProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [lightbox, setLightbox] = React.useState(false);

  const active = images[activeIndex];

  if (!active) {
    // fallback if no images
    return (
      <div className="pdp-gallery-empty">
        <div className="pdp-gallery-empty-box" />
      </div>
    );
  }

  const goPrev = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div className="pdp-gallery">
        {/* MAIN IMAGE */}
        <button
          type="button"
          className="pdp-gallery-main"
          onClick={() => setLightbox(true)}
        >
          <img
            src={active.url}
            alt={active.altText || title}
            className="pdp-gallery-main-img"
          />
        </button>

        {/* THUMBNAILS */}
        {images.length > 1 && (
          <div className="pdp-gallery-thumbs">
            {images.map((img, i) => (
              <button
                key={img.id ?? img.url}
                type="button"
                className={`pdp-gallery-thumb ${
                  i === activeIndex ? "pdp-gallery-thumb--active" : ""
                }`}
                onClick={() => setActiveIndex(i)}
              >
                <img
                  src={img.url}
                  alt={img.altText || title}
                  className="pdp-gallery-thumb-img"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* LIGHTBOX */}
      {lightbox && (
        <div className="pdp-lightbox">
          <div className="pdp-lightbox-inner">
            <img
              src={active.url}
              alt={active.altText || title}
              className="pdp-lightbox-img"
            />
          </div>

          <button
            type="button"
            className="pdp-lightbox-close"
            onClick={() => setLightbox(false)}
          >
            Close ✕
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                className="pdp-lightbox-nav pdp-lightbox-nav--left"
                onClick={goPrev}
              >
                ‹
              </button>
              <button
                type="button"
                className="pdp-lightbox-nav pdp-lightbox-nav--right"
                onClick={goNext}
              >
                ›
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}

import * as React from "react";
