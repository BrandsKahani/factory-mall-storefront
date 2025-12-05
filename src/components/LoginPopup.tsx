"use client";

import { useState } from "react";
import { useLoginPopup } from "@/context/LoginPopupContext";

const SHOPIFY_LOGIN_URL = "https://ut3g5g-i6.myshopify.com/account/login";

export default function LoginPopup() {
  const { open, closeLogin } = useLoginPopup();
  const [email, setEmail] = useState("");

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Yahan sirf Shopify login page par redirect:
    window.location.href = SHOPIFY_LOGIN_URL;
  };

  return (
    <div
      className="fixed inset-0 z-[2000] bg-black/40 flex items-center justify-center"
      onClick={closeLogin}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4 text-center">Sign In</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
          />

          <button
            type="submit"
            className="w-full bg-black text-white rounded-md py-2 text-sm font-medium hover:bg-gray-900 transition"
          >
            Send Login Link
          </button>
        </form>

        <button
          type="button"
          onClick={closeLogin}
          className="mt-4 text-center text-xs text-gray-500 underline w-full"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
