import type { ReactNode } from "react";
import { Check, PackageSearch } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import { LogoMark } from "@/components/Logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ORDER_STATUSES } from "@/types/OrderTypes";

const CURRENT_STEP = ORDER_STATUSES.indexOf("out_for_delivery");

function PhoneFrame({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "h-[440px] w-56 shrink-0 overflow-hidden rounded-[2.25rem] border-8 border-foreground/15 bg-background sm:w-60",
        className
      )}
    >
      {children}
    </div>
  );
}

export default function HomeTracking() {
  const { t } = useTranslation();

  return (
    <section className="grid items-center gap-10 py-10 lg:grid-cols-2">
      <div className="flex flex-col items-center gap-5 border bg-muted/40 p-8 text-center">
        <Badge className="border px-3 py-1.5 text-[11px]">
          {t("nav.trackOrder")}
        </Badge>
        <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
          {t("home.tracking.title")}
        </h2>
        <p className="max-w-md text-muted-foreground">
          {t("home.tracking.description")}
        </p>
        <Button size="lg" asChild>
          <Link to="/track-order">
            <PackageSearch className="h-4 w-4" />
            {t("home.hero.track")}
          </Link>
        </Button>
      </div>

      <div className="flex items-end justify-center gap-6">
        <PhoneFrame className="hidden items-center justify-center bg-card sm:flex">
          <LogoMark className="size-20 [&_svg]:size-10" />
        </PhoneFrame>

        <PhoneFrame className="mb-0 sm:mb-8">
          <ol className="space-y-5 p-5 pt-10">
            {ORDER_STATUSES.map((status, index) => (
              <li key={status} className="flex gap-3">
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center",
                    index <= CURRENT_STEP
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {index < CURRENT_STEP && <Check className="size-4" />}
                </span>
                <span>
                  <span className="block text-sm font-bold">
                    {t(`orderSteps.${status}.title`)}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {t(`orderSteps.${status}.description`)}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </PhoneFrame>
      </div>
    </section>
  );
}
