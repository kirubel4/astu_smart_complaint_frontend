"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { UserRole } from "@/types";
import { useAuthStore } from "@/store/auth.store";
import { PageSkeleton } from "@/components/shared/loading";

export function ProtectedRoute({ role, children }: { role: UserRole; children: React.ReactNode }) {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const currentRole = useAuthStore((s) => s.role);
  const hydrated = useAuthStore((s) => s.hydrated);

  useEffect(() => {
    if (!hydrated) return;
    if (!token) {
      router.replace("/login");
      return;
    }
    if (currentRole && currentRole !== role) {
      router.replace(`/${currentRole.toLowerCase()}/dashboard`);
    }
  }, [token, currentRole, role, router, hydrated]);

  if (!hydrated || !token || currentRole !== role) return <PageSkeleton />;

  return <>{children}</>;
}
