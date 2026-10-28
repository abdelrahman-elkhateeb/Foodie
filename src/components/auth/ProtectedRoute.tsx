import { Navigate, useLocation } from "react-router";
import { useTranslation } from "react-i18next";

import { useUser } from "@/features/users/useUser";

type ProtectedRouteProps = {
  children: React.ReactNode;
  adminOnly?: boolean;
};

// Sends logged-out users to /login and brings them back here afterwards.
// adminOnly also sends logged-in non-admins home. The database enforces the
// same rule (see supabase/migrations), this just keeps the UI honest.
export default function ProtectedRoute({
  children,
  adminOnly,
}: ProtectedRouteProps) {
  const { user, isAdmin, isPending } = useUser();
  const location = useLocation();
  const { t } = useTranslation();

  if (isPending) {
    return (
      <p className="py-16 text-center text-muted-foreground">
        {t("common.loading")}
      </p>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;

  return children;
}
