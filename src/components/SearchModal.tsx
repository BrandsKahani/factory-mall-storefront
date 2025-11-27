"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiX, FiSearch } from "react-icons/fi";

type SearchResult = {
  handle: string;
  title: string;
  vendor?: string;
  imageUrl?: string | null;
  price?: number | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function SearchModal({ open, onClose }: Props) {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Reset when open/close
  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      setLoading(false);
    }
  }, [open]);

  // Fetch search results (debounced)
  useEffect(() => {
    if (!open) return;
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const id = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.ok) {
          setResults(data.products || []);
        } else {
          setResults([]);
        }
      } catch (e) {
        console.error("Search fetch error", e);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(id);
  }, [query, open]);

  if (!open) return null;

  const handleSelect = (handle: string) => {
    onClose();
    router.push(`/products/${handle}`);
  };

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      className="search-overlay fixed inset-0 z-40 bg-black/40 flex items-start justify-center pt-16 px-3"
      onClick={onClose}
    >
      <div
        className="search-modal w-full max-w-xl rounded-2xl bg-white shadow-lg overflow-hidden"
        onClick={stop}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-800">
            Search products
          </h2>
          <button
            type="button"
            className="header-icon-btn"
            onClick={onClose}
            aria-label="Close search"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2 rounded-full border border-gray-200 px-3 py-2 bg-gray-50">
            <FiSearch size={16} className="text-gray-400" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Search "Looms", "Scents" ...'
              className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
          </div>
          <p className="mt-1 text-[11px] text-gray-400">
            Type at least 2 characters to see results.
          </p>
        </div>

        {/* Body */}
        <div className="max-h-80 overflow-y-auto">
          {loading && (
            <div className="px-4 py-4 text-sm text-gray-500">
              Searching...
            </div>
          )}

          {!loading && query.trim().length >= 2 && results.length === 0 && (
            <div className="px-4 py-4 text-sm text-gray-500">
              No products found. Try another keyword.
            </div>
          )}

          {!loading &&
            results.map((p) => (
              <button
                key={p.handle}
                type="button"
                onClick={() => handleSelect(p.handle)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-left"
              >
                <div className="relative w-12 h-16 rounded-md bg-gray-100 overflow-hidden flex-shrink-0">
                  {p.imageUrl && (
                    <Image
                      src={p.imageUrl}
                      alt={p.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  {p.vendor && (
                    <div className="text-[11px] uppercase tracking-wide text-gray-400">
                      {p.vendor}
                    </div>
                  )}
                  <div className="text-sm font-medium text-gray-900 line-clamp-1">
                    {p.title}
                  </div>
                  {typeof p.price === "number" && (
                    <div className="text-xs text-gray-700 mt-0.5">
                      PKR {p.price.toLocaleString("en-PK")}
                    </div>
                  )}
                </div>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
