import { axiosClient } from "@/lib/api/axiosClient";
import type { Complaint, User } from "@/types";

const normalizeUser = (raw: any): User => ({
  id: raw.id,
  name: raw.name ?? raw.fullName ?? "",
  email: raw.email ?? "",
  role: raw.role,
});

export const studentService = {
  async getProfile() {
    const { data } = await axiosClient.get("/student/profile");
    return normalizeUser(data?.data ?? data);
  },
  async updateProfile(payload: { name: string; email: string; password?: string }) {
    const body: { fullName: string; email: string; password?: string } = {
      fullName: payload.name,
      email: payload.email,
    };
    if (payload.password) body.password = payload.password;

    const { data } = await axiosClient.put("/student/profile", body);
    return normalizeUser(data?.data ?? data);
  },
  async getMyComplaints() {
    const { data } = await axiosClient.get("/student/my-complaints");
    const list = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
    return list as Complaint[];
  },
};
