import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { formatPrice } from "@/lib/format";
import { imageAt } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import type { Product } from "@/types/ProductsTypes";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const { t, i18n } = useTranslation();

  const isArabic = i18n.language === "ar";
  const name = isArabic ? product.name_ar : product.name_en;
  const description = isArabic
    ? product.description_ar
    : product.description_en;
  const price = formatPrice(product.price, i18n.language);

  function handleAddToCart() {
    addToCart({
      id: product.id,
      name_en: product.name_en,
      name_ar: product.name_ar,
      price: product.price,
      image_url: product.image_url,
    });
    toast.success(t("menu.added", { name }));
  }

  return (
    <Sheet>
      <Card className="group overflow-hidden pt-0">
        <SheetTrigger asChild>
          <button
            type="button"
            className="flex flex-1 flex-col gap-(--card-spacing) text-start outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            <div className="relative aspect-square w-full overflow-hidden bg-muted">
              <img
                src={imageAt(product.image_url, 600)}
                srcSet={`${imageAt(product.image_url, 400)} 400w, ${imageAt(product.image_url, 800)} 800w`}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
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
          </button>
        </SheetTrigger>

        <CardFooter className="flex items-center justify-between gap-2">
          <span className="text-lg font-black">{price}</span>

          {product.is_available ? (
            <Button
              size="icon-lg"
              onClick={handleAddToCart}
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

      <SheetContent
        side="bottom"
        className="mx-auto max-h-[90svh] w-full max-w-lg overflow-y-auto"
      >
        <img
          src={imageAt(product.image_url, 800)}
          alt={name}
          className="aspect-[4/3] w-full object-cover"
        />

        <SheetHeader className="p-6">
          <SheetTitle className="text-2xl font-black tracking-tight normal-case">
            {name}
          </SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>

        {/* Product options (sizes, extras) go here once the menu has them. */}

        <SheetFooter className="p-6 pt-0">
          <SheetClose asChild>
            <Button
              size="lg"
              className="h-14 w-full justify-between"
              disabled={!product.is_available}
              onClick={handleAddToCart}
            >
              <span>
                {product.is_available
                  ? t("menu.addToCart")
                  : t("common.unavailable")}
              </span>
              <span className="text-sm font-black tabular-nums">{price}</span>
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
