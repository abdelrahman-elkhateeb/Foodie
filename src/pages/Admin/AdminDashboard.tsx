import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { Activity, Banknote, Receipt, ShoppingBag } from "lucide-react";

import QueryError from "@/components/QueryError";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import OrderStatusBadge from "@/components/dashboard/OrderStatusBadge";
import { statusColors } from "@/components/dashboard/orderStatusColors";
import { useDashboardStats } from "@/features/orders/useDashboardStats";
import { formatPrice } from "@/lib/format";
import { cn, imageAt } from "@/lib/utils";

function StatTile({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  hint: string;
}) {
  return (
    <Card size="sm">
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-semibold tracking-widest uppercase">
            {label}
          </span>
          <Icon className="size-4" />
        </div>
        <p className="text-3xl font-black tabular-nums">{value}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const { stats, isLoading, error } = useDashboardStats();

  if (error) return <QueryError />;

  if (isLoading || !stats) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-32" />
        ))}
        <Skeleton className="h-72 sm:col-span-2" />
        <Skeleton className="h-72 sm:col-span-2" />
      </div>
    );
  }

  const maxStatus = Math.max(1, ...stats.byStatus.map((s) => s.count));
  const maxDay = Math.max(1, ...stats.lastDays.map((d) => d.count));
  const maxDish = Math.max(1, ...stats.topDishes.map((d) => d.quantity));
  const weekday = new Intl.DateTimeFormat(isArabic ? "ar-EG" : "en-EG", {
    weekday: "short",
  });

  return (
    <section className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          icon={Banknote}
          label={t("admin.stats.revenue")}
          value={formatPrice(stats.revenue, i18n.language)}
          hint={t("admin.stats.revenueHint")}
        />
        <StatTile
          icon={ShoppingBag}
          label={t("admin.stats.totalOrders")}
          value={stats.totalOrders}
          hint={t("admin.stats.todayHint", { count: stats.todayOrders })}
        />
        <StatTile
          icon={Receipt}
          label={t("admin.stats.avgOrder")}
          value={formatPrice(stats.averageOrder, i18n.language)}
          hint={t("admin.stats.avgOrderHint")}
        />
        <StatTile
          icon={Activity}
          label={t("admin.stats.active")}
          value={stats.activeOrders}
          hint={t("admin.stats.activeHint")}
        />
      </div>

      {stats.totalOrders === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            {t("admin.stats.noData")}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t("admin.stats.byStatus")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats.byStatus.map(({ status, count }) => (
                  <Link
                    key={status}
                    to={`/admin/orders?status=${status}`}
                    className="group block space-y-1.5"
                  >
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground group-hover:text-foreground">
                        {t(`orderStatus.${status}`)}
                      </span>
                      <span className="font-semibold tabular-nums">{count}</span>
                    </div>
                    <div className="h-2 bg-muted">
                      <div
                        className={cn(
                          "h-full rounded-e-[4px] transition-all",
                          statusColors[status]
                        )}
                        style={{ width: `${(count / maxStatus) * 100}%` }}
                      />
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("admin.stats.last7Days")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex h-48 items-end gap-2 border-b">
                  {stats.lastDays.map((day) => (
                    <div
                      key={day.date}
                      className="group relative flex h-full flex-1 flex-col justify-end"
                    >
                      <div className="pointer-events-none absolute bottom-full start-1/2 z-10 mb-1 hidden -translate-x-1/2 border bg-popover px-2 py-1 text-xs whitespace-nowrap shadow-sm group-hover:block rtl:translate-x-1/2">
                        <p className="font-semibold">{day.count}</p>
                        <p className="text-muted-foreground">
                          {formatPrice(day.total, i18n.language)}
                        </p>
                      </div>
                      <div
                        className="min-h-0.5 rounded-t-[4px] bg-primary transition-opacity group-hover:opacity-80"
                        style={{ height: `${(day.count / maxDay) * 100}%` }}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex gap-2">
                  {stats.lastDays.map((day) => (
                    <span
                      key={day.date}
                      className="flex-1 text-center text-[11px] text-muted-foreground"
                    >
                      {weekday.format(new Date(day.date))}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t("admin.stats.topDishes")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats.topDishes.map((dish) => (
                  <div key={dish.productId} className="flex items-center gap-3">
                    {dish.image_url && (
                      <img
                        src={imageAt(dish.image_url, 100)}
                        alt=""
                        className="size-10 object-cover"
                      />
                    )}
                    <div className="flex-1 space-y-1.5">
                      <div className="flex justify-between gap-2 text-sm">
                        <span className="truncate">
                          {isArabic ? dish.name_ar : dish.name_en}
                        </span>
                        <span className="text-muted-foreground tabular-nums">
                          {t("admin.stats.sold", { count: dish.quantity })}
                        </span>
                      </div>
                      <div className="h-2 bg-muted">
                        <div
                          className="h-full rounded-e-[4px] bg-primary"
                          style={{
                            width: `${(dish.quantity / maxDish) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{t("admin.stats.recentOrders")}</CardTitle>
                <Button variant="link" size="sm" asChild className="h-auto p-0">
                  <Link to="/admin/orders">{t("admin.stats.viewAll")}</Link>
                </Button>
              </CardHeader>
              <CardContent className="divide-y">
                {stats.recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="font-medium">#{order.id}</p>
                      <p className="truncate text-sm text-muted-foreground">
                        {order.customer_name}
                      </p>
                    </div>
                    <OrderStatusBadge status={order.status} />
                    <span className="text-sm font-semibold tabular-nums">
                      {formatPrice(order.total_price, i18n.language)}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </section>
  );
}
