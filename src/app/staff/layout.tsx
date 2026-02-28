"use client";

import { RoleLayoutContainer } from "@/components/layout/role-layout-container";

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return <RoleLayoutContainer role="STAFF">{children}</RoleLayoutContainer>;
}
