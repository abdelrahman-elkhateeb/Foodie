import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import Logo from "@/components/Logo";

const links = [
  { to: "/menu", label: "nav.menu" },
  { to: "/track-order", label: "nav.trackOrder" },
  { to: "/cart", label: "nav.cart" },
  { to: "/admin", label: "nav.dashboard" },
];

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto grid gap-10 px-4 py-12 md:grid-cols-[2fr_1fr]">
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
          <ul className="space-y-2 text-sm text-muted-foreground">
            {links.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="hover:text-foreground">
                  {t(link.label)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t">
        <p className="container mx-auto px-4 py-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} {t("brand")}. {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
}
