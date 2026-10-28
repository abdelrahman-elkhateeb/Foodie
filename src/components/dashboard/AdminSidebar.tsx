import { Link, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Home,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { LogoMark } from "@/components/Logo";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    title: "admin.nav.dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "admin.nav.products",
    url: "/admin/products",
    icon: Package,
  },
  {
    title: "admin.nav.orders",
    url: "/admin/orders",
    icon: ShoppingBag,
  },
];

export default function AdminSidebar() {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar side={i18n.dir() === "rtl" ? "right" : "left"}>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-2">
          <LogoMark className="size-9" />
          <div>
            <h2 className="font-bold">{t("admin.sidebarTitle")}</h2>
            <p className="text-xs text-muted-foreground">
              {t("admin.sidebarSubtitle")}
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("admin.management")}</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.url}
                    >
                      <Link to={item.url} onClick={() => setOpenMobile(false)}>
                        <Icon />
                        <span>{t(item.title)}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <Button variant="outline" asChild>
          <Link to="/">
            <Home className="h-4 w-4" />
            {t("admin.backToSite")}
          </Link>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
