"use client";

import { useEffect } from "react";
import { useNotificationStore } from "@/store/notification.store";
import { useAuthStore } from "@/store/auth.store";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const fetchNotifications = useNotificationStore((s) => s.fetchNotifications);
  const token = useAuthStore((s) => s.token);
  const hydrated = useAuthStore((s) => s.hydrated);

  useEffect(() => {
    if (!hydrated || !token) return;
    fetchNotifications();
    const timer = setInterval(fetchNotifications, 20000);
    return () => clearInterval(timer);
  }, [fetchNotifications, token, hydrated]);

  return <>{children}</>;
}
