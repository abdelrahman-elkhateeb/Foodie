import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import QueryError from "@/components/QueryError";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts } from "@/features/products/useProducts";
import { imageAt } from "@/lib/utils";
import { PRODUCT_CATEGORIES } from "@/types/ProductsTypes";

const GRID_CLASS =
  "mx-auto grid max-w-5xl grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-4";

export default function HomeCategories() {
  const { t } = useTranslation();
  const { data: products = [], isPending, error } = useProducts();

  const categories = PRODUCT_CATEGORIES.flatMap((category) => {
    const product = products.find((p) => p.category === category);
    return product ? [{ category, image: product.image_url }] : [];
  });

  return (
    <section className="space-y-8 py-10">
      <div className="flex justify-center">
        <Badge className="border px-3 py-1.5 text-[11px]">
          {t("menu.title")}
        </Badge>
      </div>

      {error ? (
        <QueryError />
      ) : isPending ? (
        <div className={GRID_CLASS}>
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="aspect-square rounded-full" />
          ))}
        </div>
      ) : (
        <div className={GRID_CLASS}>
          {categories.map(({ category, image }) => (
            <Link
              key={category}
              to={`/menu?category=${category}`}
              className="group outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              <div className="mx-auto aspect-square w-[85%] overflow-hidden rounded-full bg-muted">
                <img
                  src={imageAt(image, 400)}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <span className="relative -mt-6 flex min-h-12 items-center justify-center bg-primary px-2 text-center text-sm font-bold text-primary-foreground">
                {t(`categories.${category}`)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
