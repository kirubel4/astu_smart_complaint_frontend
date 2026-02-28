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

const schema = z.object({ name: z.string().min(2), email: z.string().email() });
type FormValues = z.infer<typeof schema>;

export default function StudentProfilePage() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    studentService.getProfile().then((profile) => reset({ name: profile.name, email: profile.email })).catch(() => null);
  }, [reset]);

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      await studentService.updateProfile(values);
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-xl">
      <CardHeader><CardTitle>My Profile</CardTitle></CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" {...register("name")} />{errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}</div>
          <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" {...register("email")} />{errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}</div>
          <Button disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
        </form>
      </CardContent>
    </Card>
  );
}
