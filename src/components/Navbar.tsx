import { LogOut, Menu, ShoppingCart, User } from "lucide-react";
import { Link, NavLink } from "react-router";
import { useTranslation } from "react-i18next";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import LanguageToggle from "@/components/LanguageToggle";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import { useUser } from "@/features/users/useUser";
import { useLogout } from "@/features/users/useLogout";
import { useCartStore } from "@/store/cartStore";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "nav.home", end: true },
  { to: "/menu", label: "nav.menu" },
  { to: "/track-order", label: "nav.trackOrder" },
  { to: "/admin", label: "nav.dashboard", adminOnly: true },
];

export default function Navbar() {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const { user, isAdmin } = useUser();
  const { logoutUser } = useLogout();
  const { t, i18n } = useTranslation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navLinks = links
    .filter((link) => !link.adminOnly || isAdmin)
    .map((link) => (
    <NavLink
      key={link.to}
      to={link.to}
      end={link.end}
      onClick={() => setIsMobileOpen(false)}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-2 px-3 py-2 text-xs font-semibold tracking-widest uppercase transition-colors hover:text-foreground",
          isActive ? "text-foreground" : "text-muted-foreground"
        )
      }
    >
      {t(link.label)}
    </NavLink>
  ));

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between gap-2 px-4">
        <div className="flex items-center gap-2">
          <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">{t("nav.openMenu")}</span>
              </Button>
            </SheetTrigger>

            <SheetContent side={i18n.dir() === "rtl" ? "right" : "left"}>
              <SheetHeader>
                <SheetTitle>{t("brand")}</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">{navLinks}</nav>
              <div className="flex items-center gap-1 px-4">
                <LanguageToggle />
                <ThemeToggle />
              </div>
            </SheetContent>
          </Sheet>

          <Logo />
        </div>

        <nav className="hidden items-center gap-1 md:flex">{navLinks}</nav>

        <div className="flex items-center gap-1">
          {/* On phones these live in the side menu to keep the bar from overflowing. */}
          <div className="hidden items-center gap-1 md:flex">
            <LanguageToggle />
            <ThemeToggle />
          </div>

          <Button variant="ghost" size="icon" asChild className="relative">
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">{t("nav.cart")}</span>
              {totalItems > 0 && (
                <span className="absolute -end-1 -top-1 flex h-5 min-w-5 items-center justify-center bg-primary px-1 text-xs font-bold text-primary-foreground">
                  {totalItems}
                </span>
              )}
            </Link>
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="max-w-56 truncate">
                  {user.user_metadata?.full_name ?? user.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => logoutUser()}
                  className="text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  {t("nav.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm">
              <Link to="/login">{t("nav.login")}</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
