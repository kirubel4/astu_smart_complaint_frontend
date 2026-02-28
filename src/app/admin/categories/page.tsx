"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { categoryService } from "@/lib/services/category.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Category } from "@/types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  const load = () => {
    categoryService.getAll().then(setCategories).catch(() => setCategories([]));
  };

  useEffect(() => { load(); }, []);

  const onDelete = async (id: string) => {
    await categoryService.remove(id);
    toast.success("Category deleted");
    load();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Categories</CardTitle>
        <Link href="/admin/categories/create">
          <Button>New Category</Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-2">
        {categories.map((category) => <div key={category.id} className="flex items-center justify-between rounded-md border p-3"><p>{category.name}</p><Button variant="destructive" size="sm" onClick={() => onDelete(category.id)}>Delete</Button></div>)}
        {categories.length === 0 && <p className="text-sm text-muted-foreground">No categories yet.</p>}
      </CardContent>
    </Card>
  );
}
