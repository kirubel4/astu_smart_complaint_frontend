"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, MessageSquareWarning, PlusCircle, UserRound, Bot, Ticket, Users, FolderTree, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

interface Item {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const itemsByRole: Record<UserRole, Item[]> = {
  STUDENT: [
    { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
    { label: "My Complaints", href: "/student/complaints", icon: MessageSquareWarning },
    { label: "Create Complaint", href: "/student/complaints/create", icon: PlusCircle },
    { label: "Profile", href: "/student/profile", icon: UserRound },
    { label: "Chatbot", href: "/student/chatbot", icon: Bot },
    { label: "Notifications", href: "/student/notifications", icon: Bell },
  ],
  STAFF: [
    { label: "Dashboard", href: "/staff/dashboard", icon: LayoutDashboard },
    { label: "Assigned Tickets", href: "/staff/complaints", icon: Ticket },
    { label: "Notifications", href: "/staff/notifications", icon: Bell },
  ],
  ADMIN: [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Create User", href: "/admin/users/create", icon: PlusCircle },
    { label: "Complaints", href: "/admin/complaints", icon: MessageSquareWarning },
    { label: "Categories", href: "/admin/categories", icon: FolderTree },
    { label: "Notifications", href: "/admin/notifications", icon: Bell },
  ],
};

function getActiveHref(pathname: string, items: Item[]) {
  const matched = items.filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
  if (matched.length === 0) return null;
  matched.sort((a, b) => b.href.length - a.href.length);
  return matched[0].href;
}

export function RoleSidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const items = itemsByRole[role] || [];
  const activeHref = getActiveHref(pathname, items);

  return (
    <aside className="hidden w-64 flex-col border-r bg-white lg:flex">
      <div className="border-b px-6 py-4">
        <h1 className="text-lg font-bold">ASTU Tracker</h1>
        <p className="text-xs text-muted-foreground">{role} Portal</p>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {items.map((item) => {
          const active = activeHref === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                active ? "bg-primary text-primary-foreground" : "text-slate-600 hover:bg-slate-100",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
