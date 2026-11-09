import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Navigate, useLocation, useNavigate, useParams } from "react-router";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAddToCart } from "@/features/cart/useAddToCart";
import { useProducts } from "@/features/products/useProducts";
import { formatPrice } from "@/lib/format";
import { imageAt } from "@/lib/utils";
import { MAX_ITEM_QUANTITY } from "@/store/cartStore";

// Rendered by the /menu/:productId route on top of the menu.
export default function ProductDetails() {
  const { productId } = useParams();
  const { data: products, isPending } = useProducts();
  const addToCart = useAddToCart();
  const navigate = useNavigate();
  const { key } = useLocation();
  const { t, i18n } = useTranslation();
  const [quantity, setQuantity] = useState(1);

  if (isPending) return null;

  const product = products?.find((p) => p.id === Number(productId));
  if (!product) return <Navigate to="/menu" replace />;

  const isArabic = i18n.language === "ar";
  const name = isArabic ? product.name_ar : product.name_en;
  const description = isArabic
    ? product.description_ar
    : product.description_en;

  function close() {
    // Opened from a shared link: there's no earlier page to go back to.
    if (key === "default") navigate("/menu", { replace: true });
    else navigate(-1);
  }

  function handleAdd() {
    addToCart(product!, quantity);
    close();
  }

  return (
    <Dialog open onOpenChange={(open) => !open && close()}>
      {/* A bottom sheet on phones, a centred two-column modal from md up. */}
      <DialogContent className="start-0 top-auto bottom-0 max-h-[90svh] max-w-full translate-x-0 translate-y-0 grid-rows-[auto_minmax(0,1fr)] gap-0 overflow-hidden p-0 rtl:translate-x-0 sm:max-w-full md:start-1/2 md:top-1/2 md:bottom-auto md:max-w-3xl md:-translate-x-1/2 md:-translate-y-1/2 md:grid-cols-2 md:grid-rows-1 md:rtl:translate-x-1/2">
        <img
          src={imageAt(product.image_url, 800)}
          alt={name}
          className="aspect-[4/3] w-full object-cover md:aspect-auto md:h-full md:min-h-96"
        />

        <div className="flex min-h-0 flex-col">
          <div className="flex-1 space-y-3 overflow-y-auto p-6 md:pe-16">
            <DialogTitle className="text-2xl font-black tracking-tight normal-case">
              {name}
            </DialogTitle>
            <DialogDescription>{description}</DialogDescription>

            {/* Product options (sizes, extras) go here once the menu has them. */}
          </div>

          <div className="flex items-center gap-3 border-t p-4">
            {product.is_available && (
              <div className="flex items-center gap-2">
                <Button
                  size="icon-lg"
                  variant="outline"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity(quantity - 1)}
                  aria-label={t("cart.decrease")}
                >
                  <Minus className="size-4" />
                </Button>

                <span
                  aria-live="polite"
                  className="w-6 text-center font-bold tabular-nums"
                >
                  {quantity}
                </span>

                <Button
                  size="icon-lg"
                  variant="outline"
                  disabled={quantity >= MAX_ITEM_QUANTITY}
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label={t("cart.increase")}
                >
                  <Plus className="size-4" />
                </Button>
              </div>
            )}

            <Button
              size="lg"
              className="h-12 flex-1 justify-between gap-3"
              disabled={!product.is_available}
              onClick={handleAdd}
            >
              <span>
                {product.is_available
                  ? t("menu.addToCart")
                  : t("common.unavailable")}
              </span>
              <span className="text-sm font-black tabular-nums">
                {formatPrice(product.price * quantity, i18n.language)}
              </span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
