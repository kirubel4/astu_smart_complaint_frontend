"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNotificationStore } from "@/store/notification.store";
import { notificationService } from "@/lib/services/notification.service";
import { useAuthStore } from "@/store/auth.store";
import { formatDate } from "@/lib/utils";

export function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const role = useAuthStore((s) => s.role);
  const { notifications, unreadCount, fetchNotifications, markReadLocal } = useNotificationStore();

  const notificationsPageHref = useMemo(() => {
    if (role === "STUDENT") return "/student/notifications";
    if (role === "STAFF") return "/staff/notifications";
    if (role === "ADMIN") return "/admin/notifications";
    return "/login";
  }, [role]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const onRead = async (id: string) => {
    await notificationService.markRead(id);
    markReadLocal(id);
  };

  return (
    <div className="relative" ref={panelRef}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="relative"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((v) => !v)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-red-500" />}
      </Button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-[360px] rounded-md border bg-white p-2 shadow-lg">
          <div className="px-2 py-1 text-sm font-semibold">Notifications ({unreadCount} unread)</div>
          <div className="my-1 h-px bg-muted" />

          <div className="max-h-80 overflow-y-auto">
            {notifications.slice(0, 6).map((notification) => (
              <button
                key={notification.id}
                type="button"
                className="flex w-full flex-col items-start gap-1 rounded-sm px-2 py-2 text-left hover:bg-accent"
                onClick={() => onRead(notification.id)}
              >
                <p className="font-medium">{notification.title}</p>
                <p className="text-xs text-muted-foreground">{notification.message}</p>
                <p className="text-xs text-muted-foreground">{formatDate(notification.createdAt)}</p>
              </button>
            ))}

            {notifications.length === 0 && <div className="px-2 py-4 text-center text-sm text-muted-foreground">No notifications</div>}
          </div>

          <div className="my-1 h-px bg-muted" />
          <Link href={notificationsPageHref} className="block rounded-sm px-2 py-2 text-center text-sm font-medium hover:bg-accent" onClick={() => setOpen(false)}>
            View all
          </Link>
        </div>
      )}
    </div>
  );
}

