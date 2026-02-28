import { axiosClient } from "@/lib/api/axiosClient";
import type { LoginResponse, UserRole } from "@/types";

export const authService = {
 async login(payload: { email: string; password: string }) {
  const { data } = await axiosClient.post("/auth/login", payload);

  if (!data.success) throw new Error(data.message || "Login failed");

  const user = data.data;

  return {
    token: user.aToken,
    user: {
      id: user.id,
      name: user.fullName,
      email: user.email,
      role: user.role,
    },
  };
}
};

