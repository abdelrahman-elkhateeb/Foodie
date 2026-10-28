import { useQueryClient } from "@tanstack/react-query";
import { RotateCw } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

// Shown when data fails to load (bad connection, Supabase paused). Retry
// refetches whatever the current page is showing.
export default function QueryError() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <p className="font-medium text-destructive">{t("common.error")}</p>
      <p className="text-sm text-muted-foreground">{t("common.errorHint")}</p>
      <Button
        variant="outline"
        onClick={() => queryClient.refetchQueries({ type: "active" })}
      >
        <RotateCw className="h-4 w-4" />
        {t("common.retry")}
      </Button>
    </div>
  );
}
