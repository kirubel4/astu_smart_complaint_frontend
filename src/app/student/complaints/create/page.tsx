"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { categoryService } from "@/lib/services/category.service";
import { complaintService } from "@/lib/services/complaint.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileUploadInput } from "@/components/shared/file-upload-input";
import type { Category } from "@/types";

const schema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  categoryId: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

export default function CreateComplaintPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    categoryService.getAll().then(setCategories).catch(() => setCategories([]));
  }, []);

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      await complaintService.createComplaint({
        title: values.title,
        description: values.description,
        categoryId: values.categoryId,
        attachment: file?.name,
      });
      toast.success("Complaint submitted");
      router.push("/student/complaints");
    } catch {
      toast.error("Failed to submit complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader><CardTitle>Create Complaint</CardTitle></CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2"><Label htmlFor="title">Title</Label><Input id="title" {...register("title")} />{errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}</div>
          <div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" {...register("description")} />{errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}</div>
          <div className="space-y-2">
            <Label htmlFor="categoryId">Category</Label>
            <select id="categoryId" className="h-10 w-full rounded-md border bg-background px-3 text-sm" {...register("categoryId")}>
              <option value="">Select category</option>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
            {errors.categoryId && <p className="text-xs text-destructive">{errors.categoryId.message}</p>}
          </div>
          <FileUploadInput onChange={setFile} />
          <Button disabled={loading}>{loading ? "Submitting..." : "Submit Complaint"}</Button>
        </form>
      </CardContent>
    </Card>
  );
}
