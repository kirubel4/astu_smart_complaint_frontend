"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, UserRole } from "@/types";

interface AuthState {
  token: string | null;
  user: User | null;
  role: UserRole | null;
  hydrated: boolean;
  setAuth: (payload: { token: string; user: User; role: UserRole }) => void;
  clearAuth: () => void;
  setHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      role: null,
      hydrated: false,
      setAuth: ({ token, user, role }) => set({ token, user, role }),
      clearAuth: () => set({ token: null, user: null, role: null }),
      setHydrated: (value) => set({ hydrated: value }),
    }),
    {
      name: "astu-auth",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);

