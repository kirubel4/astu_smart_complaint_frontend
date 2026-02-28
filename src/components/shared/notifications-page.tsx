"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNotificationStore } from "@/store/notification.store";
import { notificationService } from "@/lib/services/notification.service";
import { formatDate } from "@/lib/utils";

export function NotificationsPageContent() {
  const { notifications, fetchNotifications, markReadLocal } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markRead = async (id: string) => {
    try {
      await notificationService.markRead(id);
      markReadLocal(id);
    } catch {
      toast.error("Failed to mark notification as read");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Notifications</h2>
      {notifications.map((notification) => (
        <Card key={notification.id} className={!notification.read ? "border-primary/40" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{notification.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">{notification.message}</p>
            <p className="text-xs text-muted-foreground">{formatDate(notification.createdAt)}</p>
            {!notification.read && (
              <Button size="sm" variant="outline" onClick={() => markRead(notification.id)}>
                Mark as read
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
      {notifications.length === 0 && <p className="text-sm text-muted-foreground">No notifications available.</p>}
    </div>
  );
}

