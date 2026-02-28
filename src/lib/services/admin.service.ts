import { axiosClient } from "@/lib/api/axiosClient";
import type { Complaint, ComplaintStatus, DashboardAnalytics, User, UserRole } from "@/types";

const normalizeUser = (user: any): User => ({
  id: user.id,
  name: user.name ?? user.fullName ?? "",
  email: user.email,
  role: user.role,
});

const normalizeComplaint = (item: any): Complaint => ({
  id: item.id,
  title: item.title,
  description: item.description,
  status: item.status,
  staffId: item.staffId ?? item.assignedTo?.id,
  assignedTo: item.assignedTo ? normalizeUser(item.assignedTo) : undefined,
  category: item.category
    ? {
        id: item.category.id,
        name: item.category.name,
      }
    : undefined,
  createdAt: item.createdAt,
  attachmentUrl: item.attachmentUrl ?? item.attachment,
  student: item.student ? normalizeUser(item.student) : undefined,
});

const normalizeDashboard = (raw: any): DashboardAnalytics => {
  const data = raw?.data ?? raw;
  const total = Number(data?.total ?? 0);
  const open = Number(data?.open ?? 0);
  const inProgress = Number(data?.inProgress ?? 0);
  const resolved = Number(data?.resolved ?? 0);
  const complaintsByCategory = Array.isArray(data?.byCategory)
    ? data.byCategory.map((item: any) => ({
        category: item.name,
        count: Number(item?._count?.complaints ?? 0),
      }))
    : [];

  return {
    totalComplaints: total,
    complaintsByStatus: [
      { status: "OPEN", count: open },
      { status: "IN_PROGRESS", count: inProgress },
      { status: "RESOLVED", count: resolved },
    ],
    complaintsByCategory,
    resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0,
    submissionsPerDay: [],
  };
};

export const adminService = {
  async createUser(payload: {
    name: string;
    email: string;
    password: string;
    role: Extract<UserRole, "STAFF" | "ADMIN">;
  }) {
    try {
      const { data } = await axiosClient.post("/admin/users", {
        fullName: payload.name,
        email: payload.email,
        password: payload.password,
        role: payload.role,
      });
      return normalizeUser(data?.data ?? data);
    } catch (error) {
      handleError(error);
    }
  },

  async getUsers() {
    try {
      const { data } = await axiosClient.get("/admin/users");
      const list = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
      return list.map(normalizeUser);
    } catch (error) {
      handleError(error);
    }
  },

  async getComplaints() {
    try {
      const { data } = await axiosClient.get("/admin/complaints");
      const list = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
      return list.map(normalizeComplaint);
    } catch (error) {
      handleError(error);
    }
  },

  async assignComplaintToStaff(complaintId: string, staffId: string) {
    try {
      const { data } = await axiosClient.post("/admin/complaints/assign", { complaintId, staffId });
      return normalizeComplaint(data?.data ?? data);
    } catch (error) {
      handleError(error);
    }
  },

  async updateComplaintStatus(complaintId: string, status: ComplaintStatus) {
    try {
      const { data } = await axiosClient.post("/admin/complaints/status", { complaintId, status });
      return normalizeComplaint(data?.data ?? data);
    } catch (error) {
      handleError(error);
    }
  },

  async getDashboard() {
    try {
      const { data } = await axiosClient.get("/admin/complaints-analytics");
      return normalizeDashboard(data);
    } catch (error) {
      handleError(error);
    }
  },
};

const handleError = (error: any) => {
  console.error("An error occurred:", error);
  throw new Error(error.response?.data?.message || error.response?.data?.error || "An unexpected error occurred.");
};

export default adminService;
