import { useState } from "react";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";

import QueryError from "@/components/QueryError";
import MenuLoading from "@/components/MenuLoading";
import ProductCard from "@/components/menu/ProductCard";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProducts } from "@/features/products/useProducts";
import { PRODUCT_CATEGORIES } from "@/types/ProductsTypes";

const ALL = "all";

export default function Menu() {
  const { t } = useTranslation();
  const { data: products = [], isPending, error } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");

  const category = searchParams.get("category") ?? ALL;

  // Only offer tabs for categories that actually have products.
  const categories = PRODUCT_CATEGORIES.filter((c) =>
    products.some((product) => product.category === c)
  );

  const query = search.trim().toLowerCase();

  const filteredProducts = products.filter((product) => {
    const matchesCategory = category === ALL || product.category === category;
    const matchesSearch =
      !query ||
      [
        product.name_en,
        product.name_ar,
        product.description_en,
        product.description_ar,
      ].some((text) => text?.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  function handleCategoryChange(value: string) {
    setSearchParams(value === ALL ? {} : { category: value }, {
      replace: true,
    });
  }

  return (
    <section className="space-y-8 py-10">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tight">
            {t("menu.title")}
          </h1>
          <p className="text-muted-foreground">{t("menu.subtitle")}</p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("menu.search")}
            className="ps-9"
          />
        </div>
      </div>

      {categories.length > 0 && (
        <Tabs value={category} onValueChange={handleCategoryChange}>
          <TabsList className="h-auto max-w-full flex-wrap justify-start">
            <TabsTrigger value={ALL}>{t("common.all")}</TabsTrigger>
            {categories.map((c) => (
              <TabsTrigger key={c} value={c}>
                {t(`categories.${c}`)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      {isPending && <MenuLoading />}

      {error && <QueryError />}

      {!isPending && !error && filteredProducts.length === 0 && (
        <p className="py-16 text-center text-muted-foreground">
          {t("menu.noResults")}
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
