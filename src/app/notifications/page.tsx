"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageSkeleton } from "@/components/shared/loading";
import { useAuthStore } from "@/store/auth.store";

export default function NotificationsRedirectPage() {
  const router = useRouter();
  const role = useAuthStore((s) => s.role);

  useEffect(() => {
    if (role === "STUDENT") router.replace("/student/notifications");
    else if (role === "STAFF") router.replace("/staff/notifications");
    else if (role === "ADMIN") router.replace("/admin/notifications");
    else router.replace("/login");
  }, [role, router]);

  return <PageSkeleton />;
}

