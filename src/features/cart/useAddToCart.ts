import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { useCartStore } from "@/store/cartStore";
import type { Product } from "@/types/ProductsTypes";

export function useAddToCart() {
  const addToCart = useCartStore((state) => state.addToCart);
  const { t, i18n } = useTranslation();

  return (product: Product, quantity = 1) => {
    addToCart(
      {
        id: product.id,
        name_en: product.name_en,
        name_ar: product.name_ar,
        price: product.price,
        image_url: product.image_url,
      },
      quantity
    );

    const name = i18n.language === "ar" ? product.name_ar : product.name_en;
    toast.success(
      t("menu.added", { name: quantity > 1 ? `${quantity} × ${name}` : name })
    );
  };
}
