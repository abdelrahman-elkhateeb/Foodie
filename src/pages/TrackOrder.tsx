import { useState } from "react";
import { useSearchParams } from "react-router";
import {
  Search,
  PackageCheck,
  ChefHat,
  Bike,
  CheckCircle2,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useOrder } from "@/features/orders/useOrder";
import { formatDate, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ORDER_STATUSES } from "@/types/OrderTypes";

const stepIcons = {
  pending: PackageCheck,
  preparing: ChefHat,
  out_for_delivery: Bike,
  delivered: CheckCircle2,
};

function parseOrderId(value: string | null) {
  if (!value || !/^\d+$/.test(value)) return null;
  return Number(value);
}

export default function TrackOrder() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  // The order ID lives in the URL (?id=12) so tracking links can be shared.
  const [searchParams, setSearchParams] = useSearchParams();
  const searchedId = searchParams.get("id");
  const orderId = parseOrderId(searchedId);
  const [orderIdInput, setOrderIdInput] = useState(searchedId ?? "");

  const { order, isLoading, error } = useOrder(orderId);

  const hasSearched = searchedId !== null;
  const isInvalidId = hasSearched && orderId === null;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSearchParams({ id: orderIdInput.trim().replace(/^#/, "") });
  }

  const currentStepIndex = order ? ORDER_STATUSES.indexOf(order.status) : -1;

  return (
    <section className="mx-auto max-w-3xl py-10">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t("trackOrder.title")}</CardTitle>

          <CardDescription>{t("trackOrder.description")}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 sm:flex-row sm:items-end"
          >
            <Field className="flex-1">
              <FieldLabel htmlFor="orderId">
                {t("trackOrder.orderId")}
              </FieldLabel>

              <Input
                id="orderId"
                inputMode="numeric"
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
                placeholder={t("trackOrder.placeholder")}
              />
            </Field>

            <Button type="submit" disabled={!orderIdInput.trim()}>
              <Search className="h-4 w-4" />
              {t("trackOrder.action")}
            </Button>
          </form>

          {hasSearched && <Separator />}

          {orderId !== null && isLoading && (
            <p className="text-sm text-muted-foreground">
              {t("trackOrder.loading")}
            </p>
          )}

          {error && (
            <p className="text-sm text-destructive">{t("common.error")}</p>
          )}

          {(isInvalidId || (orderId !== null && !isLoading && !order && !error)) && (
            <p className="text-sm text-muted-foreground">
              {t("trackOrder.notFound")}
            </p>
          )}

          {order && (
            <div className="space-y-6 border p-4 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-bold">
                    {t("trackOrder.order")} #{order.id}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("trackOrder.customer")}: {order.customer_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("trackOrder.placedAt")}:{" "}
                    {formatDate(order.created_at, i18n.language)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="relative flex size-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                      <span className="relative inline-flex size-2 rounded-full bg-success" />
                    </span>
                    {t("trackOrder.live")}
                  </span>
                  <Badge>{t(`orderStatus.${order.status}`)}</Badge>
                </div>
              </div>

              <ol>
                {ORDER_STATUSES.map((status, index) => {
                  const Icon = stepIcons[status];
                  const done = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;

                  return (
                    <li key={status} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={cn(
                            "flex h-10 w-10 items-center justify-center border transition-colors",
                            done
                              ? "border-primary bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground",
                            isCurrent && "ring-4 ring-primary/30"
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </div>

                        {index !== ORDER_STATUSES.length - 1 && (
                          <div
                            className={cn(
                              "h-10 w-px",
                              index < currentStepIndex ? "bg-primary" : "bg-border"
                            )}
                          />
                        )}
                      </div>

                      <div className={cn(!done && "opacity-60")}>
                        <p className="font-medium">
                          {t(`orderSteps.${status}.title`)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {t(`orderSteps.${status}.description`)}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>

              {order.order_items.length > 0 && (
                <>
                  <Separator />

                  <div className="space-y-3">
                    <p className="text-xs font-semibold tracking-widest uppercase">
                      {t("trackOrder.items")}
                    </p>

                    {order.order_items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between gap-4 text-sm"
                      >
                        <span>
                          {(isArabic
                            ? item.products?.name_ar
                            : item.products?.name_en) ?? `#${item.product_id}`}{" "}
                          × {item.quantity}
                        </span>
                        <span>
                          {formatPrice(item.price * item.quantity, i18n.language)}
                        </span>
                      </div>
                    ))}

                    <div className="flex justify-between font-bold">
                      <span>{t("trackOrder.total")}</span>
                      <span>{formatPrice(order.total_price, i18n.language)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
