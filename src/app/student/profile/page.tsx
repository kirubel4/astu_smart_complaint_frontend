"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { studentService } from "@/lib/services/student.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Enter a valid email."),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    const hasPassword = Boolean(value.password && value.password.trim().length > 0);

    if (hasPassword && value.password!.length < 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: "New password must be at least 6 characters.",
      });
    }

    if (hasPassword && value.password !== value.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match.",
      });
    }
  });

type FormValues = z.infer<typeof schema>;

export default function StudentProfilePage() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  useEffect(() => {
    studentService
      .getProfile()
      .then((profile) => reset({ name: profile.name, email: profile.email, password: "", confirmPassword: "" }))
      .catch(() => null);
  }, [reset]);

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      await studentService.updateProfile({
        name: values.name,
        email: values.email,
        password: values.password?.trim() ? values.password.trim() : undefined,
      });
      reset({ ...values, password: "", confirmPassword: "" });
      toast.success("Profile updated");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>My Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">New Password (Optional)</Label>
            <Input id="password" type="password" placeholder="Leave blank to keep current password" {...register("password")} />
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
            {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
          </div>
          <Button disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
        </form>
      </CardContent>
    </Card>
  );
}
