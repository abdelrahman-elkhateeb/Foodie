import { ShoppingCart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, Outlet, useLocation } from "react-router";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useCartItems } from "@/features/cart/useCartItems";
import { formatPrice } from "@/lib/format";

// Pages that already show the cart, so the bar would only repeat it.
const HIDE_CART_BAR = ["/cart", "/checkout"];

export default function ClientLayout() {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const { totalItems, totalPrice } = useCartItems();

  const showCartBar = totalItems > 0 && !HIDE_CART_BAR.includes(pathname);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="container mx-auto mb-12 flex-1 px-4">
        <Outlet />
      </main>

      <Footer />

      {showCartBar && (
        <>
          {/* Keeps the footer from hiding behind the bar. */}
          <div className="h-20 md:hidden" />

          <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 p-3 backdrop-blur md:hidden">
            <Button asChild size="lg" className="h-14 w-full justify-between">
              <Link to="/cart">
                <span className="flex items-center gap-2">
                  <ShoppingCart className="size-4" />
                  {t("cart.view")} · {t("cart.itemsCount", { count: totalItems })}
                </span>
                <span className="text-sm font-black tabular-nums">
                  {formatPrice(totalPrice, i18n.language)}
                </span>
              </Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
