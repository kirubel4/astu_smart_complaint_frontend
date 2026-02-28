import { axiosClient } from "@/lib/api/axiosClient";
import type { Category } from "@/types";

export const categoryService = {
  async getAll() {
    const { data } = await axiosClient.get("/category/categories");
    return Array.isArray(data) ? (data as Category[]) : Array.isArray(data?.data) ? (data.data as Category[]) : [];
  },
  async create(payload: { name: string }) {
    const { data } = await axiosClient.post("/category/categories", payload);
    return (data?.data ?? data) as Category;
  },
  async remove(id: string) {
    await axiosClient.delete(`/category/categories/${id}`);
  },
};
