import { axiosClient } from "@/lib/api/axiosClient";
import type { Complaint, ComplaintStatus, Remark } from "@/types";

const normalizeRemarks = (raw: unknown[]): Remark[] =>
  raw.map((item: any) => ({
    id: item.id,
    text: item.text ?? item.message ?? "",
    createdAt: item.createdAt,
    author: item.staff
      ? {
          id: item.staff.id,
          name: item.staff.name ?? item.staff.fullName ?? "Staff",
          email: item.staff.email ?? "",
          role: item.staff.role ?? "STAFF",
        }
      : undefined,
  }));

const normalizeComplaint = (item: any): Complaint => ({
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
  student: item.student
    ? {
        id: item.student.id,
        name: item.student.name ?? item.student.fullName ?? "Student",
        email: item.student.email,
        role: item.student.role ?? "STUDENT",
      }
    : undefined,
  remarks: Array.isArray(item.remarks) ? normalizeRemarks(item.remarks) : [],
});

export const staffService = {
  async getAssignedComplaints() {
    const { data } = await axiosClient.get("/staff/assigned");
    const list = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
    return list.map(normalizeComplaint);
  },
  async getAssignedComplaintById(id: string) {
    const { data } = await axiosClient.get(`/staff/assigned/${id}`);
    const complaint = data?.data ?? data;
    return normalizeComplaint(complaint);
  },
  async updateStatus(id: string, status: ComplaintStatus) {
    const { data } = await axiosClient.patch(`/staff/assigned/${id}/status`, { status });
    return (data?.data ?? data) as Complaint;
  },
  async addRemark(id: string, text: string) {
    const { data } = await axiosClient.post(`/staff/assigned/${id}/remark`, { message: text });
    const remark = data?.data ?? data;
    return {
      id: remark.id,
      text: remark.text ?? remark.message ?? "",
      createdAt: remark.createdAt,
    } as Remark;
  },
};
