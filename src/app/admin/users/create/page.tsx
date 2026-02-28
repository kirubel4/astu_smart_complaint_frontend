"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { adminService } from "@/lib/services/admin.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(6), role: z.enum(["STAFF", "ADMIN"]) });
type FormValues = z.infer<typeof schema>;

export default function AdminCreateUserPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { role: "STAFF" } });

  const onSubmit = async (values: FormValues) => {
    try {
      await adminService.createUser(values);
      toast.success("User created");
      router.push("/admin/users");
    } catch {
      toast.error("Failed to create user");
    }
  };

  return (
    <Card className="max-w-xl">
      <CardHeader><CardTitle>Create User</CardTitle></CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2"><Label>Name</Label><Input {...register("name")} />{errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}</div>
          <div className="space-y-2"><Label>Email</Label><Input type="email" {...register("email")} />{errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}</div>
          <div className="space-y-2"><Label>Password</Label><Input type="password" {...register("password")} />{errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}</div>
          <div className="space-y-2"><Label>Role</Label><select className="h-10 w-full rounded-md border bg-background px-3 text-sm" {...register("role")}><option value="STAFF">STAFF</option><option value="ADMIN">ADMIN</option></select></div>
          <Button disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Create User"}</Button>
        </form>
      </CardContent>
    </Card>
  );
}
