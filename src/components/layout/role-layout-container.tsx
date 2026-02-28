"use client";

import { RoleSidebar } from "@/components/layout/role-sidebar";
import { TopNavbar } from "@/components/layout/top-navbar";
import type { UserRole } from "@/types";
import { ProtectedRoute } from "@/components/shared/protected-route";

export function RoleLayoutContainer({ role, children }: { role: UserRole; children: React.ReactNode }) {
  return (
    <ProtectedRoute role={role}>
      <div className="flex min-h-screen bg-slate-50">
        <RoleSidebar role={role} />
        <div className="flex min-h-screen flex-1 flex-col">
          <TopNavbar />
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
