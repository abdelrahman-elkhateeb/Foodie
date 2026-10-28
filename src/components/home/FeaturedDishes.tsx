import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import MenuLoading from "@/components/MenuLoading";
import QueryError from "@/components/QueryError";
import ProductCard from "@/components/menu/ProductCard";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/features/products/useProducts";
import { PRODUCT_CATEGORIES } from "@/types/ProductsTypes";

const FEATURED_COUNT = 6;

export default function FeaturedDishes() {
  const { t } = useTranslation();
  const { data: products = [], isPending, error } = useProducts();

  const featured = products
    .filter((product) => product.is_available)
    .slice(0, FEATURED_COUNT);

  const categories = PRODUCT_CATEGORIES.filter((c) =>
    products.some((product) => product.category === c)
  );

  return (
    <section className="space-y-8 py-16">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="space-y-2">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
            {t("home.featured.title")}
          </h2>
          <p className="text-muted-foreground">{t("home.featured.subtitle")}</p>
        </div>

        <Button variant="outline" asChild>
          <Link to="/menu">
            {t("home.featured.viewAll")}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </Button>
      </div>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link
              key={category}
              to={`/menu?category=${category}`}
              className="inline-flex items-center border px-4 py-2 pointer-coarse:min-h-11 text-xs font-semibold tracking-widest uppercase transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
            >
              {t(`categories.${category}`)}
            </Link>
          ))}
        </div>
      )}

      {error ? (
        <QueryError />
      ) : isPending ? (
        <MenuLoading />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
