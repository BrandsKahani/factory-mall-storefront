import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Factory Mall",
  description: "Factory Mall Storefront",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {/* Header globally yahan se aa raha ho to theek hai */}
          <Header />
          {/* CartDrawer hamesha mount rahega */}
          <CartDrawer />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
