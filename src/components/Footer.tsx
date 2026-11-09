import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import LanguageToggle from "@/components/LanguageToggle";
import Logo from "@/components/Logo";

const links = [
  { to: "/", label: "nav.home" },
  { to: "/menu", label: "nav.menu" },
  { to: "/track-order", label: "nav.trackOrder" },
  { to: "/cart", label: "nav.cart" },
  { to: "/admin", label: "nav.dashboard" },
];

const restaurantPhone: string | undefined = import.meta.env.VITE_RESTAURANT_PHONE;

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto grid gap-10 px-4 py-12 md:grid-cols-[2fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo />

          <p className="max-w-sm text-sm text-muted-foreground">
            {t("footer.tagline")}
          </p>

          <p className="max-w-md border-s-2 border-primary ps-3 text-xs text-muted-foreground">
            {t("footer.demoNote")}
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-semibold tracking-widest uppercase">
            {t("footer.explore")}
          </h3>
          <ul className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            {links.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="hover:text-foreground">
                  {t(link.label)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {restaurantPhone && (
          <div className="space-y-4">
            <h3 className="text-xs font-semibold tracking-widest uppercase">
              {t("trackOrder.call")}
            </h3>
            <a
              href={`tel:+${restaurantPhone}`}
              dir="ltr"
              className="block text-xl font-black tabular-nums hover:text-primary-text"
            >
              +{restaurantPhone}
            </a>
          </div>
        )}
      </div>

      <div className="border-t">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {t("brand")}. {t("footer.rights")}
          </p>
          <LanguageToggle />
        </div>
      </div>
    </footer>
  );
}
