import { axiosClient } from "@/lib/api/axiosClient";
import type { Complaint, User } from "@/types";

export const studentService = {
  async getProfile() {
    const { data } = await axiosClient.get<User>("/student/profile");
    return data;
  },
  async updateProfile(payload: Partial<User>) {
    const { data } = await axiosClient.put<User>("/student/profile", payload);
    return data;
  },
  async getMyComplaints() {
    const { data } = await axiosClient.get<Complaint[]>("/student/my-complaints");
    return data;
  },
};

