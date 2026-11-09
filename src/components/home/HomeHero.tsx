import { useEffect, useRef, useState } from "react";
import { ArrowRight, PackageSearch } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts } from "@/features/products/useProducts";
import { formatPrice } from "@/lib/format";
import { cn, imageAt, scrollBehavior } from "@/lib/utils";
import { PRODUCT_CATEGORIES } from "@/types/ProductsTypes";

const SLIDE_COUNT = 5;
const SLIDE_CLASS = "w-(--slide) shrink-0 snap-center";
const SLIDE_HEIGHT_CLASS = "aspect-square md:aspect-auto md:h-[456px]";

// Measured from the rendered boxes so it works the same in RTL.
function centerSlide(
  track: HTMLElement | null,
  index: number,
  behavior: ScrollBehavior
) {
  const slide = track?.children[index];
  if (!track || !slide) return;

  const trackBox = track.getBoundingClientRect();
  const slideBox = slide.getBoundingClientRect();
  track.scrollBy({
    left:
      slideBox.left + slideBox.width / 2 - (trackBox.left + trackBox.width / 2),
    behavior,
  });
}

export default function HomeHero() {
  const { t, i18n } = useTranslation();
  const { data: products = [], isPending } = useProducts();
  const [activeIndex, setActiveIndex] = useState(1);
  const trackRef = useRef<HTMLDivElement>(null);

  const isArabic = i18n.language === "ar";

  // The last dish of each category: the tiles below use the first ones' photos.
  const slides = PRODUCT_CATEGORIES.flatMap((category) =>
    products.filter((p) => p.category === category && p.is_available).slice(-1)
  ).slice(0, SLIDE_COUNT);

  // Start on the second slide so a neighbour peeks in on both sides.
  useEffect(() => {
    centerSlide(trackRef.current, 1, "instant");
  }, [slides.length]);

  function syncActiveSlide() {
    const track = trackRef.current;
    if (!track) return;

    const box = track.getBoundingClientRect();
    const distances = [...track.children].map((slide) => {
      const slideBox = slide.getBoundingClientRect();
      return Math.abs(
        slideBox.left + slideBox.width / 2 - (box.left + box.width / 2)
      );
    });
    setActiveIndex(distances.indexOf(Math.min(...distances)));
  }

  return (
    <section className="space-y-8 py-10 lg:py-14">
      <div className="mx-auto max-w-3xl space-y-5 text-center">
        <span className="inline-flex items-center gap-2 border px-3 py-1.5 text-[11px] font-semibold tracking-widest uppercase">
          <span className="size-2 rounded-full bg-primary" />
          {t("home.hero.badge")}
        </span>

        <h1 className="isolate text-5xl leading-[1.05] font-black tracking-tight text-balance sm:text-6xl">
          {t("home.hero.title")}{" "}
          <span className="relative inline-block">
            <span className="absolute inset-x-0 -bottom-1 -z-10 h-2 bg-primary sm:h-3" />
            {t("home.hero.highlight")}
          </span>
        </h1>
      </div>

      <div className="space-y-3">
        {/* The padding lets the first and last slides reach the centre. */}
        <div className="-mx-4">
          <div
            ref={trackRef}
            onScroll={syncActiveSlide}
            className="flex snap-x snap-mandatory [scrollbar-width:none] gap-4 overflow-x-auto [padding-inline:calc((100%-var(--slide))/2)] [--slide:85vw] md:[--slide:698px] lg:[--slide:796px] [&::-webkit-scrollbar]:hidden"
          >
            {isPending
              ? Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className={cn(SLIDE_CLASS, SLIDE_HEIGHT_CLASS)}
                  />
                ))
              : slides.map((product, index) => {
                  const name = isArabic ? product.name_ar : product.name_en;

                  return (
                    <Link
                      key={product.id}
                      to={`/menu/${product.id}`}
                      className={cn(
                        SLIDE_CLASS,
                        SLIDE_HEIGHT_CLASS,
                        "group relative overflow-hidden bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset"
                      )}
                    >
                      <img
                        src={imageAt(product.image_url, 800)}
                        srcSet={`${imageAt(product.image_url, 400)} 400w, ${imageAt(product.image_url, 800)} 800w`}
                        sizes="(min-width: 1024px) 796px, (min-width: 768px) 698px, 85vw"
                        alt=""
                        loading={index < 3 ? "eager" : "lazy"}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                      <div className="absolute start-4 bottom-4 max-w-[calc(100%-2rem)] space-y-2 bg-background/90 p-4">
                        <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                          {t(`categories.${product.category}`)}
                        </p>
                        <p className="text-xl font-black tracking-tight sm:text-2xl">
                          {name}
                        </p>
                        <p className="inline-block bg-primary px-2 py-1 text-sm font-black text-primary-foreground tabular-nums">
                          {formatPrice(product.price, i18n.language)}
                        </p>
                      </div>
                    </Link>
                  );
                })}
          </div>
        </div>

        {slides.length > 1 && (
          <div className="flex justify-center">
            {slides.map((product, index) => (
              <button
                key={product.id}
                type="button"
                aria-label={isArabic ? product.name_ar : product.name_en}
                aria-current={index === activeIndex || undefined}
                onClick={() =>
                  centerSlide(trackRef.current, index, scrollBehavior())
                }
                className="group flex size-6 items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <span
                  className={cn(
                    "size-2 rounded-full transition-colors",
                    index === activeIndex
                      ? "bg-primary"
                      : "bg-muted-foreground/40 group-hover:bg-muted-foreground"
                  )}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-3">
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
    </section>
  );
}
