"use client";

import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useNotificationStore } from "@/store/notification.store";
import { useAuthStore } from "@/store/auth.store";
import type { Notification } from "@/types";

const isComplaintStatusNotification = (notification: Notification) => {
  const text = `${notification.title} ${notification.message}`.toLowerCase();
  const mentionsComplaint = text.includes("complaint");
  const mentionsUpdate =
    text.includes("updated") ||
    text.includes("update") ||
    text.includes("in progress") ||
    text.includes("in_progress");
  const mentionsResolved = text.includes("resolved") || text.includes("closed");
  return mentionsComplaint && (mentionsUpdate || mentionsResolved);
};

export function AppProviders({ children }: { children: React.ReactNode }) {
  const fetchNotifications = useNotificationStore((s) => s.fetchNotifications);
  const notifications = useNotificationStore((s) => s.notifications);
  const token = useAuthStore((s) => s.token);
  const hydrated = useAuthStore((s) => s.hydrated);
  const role = useAuthStore((s) => s.role);
  const seenNotificationIds = useRef(new Set<string>());
  const initialized = useRef(false);

  useEffect(() => {
    if (!hydrated || !token) return;
    fetchNotifications();
    const timer = setInterval(fetchNotifications, 20000);
    return () => clearInterval(timer);
  }, [fetchNotifications, token, hydrated]);

  useEffect(() => {
    if (!hydrated || !token || role !== "STUDENT") return;

    if (!initialized.current) {
      notifications.forEach((notification) => seenNotificationIds.current.add(notification.id));
      initialized.current = true;
      return;
    }

    for (const notification of notifications) {
      if (seenNotificationIds.current.has(notification.id)) continue;
      seenNotificationIds.current.add(notification.id);
      if (!isComplaintStatusNotification(notification)) continue;
      toast.success(notification.message || notification.title || "Your complaint has a new status update.");
    }
  }, [notifications, hydrated, token, role]);

  useEffect(() => {
    if (token) return;
    seenNotificationIds.current.clear();
    initialized.current = false;
  }, [token]);

  return <>{children}</>;
}
