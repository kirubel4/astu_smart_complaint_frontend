"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/auth.store";
import { NotificationDropdown } from "@/components/shared/notification-dropdown";

export function TopNavbar() {
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const onLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    clearAuth();
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 sm:px-6">
      <div>
        <p className="font-semibold">Welcome, {user?.name || "User"}</p>
        <p className="text-xs text-muted-foreground">ASTU Smart Complaint & Issue Tracking System</p>
      </div>
      <div className="flex items-center gap-3">
        <NotificationDropdown />
        <Avatar>
          <AvatarFallback>{user?.name?.[0] ?? "U"}</AvatarFallback>
        </Avatar>
        <Button onClick={onLogout} variant="outline" size="sm" className="gap-2">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}
