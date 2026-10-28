import { UtensilsCrossed } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import { cn } from "@/lib/utils";

// The one place the brand mark lives. Swap the icon (or an <img>) here per client.
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex size-8 items-center justify-center bg-primary text-primary-foreground",
        className
      )}
    >
      <UtensilsCrossed className="size-4" />
    </span>
  );
}

export default function Logo({ className }: { className?: string }) {
  const { t } = useTranslation();

  return (
    <Link
      to="/"
      className={cn(
        "flex items-center gap-2 text-xl font-black tracking-tight",
        className
      )}
    >
      <LogoMark />
      {t("brand")}
    </Link>
  );
}
