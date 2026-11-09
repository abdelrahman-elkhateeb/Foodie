import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Outlet, useSearchParams } from "react-router";

import QueryError from "@/components/QueryError";
import MenuLoading from "@/components/MenuLoading";
import ProductCard from "@/components/menu/ProductCard";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProducts } from "@/features/products/useProducts";
import { scrollBehavior } from "@/lib/utils";
import { PRODUCT_CATEGORIES } from "@/types/ProductsTypes";

export default function Menu() {
  const { t } = useTranslation();
  const { data: products = [], isPending, error } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>();
  const tabsRef = useRef<HTMLDivElement>(null);

  const query = search.trim().toLowerCase();

  const matchingProducts = products.filter(
    (product) =>
      !query ||
      [
        product.name_en,
        product.name_ar,
        product.description_en,
        product.description_ar,
      ].some((text) => text?.toLowerCase().includes(query))
  );

  // Only show categories that have something to show.
  const sections = PRODUCT_CATEGORIES.map((category) => ({
    category,
    products: matchingProducts.filter((p) => p.category === category),
  })).filter((section) => section.products.length > 0);

  const sectionIds = sections.map((section) => section.category).join();
  const currentCategory = sections.some((s) => s.category === activeCategory)
    ? activeCategory
    : sections[0]?.category;

  // Home's category tiles link here with ?category=grills. Clear it after the
  // jump so closing a dish or refreshing doesn't jump again.
  const requestedCategory = searchParams.get("category");
  useEffect(() => {
    if (!requestedCategory || products.length === 0) return;

    document.getElementById(requestedCategory)?.scrollIntoView();
    setSearchParams({}, { replace: true, preventScrollReset: true });
  }, [requestedCategory, products.length, setSearchParams]);

  // Scrollspy: the active tab is the section crossing a line 30% down the screen.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((entry) => entry.isIntersecting);
        if (hit) setActiveCategory(hit.target.id);
      },
      { rootMargin: "-30% 0px -69% 0px" }
    );

    sectionIds.split(",").forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [sectionIds]);

  // Keep the active tab in view in the swipeable row. Instant on purpose: a
  // second smooth scroll would cancel the page's own. The delta works in RTL.
  useEffect(() => {
    const row = tabsRef.current;
    const tab = row?.querySelector("[data-state=active]");
    if (!row || !tab) return;

    const rowBox = row.getBoundingClientRect();
    const tabBox = tab.getBoundingClientRect();
    row.scrollBy({
      left: tabBox.left - rowBox.left - (rowBox.width - tabBox.width) / 2,
    });
  }, [currentCategory]);

  function jumpToCategory(category: string) {
    setActiveCategory(category);
    document
      .getElementById(category)
      ?.scrollIntoView({ behavior: scrollBehavior() });
  }

  return (
    <section className="flex flex-col gap-6 py-10">
      <div>
        <h1 className="text-4xl font-black tracking-tight">
          {t("menu.title")}
        </h1>
        <p className="text-muted-foreground">{t("menu.subtitle")}</p>
      </div>

      {/* Phones: search scrolls away and only the tabs stick, to save height. */}
      <div className="max-md:contents md:sticky md:top-16 md:z-30 md:-mx-4 md:flex md:items-center md:gap-4 md:border-b md:bg-background/95 md:px-4 md:py-2 md:backdrop-blur">
        <div className="relative w-full md:order-last md:w-64 md:shrink-0">
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("menu.search")}
            className="ps-9"
          />
        </div>

        {sections.length > 0 && (
          <Tabs
            value={currentCategory}
            activationMode="manual"
            className="min-w-0 max-md:sticky max-md:top-16 max-md:z-30 max-md:-mx-4 max-md:border-b max-md:bg-background/95 max-md:px-4 max-md:py-2 max-md:backdrop-blur md:flex-1"
          >
            <TabsList
              ref={tabsRef}
              className="max-w-full justify-start overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {sections.map(({ category }) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  onClick={() => jumpToCategory(category)}
                >
                  {t(`categories.${category}`)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}
      </div>

      {isPending && <MenuLoading className="xl:grid-cols-4" />}

      {error && <QueryError />}

      {!isPending && !error && sections.length === 0 && (
        <p className="py-16 text-center text-muted-foreground">
          {t("menu.noResults")}
        </p>
      )}

      <div className="space-y-12">
        {sections.map((section) => (
          <section
            key={section.category}
            id={section.category}
            className="scroll-mt-36 space-y-5"
          >
            <h2 className="text-2xl font-black tracking-tight">
              {t(`categories.${section.category}`)}
            </h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {section.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <Outlet />
    </section>
  );
}
