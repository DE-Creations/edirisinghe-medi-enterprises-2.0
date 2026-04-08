import React, { useEffect } from "react";
import { router, usePage } from "@inertiajs/react";
import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/contexts/AuthContext";

export default function AppShell({ children, guestOnly = false }: { children: React.ReactNode; guestOnly?: boolean }) {
  const { isAuthenticated, bootstrapped } = useAuth();
  const page = usePage();

  useEffect(() => {
    if (!bootstrapped) return;

    if (guestOnly && isAuthenticated && page.url === "/login") {
      router.visit("/invoice");
      return;
    }

    if (!guestOnly && !isAuthenticated && page.url !== "/login") {
      router.visit("/login");
    }
  }, [bootstrapped, guestOnly, isAuthenticated, page.url]);

  if (!bootstrapped) return null;
  if (guestOnly) return <>{children}</>;
  if (!isAuthenticated) return null;

  return <AppLayout>{children}</AppLayout>;
}
