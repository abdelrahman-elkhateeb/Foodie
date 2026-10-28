import { Outlet } from "react-router";
import { useTranslation } from "react-i18next";
import { ShieldCheck } from "lucide-react";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";
import { useUser } from "@/features/users/useUser";

export default function AdminLayout() {
  const { t } = useTranslation();
  const { user } = useUser();

  return (
    <SidebarProvider>
      <AdminSidebar />

      <SidebarInset>
        <header className="flex h-16 items-center gap-4 border-b px-4 sm:px-6">
          <SidebarTrigger />

          <Separator orientation="vertical" className="h-6" />

          <div className="min-w-0 flex-1">
            <h1 className="truncate font-semibold">{t("admin.title")}</h1>
            <p className="hidden text-sm text-muted-foreground sm:block">
              {t("admin.subtitle")}
            </p>
          </div>

          {user && (
            <span
              className="hidden max-w-48 items-center gap-1.5 border border-primary bg-primary px-2 py-1 text-[11px] font-semibold tracking-wider text-primary-foreground uppercase sm:inline-flex"
              title={user.email}
            >
              <ShieldCheck className="size-3.5 shrink-0" />
              <span className="truncate">{t("admin.roleAdmin")}</span>
            </span>
          )}
          <LanguageToggle />
          <ThemeToggle />
        </header>

        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
