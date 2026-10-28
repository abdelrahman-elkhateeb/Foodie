import { useEffect } from "react";
import { Outlet, ScrollRestoration, useMatches } from "react-router";
import { useTranslation } from "react-i18next";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuthListener } from "@/features/users/useAuthListener";

export default function RootLayout() {
  const { t, i18n } = useTranslation();
  const matches = useMatches();

  useAuthListener();

  // Each route can set `handle: { title: "i18n.key" }` in the router.
  const titleKey = (matches.at(-1)?.handle as { title?: string } | undefined)
    ?.title;

  useEffect(() => {
    document.title = titleKey
      ? `${t(titleKey)} · Foodie`
      : "Foodie · Order food online";
  }, [titleKey, t]);

  return (
    <TooltipProvider>
      <Outlet />
      <ScrollRestoration />
      <Toaster
        richColors
        // Clear the mobile cart bar.
        mobileOffset={{ bottom: 88 }}
        position={i18n.language === "ar" ? "bottom-left" : "bottom-right"}
      />
    </TooltipProvider>
  );
}
