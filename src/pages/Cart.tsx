import { useTranslation } from "react-i18next";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCartItems } from "@/features/cart/useCartItems";
import { useUser } from "@/features/users/useUser";
import { formatPrice } from "@/lib/format";
import { cn, imageAt } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";

export default function Cart() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const { items, hasUnavailableItems, totalItems, totalPrice } =
    useCartItems();
  const { user } = useUser();

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-2xl font-bold">{t("cart.empty")}</h1>

        <p className="text-muted-foreground">
          {t("cart.emptyDescription")}
        </p>

        <Button asChild>
          <Link to="/menu">{t("cart.browseMenu")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <section className="py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">{t("cart.title")}</h1>

          <p className="text-muted-foreground">
            {t("cart.itemsCount", { count: totalItems })}
          </p>
        </div>

        <Button variant="outline" onClick={clearCart}>
          {t("cart.clear")}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {hasUnavailableItems && (
            <p className="border-s-2 border-destructive bg-destructive/10 p-3 text-sm text-destructive">
              {t("cart.unavailableNotice")}
            </p>
          )}

          {items.map((item) => {
            const name = isArabic ? item.name_ar : item.name_en;

            return (
              <Card
                key={item.id}
                size="sm"
                className={cn(!item.isAvailable && "opacity-60")}
              >
                <CardContent className="flex gap-3 sm:gap-4">
                  <img
                    src={imageAt(item.image_url, 200)}
                    alt={name}
                    className="size-20 shrink-0 object-cover sm:size-24"
                  />

                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div>
                      <h3 className="font-semibold">{name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.isAvailable
                          ? formatPrice(item.price, i18n.language)
                          : t("common.unavailable")}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon-sm"
                          variant="outline"
                          onClick={() => decreaseQuantity(item.id)}
                        >
                          <Minus size={16} />
                          <span className="sr-only">{t("cart.decrease")}</span>
                        </Button>

                        <span className="w-6 text-center font-medium">
                          {item.quantity}
                        </span>

                        <Button
                          size="icon-sm"
                          variant="outline"
                          onClick={() => increaseQuantity(item.id)}
                        >
                          <Plus size={16} />
                          <span className="sr-only">{t("cart.increase")}</span>
                        </Button>
                      </div>

                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 size={16} />
                        <span className="sr-only">{t("cart.remove")}</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>{t("cart.orderSummary")}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>{t("cart.items")}</span>
              <span>{totalItems}</span>
            </div>

            <div className="flex justify-between">
              <span>{t("cart.subtotal")}</span>
              <span>{formatPrice(totalPrice, i18n.language)}</span>
            </div>

            <Separator />

            <div className="flex justify-between text-lg font-bold">
              <span>{t("cart.total")}</span>
              <span>{formatPrice(totalPrice, i18n.language)}</span>
            </div>
          </CardContent>

          <CardFooter>
            <Button className="w-full" asChild>
              {user ? (
                <Link to="/checkout">{t("cart.checkout")}</Link>
              ) : (
                <Link to="/login" state={{ from: "/checkout" }}>
                  {t("cart.loginToCheckout")}
                </Link>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
