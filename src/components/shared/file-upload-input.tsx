"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function FileUploadInput({ onChange }: { onChange: (file: File | null) => void }) {
  return (
    <div className="space-y-2">
      <Label htmlFor="attachment">Attachment</Label>
      <Input
        id="attachment"
        type="file"
        accept="image/*,.pdf,.doc,.docx"
        onChange={(e) => onChange(e.target.files?.[0] || null)}
      />
    </div>
  );
}
