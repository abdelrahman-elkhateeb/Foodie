import { Bike, ShoppingBag, UtensilsCrossed } from "lucide-react";
import { useTranslation } from "react-i18next";

const steps = [
  { key: "browse", icon: UtensilsCrossed },
  { key: "order", icon: ShoppingBag },
  { key: "track", icon: Bike },
];

export default function HowItWorks() {
  const { t } = useTranslation();

  return (
    <section className="space-y-10 border-y py-16">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
          {t("home.how.title")}
        </h2>
        <p className="text-muted-foreground">{t("home.how.subtitle")}</p>
      </div>

      <ol className="grid gap-px bg-border md:grid-cols-3">
        {steps.map(({ key, icon: Icon }, index) => (
          <li key={key} className="space-y-4 bg-background p-8">
            <div className="flex items-center justify-between">
              <span className="text-5xl font-black text-primary-text tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <Icon className="size-6 text-muted-foreground" />
            </div>
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
