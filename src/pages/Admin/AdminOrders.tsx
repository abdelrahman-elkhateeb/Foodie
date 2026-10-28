import { useState } from "react";
import { Bell, Eye, MoreHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";

import QueryError from "@/components/QueryError";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderStatusBadge from "@/components/dashboard/OrderStatusBadge";
import {
  canAskForNotifications,
  enableOrderAlerts,
} from "@/features/orders/newOrderAlert";
import { useOrders } from "@/features/orders/useOrders";
import { useUpdateOrderStatus } from "@/features/orders/useUpdateOrderStatus";
import { formatDate, formatPrice } from "@/lib/format";
import { imageAt } from "@/lib/utils";
import { ORDER_STATUSES, type OrderStatus } from "@/types/OrderTypes";

const ALL = "all";

export default function AdminOrders() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const { orders = [], isLoading, error } = useOrders();
  const { changeOrderStatus, updatingOrderId } = useUpdateOrderStatus();

  const [searchParams, setSearchParams] = useSearchParams();
  const statusFilter = searchParams.get("status") ?? ALL;
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [showAlertsButton, setShowAlertsButton] = useState(
    canAskForNotifications
  );

  // Look the order up on every render so live updates show in the sheet.
  const selectedOrder = orders.find((order) => order.id === selectedOrderId);

  const filteredOrders =
    statusFilter === ALL
      ? orders
      : orders.filter((order) => order.status === statusFilter);

  function countFor(status: OrderStatus) {
    return orders.filter((order) => order.status === status).length;
  }

  if (error) return <QueryError />;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t("admin.orders.title")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("admin.orders.subtitle")}
          </p>
        </div>

        {showAlertsButton && (
          <Button
            variant="outline"
            onClick={async () => {
              await enableOrderAlerts();
              setShowAlertsButton(false);
            }}
          >
            <Bell className="h-4 w-4" />
            {t("admin.orders.enableAlerts")}
          </Button>
        )}
      </div>

      <Tabs
        value={statusFilter}
        onValueChange={(value) =>
          setSearchParams(value === ALL ? {} : { status: value }, {
            replace: true,
          })
        }
      >
        <TabsList className="h-auto max-w-full flex-wrap justify-start">
          <TabsTrigger value={ALL}>
            {t("common.all")} ({orders.length})
          </TabsTrigger>
          {ORDER_STATUSES.map((status) => (
            <TabsTrigger key={status} value={status}>
              {t(`orderStatus.${status}`)} ({countFor(status)})
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("admin.orders.order")}</TableHead>
                <TableHead>{t("admin.orders.customer")}</TableHead>
                <TableHead>{t("admin.orders.payment")}</TableHead>
                <TableHead>{t("admin.orders.status")}</TableHead>
                <TableHead>{t("admin.orders.total")}</TableHead>
                <TableHead className="w-[80px]" />
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading &&
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={6}>
                      <Skeleton className="h-10 w-full" />
                    </TableCell>
                  </TableRow>
                ))}

              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <p className="font-medium">#{order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(order.created_at, i18n.language)}
                    </p>
                  </TableCell>

                  <TableCell>
                    <p className="font-medium">{order.customer_name}</p>
                    <p className="text-sm text-muted-foreground" dir="ltr">
                      {order.phone}
                    </p>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline">
                      {t(`payment.${order.payment_method}`)}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>

                  <TableCell className="font-medium">
                    {formatPrice(order.total_price, i18n.language)}
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={updatingOrderId === order.id}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setSelectedOrderId(order.id)}
                        >
                          <Eye className="h-4 w-4" />
                          {t("admin.orders.viewDetails")}
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>
                          {t("admin.orders.changeStatus")}
                        </DropdownMenuLabel>

                        <DropdownMenuRadioGroup
                          value={order.status}
                          onValueChange={(status) =>
                            changeOrderStatus({
                              orderId: order.id,
                              status: status as OrderStatus,
                            })
                          }
                        >
                          {ORDER_STATUSES.map((status) => (
                            <DropdownMenuRadioItem key={status} value={status}>
                              {t(`orderStatus.${status}`)}
                            </DropdownMenuRadioItem>
                          ))}
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {!isLoading && filteredOrders.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              {t("admin.orders.empty")}
            </p>
          )}
        </CardContent>
      </Card>

      <Sheet
        open={!!selectedOrder}
        onOpenChange={(open) => !open && setSelectedOrderId(null)}
      >
        <SheetContent
          side={i18n.dir() === "rtl" ? "left" : "right"}
          className="overflow-y-auto sm:max-w-md"
        >
          {selectedOrder && (
            <>
              <SheetHeader>
                <SheetTitle>
                  {t("admin.orders.order")} #{selectedOrder.id}
                </SheetTitle>
                <SheetDescription>{t("admin.orders.details")}</SheetDescription>
              </SheetHeader>

              <div className="space-y-6 px-4 pb-6">
                <div className="flex items-center justify-between">
                  <OrderStatusBadge status={selectedOrder.status} />
                  <span className="text-sm text-muted-foreground">
                    {formatDate(selectedOrder.created_at, i18n.language)}
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="font-medium">{selectedOrder.customer_name}</p>
                  <p className="text-sm text-muted-foreground" dir="ltr">
                    {selectedOrder.phone}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrder.address}
                  </p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <p className="text-xs font-semibold tracking-widest uppercase">
                    {t("admin.orders.items")}
                  </p>

                  {selectedOrder.order_items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      {item.products?.image_url && (
                        <img
                          src={imageAt(item.products.image_url, 100)}
                          alt=""
                          className="size-10 object-cover"
                        />
                      )}
                      <span className="flex-1 text-sm">
                        {(isArabic
                          ? item.products?.name_ar
                          : item.products?.name_en) ?? `#${item.product_id}`}{" "}
                        × {item.quantity}
                      </span>
                      <span className="text-sm">
                        {formatPrice(item.price * item.quantity, i18n.language)}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="flex justify-between font-bold">
                  <span>{t("admin.orders.total")}</span>
                  <span>
                    {formatPrice(selectedOrder.total_price, i18n.language)}
                  </span>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </section>
  );
}
