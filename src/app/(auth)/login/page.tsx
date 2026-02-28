"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { authService } from "@/lib/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UserRole } from "@/types";

const schema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof schema>;

type JwtPayload = {
  sub?: string;
  id?: string;
  email?: string;
  name?: string;
  role: UserRole;
};

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const token = useAuthStore((s) => s.token);
  const role = useAuthStore((s) => s.role);
  const hydrated = useAuthStore((s) => s.hydrated);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (!hydrated) return;
    if (token && role) {
      router.replace(`/${role.toLowerCase()}/dashboard`);
      return;
    }
    if (!token && role) {
      clearAuth();
    }
  }, [clearAuth, hydrated, role, router, token]);

  const rolePath = useMemo<Record<UserRole, string>>(
    () => ({ STUDENT: "/student/dashboard", STAFF: "/staff/dashboard", ADMIN: "/admin/dashboard" }),
    []
  );

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      const data = await authService.login(values);
      const decoded = jwtDecode<JwtPayload>(data.token);
      const resolvedRole = decoded.role;
      const resolvedUser = data.user || {
        id: decoded.id || decoded.sub || "",
        name: decoded.name || "User",
        email: decoded.email || values.email,
        role: resolvedRole,
      };

      await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: data.token }),
      });
      setAuth({ token: data.token, user: resolvedUser, role: resolvedRole });
      toast.success("Logged in successfully");
      router.push(rolePath[resolvedRole]);
    } catch {
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-cyan-50 to-teal-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Access ASTU Smart Complaint & Issue Tracking System</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="name@astu.edu" {...register("email")} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
