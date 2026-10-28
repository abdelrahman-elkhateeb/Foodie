import { ArrowRight, Bike, PackageSearch } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts } from "@/features/products/useProducts";
import { imageAt } from "@/lib/utils";

export default function HomeHero() {
  const { t, i18n } = useTranslation();
  const { data: products = [], isPending } = useProducts();

  const isArabic = i18n.language === "ar";
  const images = products.filter((p) => p.is_available).slice(0, 3);

  return (
    <section className="grid items-center gap-12 py-12 lg:grid-cols-2 lg:py-20">
      <div className="space-y-8">
        <span className="inline-flex items-center gap-2 border px-3 py-1.5 text-[11px] font-semibold tracking-widest uppercase">
          <span className="size-2 rounded-full bg-primary" />
          {t("home.hero.badge")}
        </span>

        <h1 className="isolate text-5xl leading-[1.05] font-black tracking-tight text-balance sm:text-6xl xl:text-7xl">
          {t("home.hero.title")}{" "}
          <span className="relative inline-block">
            <span className="absolute inset-x-0 -bottom-1 -z-10 h-2 bg-primary sm:h-3" />
            {t("home.hero.highlight")}
          </span>
        </h1>

        <p className="max-w-lg text-lg text-muted-foreground">
          {t("home.hero.subtitle")}
        </p>

        <div className="flex flex-wrap gap-3">
          <Button size="lg" asChild>
            <Link to="/menu">
              {t("home.hero.orderNow")}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </Button>

          <Button size="lg" variant="outline" asChild>
            <Link to="/track-order">
              <PackageSearch className="h-4 w-4" />
              {t("home.hero.track")}
            </Link>
          </Button>
        </div>
      </div>

      <div className="relative">
        <div className="grid h-[420px] grid-cols-2 grid-rows-2 gap-3 sm:h-[480px]">
          {isPending || images.length < 3 ? (
            <>
              <Skeleton className="row-span-2" />
              <Skeleton />
              <Skeleton />
            </>
          ) : (
            images.map((product, index) => (
              <div
                key={product.id}
                className={
                  index === 0
                    ? "row-span-2 overflow-hidden bg-muted"
                    : "overflow-hidden bg-muted"
                }
              >
                <img
                  src={imageAt(product.image_url, index === 0 ? 800 : 400)}
                  alt={isArabic ? product.name_ar : product.name_en}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            ))
          )}
        </div>

        {/* A miniature of the live tracker, to hint at the feature. */}
        <div className="absolute -bottom-6 start-4 flex items-center gap-3 border bg-background p-3 pe-5 shadow-lg sm:start-8">
          <span className="flex size-10 items-center justify-center bg-primary text-primary-foreground">
            <Bike className="size-5" />
          </span>
          <div>
            <p className="text-sm font-bold">
              {t("orderSteps.out_for_delivery.title")}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("orderSteps.out_for_delivery.description")}
            </p>
          </div>
          <span className="relative ms-2 flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-success" />
          </span>
        </div>
      </div>
    </section>
  );
}
