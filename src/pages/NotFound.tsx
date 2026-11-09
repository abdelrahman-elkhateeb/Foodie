import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-8xl font-black">404</h1>

      <p className="text-muted-foreground">{t("notFound.description")}</p>

      <Button asChild>
        <Link to="/menu">{t("notFound.backToMenu")}</Link>
      </Button>
    </div>
  );
}
