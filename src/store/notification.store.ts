"use client";

import { create } from "zustand";
import { notificationService } from "@/lib/services/notification.service";
import type { Notification } from "@/types";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  markReadLocal: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  fetchNotifications: async () => {
    const notifications = await notificationService.getAll();
    set({
      notifications,
      unreadCount: notifications.filter((n: Notification) => !n.read).length,
    });
  },
  markReadLocal: (id: string) => {
    const updated = get().notifications.map((n: Notification) => (n.id === id ? { ...n, read: true } : n));
    set({
      notifications: updated,
      unreadCount: updated.filter((n: Notification) => !n.read).length,
    });
  },
}));
