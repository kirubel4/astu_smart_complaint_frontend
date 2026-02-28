import { axiosClient } from "@/lib/api/axiosClient";
import { useAuthStore } from "@/store/auth.store";
import type { Complaint, ComplaintStatus, Remark } from "@/types";

const mapUser = (user: any, fallbackRole: "STUDENT" | "STAFF" = "STUDENT") => ({
  id: user.id,
  name: user.name ?? user.fullName ?? "User",
  email: user.email ?? "",
  role: user.role ?? fallbackRole,
});

const mapRemark = (remark: any): Remark => ({
  id: remark.id,
  text: remark.text ?? remark.message ?? "",
  createdAt: remark.createdAt,
  author: remark.staff ? mapUser(remark.staff, "STAFF") : undefined,
});

const mapComplaint = (item: any): Complaint => ({
  id: item.id,
  title: item.title,
  description: item.description,
  status: item.status,
  category: item.category
    ? {
        id: item.category.id,
        name: item.category.name,
      }
    : undefined,
  createdAt: item.createdAt,
  attachmentUrl: item.attachmentUrl ?? item.attachment,
  student: item.student ? mapUser(item.student, "STUDENT") : undefined,
  remarks: Array.isArray(item.remarks) ? item.remarks.map(mapRemark) : [],
});

export const complaintService = {
  async createComplaint(payload: { title: string; description: string; categoryId: string; attachment?: string }) {
    const studentId = useAuthStore.getState().user?.id;
    if (!studentId) throw new Error("Student profile is missing. Please log in again.");
    const { data } = await axiosClient.post(`/complaint/students/${studentId}/complaints`, payload);
    return mapComplaint(data?.data ?? data);
  },
  async getStudentComplaints() {
    const { data } = await axiosClient.get("/student/my-complaints");
    const list = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
    return list.map(mapComplaint);
  },
  async getComplaintById(id: string) {
    const role = useAuthStore.getState().role;
    if (role === "STAFF") {
      const { data } = await axiosClient.get(`/staff/assigned/${id}`);
      return mapComplaint(data?.data ?? data);
    }
    if (role === "ADMIN") {
      const { data } = await axiosClient.get(`/admin/complaints/${id}`);
      return mapComplaint(data?.data ?? data);
    }
    const complaints = await this.getStudentComplaints();
    const complaint = complaints.find((item) => item.id === id);
    if (!complaint) throw new Error("Complaint not found");
    return complaint;
  },
  async updateComplaintStatus(id: string, status: ComplaintStatus) {
    const { data } = await axiosClient.patch(`/staff/assigned/${id}/status`, { status });
    return mapComplaint(data?.data ?? data);
  },
  async getStaffAssigned() {
    const { data } = await axiosClient.get("/staff/assigned");
    const list = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
    return list.map(mapComplaint);
  },
  async addRemark(complaintId: string, text: string) {
    const { data } = await axiosClient.post(`/staff/assigned/${complaintId}/remark`, { message: text });
    return mapRemark(data?.data ?? data);
  },
  async getRemarks(complaintId: string) {
    const { data } = await axiosClient.get(`/remark/complaints/${complaintId}/remarks`);
    const list = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
    return list.map(mapRemark);
  },
};
