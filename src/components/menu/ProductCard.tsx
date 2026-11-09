import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useAddToCart } from "@/features/cart/useAddToCart";
import { formatPrice } from "@/lib/format";
import { imageAt } from "@/lib/utils";
import type { Product } from "@/types/ProductsTypes";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useAddToCart();
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();

  const isArabic = i18n.language === "ar";
  const name = isArabic ? product.name_ar : product.name_en;
  const description = isArabic
    ? product.description_ar
    : product.description_en;
  const price = formatPrice(product.price, i18n.language);

  return (
    <Card size="sm" className="group overflow-hidden pt-0">
      <Link
        to={`/menu/${product.id}`}
        // On the menu the dish opens over the page, so keep the reader's place.
        preventScrollReset={pathname.startsWith("/menu")}
        className="flex flex-1 flex-col gap-(--card-spacing) text-start outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <div className="relative aspect-square w-full overflow-hidden bg-muted sm:aspect-[4/3]">
          <img
            src={imageAt(product.image_url, 600)}
            srcSet={`${imageAt(product.image_url, 400)} 400w, ${imageAt(product.image_url, 800)} 800w`}
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product.category && (
            <span className="absolute start-3 top-3 bg-background/90 px-2 py-1 text-[10px] font-semibold tracking-widest uppercase">
              {t(`categories.${product.category}`)}
            </span>
          )}
        </div>

        <CardContent className="space-y-2">
          <h3 className="text-lg font-bold">{name}</h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {description}
          </p>
        </CardContent>
      </Link>

      <CardFooter className="justify-between gap-2 border-t">
        <span className="text-lg font-black">{price}</span>

        {product.is_available ? (
          <Button
            size="icon-lg"
            onClick={() => addToCart(product)}
            aria-label={t("menu.addToCart")}
          >
            <Plus className="size-5" />
          </Button>
        ) : (
          <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            {t("common.unavailable")}
          </span>
        )}
      </CardFooter>
    </Card>
  );
}
