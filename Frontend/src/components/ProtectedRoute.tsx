import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import type { PropsWithChildren } from "react";

export function ProtectedRoute({ children }: PropsWithChildren) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
