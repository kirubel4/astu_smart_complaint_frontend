"use client";

import { RoleLayoutContainer } from "@/components/layout/role-layout-container";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <RoleLayoutContainer role="ADMIN">{children}</RoleLayoutContainer>;
}
