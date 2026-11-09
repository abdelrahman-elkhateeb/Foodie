import { Bike, ShoppingBag, UtensilsCrossed } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

const steps = [
  { key: "browse", icon: UtensilsCrossed },
  { key: "order", icon: ShoppingBag },
  { key: "track", icon: Bike },
];

export default function HowItWorks() {
  const { t } = useTranslation();

  return (
    <section className="my-10 grid items-center gap-8 bg-primary/10 p-6 sm:p-10 lg:grid-cols-[1fr_2fr]">
      <div className="space-y-4 text-center">
        <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
          {t("home.how.title")}
        </h2>
        <p className="text-muted-foreground">{t("home.how.subtitle")}</p>
        <Button size="lg" asChild className="w-full">
          <Link to="/menu">{t("home.hero.orderNow")}</Link>
        </Button>
      </div>

      <ol className="grid gap-4 md:grid-cols-3">
        {steps.map(({ key, icon: Icon }, index) => (
          <li key={key} className="space-y-3 bg-background p-6 text-center">
            <Icon className="mx-auto size-6 text-muted-foreground" />
            <p className="text-4xl font-black text-primary-text tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="text-lg font-bold">
              {t(`home.how.${key}.title`)}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t(`home.how.${key}.description`)}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
