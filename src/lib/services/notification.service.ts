import { axiosClient } from "@/lib/api/axiosClient";
import type { Notification } from "@/types";

const normalizeNotification = (item: any): Notification => ({
  id: item.id,
  title: item.title ?? "Notification",
  message: item.message ?? "",
  read: Boolean(item.read ?? item.isRead),
  createdAt: item.createdAt,
});

export const notificationService = {
  async getAll() {
    const { data } = await axiosClient.get("/notification");
    const list = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
    return list.map(normalizeNotification);
  },
  async markRead(id: string) {
    const { data } = await axiosClient.patch(`/notification/${id}/read`);
    return normalizeNotification(data?.data ?? data);
  },
};
