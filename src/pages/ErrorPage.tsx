import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

// Catches crashes anywhere in the app instead of React Router's dev error screen.
export default function ErrorPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-3xl font-black">{t("common.error")}</h1>
      <p className="text-muted-foreground">{t("common.crashHint")}</p>
      <div className="flex gap-3">
        <Button onClick={() => window.location.reload()}>
          {t("common.reload")}
        </Button>
        <Button variant="outline" asChild>
          {/* A plain link, so the app starts fresh. */}
          <a href="/">{t("notFound.backHome")}</a>
        </Button>
      </div>
    </div>
  );
}
