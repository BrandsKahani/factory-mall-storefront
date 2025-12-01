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
  open?: boolean;
  onClose?: () => void;
};

export default function SearchModal({ open = false, onClose }: Props) {
  const router = useRouter();

  // 🔥 Internal open state (supports StickyToolbar)
  const [internalOpen, setInternalOpen] = useState(open);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Sync external open prop
  useEffect(() => {
    setInternalOpen(open);
  }, [open]);

  // 🔥 Listen for "open-search" event from StickyToolbar
  useEffect(() => {
    const handler = () => setInternalOpen(true);
    window.addEventListener("open-search", handler);
    return () => window.removeEventListener("open-search", handler);
  }, []);

  const closeModal = () => {
    setInternalOpen(false);
    onClose?.();
  };

  // Reset search when closed
  useEffect(() => {
    if (!internalOpen) {
      setQuery("");
      setResults([]);
      setLoading(false);
    }
  }, [internalOpen]);

  // Search Fetching
  useEffect(() => {
    if (!internalOpen) return;

    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const id = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.ok ? data.products : []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(id);
  }, [query, internalOpen]);

  if (!internalOpen) return null;

  const handleSelect = (handle: string) => {
    closeModal();
    router.push(`/products/${handle}`);
  };

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      className="search-overlay fixed inset-0 z-40 bg-black/40 flex items-start justify-center pt-16 px-3"
      onClick={closeModal}
    >
      <div
        className="search-modal w-full max-w-xl rounded-2xl bg-white shadow-lg overflow-hidden"
        onClick={stop}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-800">Search products</h2>
          <button type="button" onClick={closeModal}>
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
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {loading && (
            <div className="px-4 py-4 text-sm text-gray-500">Searching...</div>
          )}

          {!loading && query.length >= 2 && results.length === 0 && (
            <div className="px-4 py-4 text-sm text-gray-500">
              No products found.
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
                  <div className="text-sm font-medium text-gray-900 line-clamp-1">
                    {p.title}
                  </div>
                  {p.price && (
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
