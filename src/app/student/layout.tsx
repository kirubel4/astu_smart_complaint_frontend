"use client";

import { RoleLayoutContainer } from "@/components/layout/role-layout-container";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return <RoleLayoutContainer role="STUDENT">{children}</RoleLayoutContainer>;
}
