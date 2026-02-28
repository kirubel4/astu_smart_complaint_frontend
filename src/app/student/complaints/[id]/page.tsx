"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { complaintService } from "@/lib/services/complaint.service";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/lib/utils";
import type { Complaint, Remark } from "@/types";

export default function StudentComplaintDetailPage() {
  const params = useParams<{ id: string }>();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [remarks, setRemarks] = useState<Remark[]>([]);

  useEffect(() => {
    if (!params.id) return;
    complaintService.getComplaintById(params.id).then(setComplaint).catch(() => setComplaint(null));
    complaintService.getRemarks(params.id).then(setRemarks).catch(() => setRemarks([]));
  }, [params.id]);

  if (!complaint) return <p className="text-sm text-muted-foreground">Loading complaint...</p>;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle>{complaint.title}</CardTitle>
            <StatusBadge status={complaint.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>{complaint.description}</p>
          <p className="text-sm text-muted-foreground">Created: {formatDate(complaint.createdAt)}</p>
          {complaint.attachmentUrl && <a className="text-sm text-primary underline" href={complaint.attachmentUrl} target="_blank" rel="noreferrer">View attachment</a>}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Remarks Timeline</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {remarks.map((remark) => (
            <div key={remark.id} className="rounded-md border p-3">
              <p>{remark.text}</p>
              <p className="text-xs text-muted-foreground">{formatDate(remark.createdAt)}</p>
            </div>
          ))}
          {remarks.length === 0 && <p className="text-sm text-muted-foreground">No remarks yet.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
