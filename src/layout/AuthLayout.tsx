import { Outlet } from "react-router";

import LanguageToggle from "@/components/LanguageToggle";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";

export default function AuthLayout() {
  return (
    <main className="relative flex min-h-svh items-center justify-center bg-muted px-4 py-10">
      <div className="absolute end-4 top-4 flex items-center gap-1">
        <LanguageToggle />
        <ThemeToggle />
      </div>

      <div className="flex w-full max-w-sm flex-col gap-6">
        <Logo className="self-center" />

        <Outlet />
      </div>
    </main>
  );
}
