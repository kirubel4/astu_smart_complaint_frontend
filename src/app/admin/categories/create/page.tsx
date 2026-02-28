"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { categoryService } from "@/lib/services/category.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({ name: z.string().min(2) });
type FormValues = z.infer<typeof schema>;

export default function AdminCreateCategoryPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    try {
      await categoryService.create(values);
      toast.success("Category created");
      router.push("/admin/categories");
    } catch {
      toast.error("Failed to create category");
    }
  };

  return (
    <Card className="max-w-lg">
      <CardHeader><CardTitle>Create Category</CardTitle></CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2"><Label>Name</Label><Input {...register("name")} />{errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}</div>
          <Button disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Create"}</Button>
        </form>
      </CardContent>
    </Card>
  );
}
