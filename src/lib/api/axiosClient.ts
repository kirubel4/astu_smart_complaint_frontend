"use client";

import axios, { AxiosError } from "axios";
import { useAuthStore } from "@/store/auth.store";

export const axiosClient = axios.create({
  baseURL: "http://localhost:4000/api/v1",
  withCredentials: true,
  timeout: 15000,
});

axiosClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status;
    if (status === 401 && typeof window !== "undefined") {
      useAuthStore.getState().clearAuth();
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

