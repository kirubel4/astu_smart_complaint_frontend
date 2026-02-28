"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { complaintService } from "@/lib/services/complaint.service";
import { staffService } from "@/lib/services/staff.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/lib/utils";
import type { Complaint, ComplaintStatus, Remark } from "@/types";

const statusOptions: ComplaintStatus[] = ["OPEN", "IN_PROGRESS", "RESOLVED"];

export default function StaffComplaintDetailPage() {
  const params = useParams<{ id: string }>();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [remarks, setRemarks] = useState<Remark[]>([]);
  const [status, setStatus] = useState<ComplaintStatus>("OPEN");
  const [remarkText, setRemarkText] = useState("");

  const load = useCallback(async () => {
    if (!params.id) return;
    const [complaintData, remarksData] = await Promise.all([staffService.getAssignedComplaintById(params.id), complaintService.getRemarks(params.id)]);
    setComplaint(complaintData);
    setStatus(complaintData.status);
    setRemarks(remarksData.length ? remarksData : complaintData.remarks ?? []);
  }, [params.id]);

  useEffect(() => {
    load().catch(() => null);
  }, [load]);

  const updateStatus = async () => {
    if (!params.id) return;
    await staffService.updateStatus(params.id, status);
    toast.success("Status updated");
    load().catch(() => null);
  };

  const addRemark = async () => {
    if (!params.id || !remarkText.trim()) return;
    await staffService.addRemark(params.id, remarkText);
    setRemarkText("");
    toast.success("Remark added");
    load().catch(() => null);
  };

  if (!complaint) return <p className="text-sm text-muted-foreground">Loading complaint...</p>;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><div className="flex items-center justify-between gap-2"><CardTitle>{complaint.title}</CardTitle><StatusBadge status={complaint.status} /></div></CardHeader>
        <CardContent className="space-y-2">
          <p>{complaint.description}</p>
          <p className="text-sm text-muted-foreground">Student: {complaint.student?.name || "N/A"} ({complaint.student?.email || "N/A"})</p>
          <p className="text-sm text-muted-foreground">Created: {formatDate(complaint.createdAt)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Update Status</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap items-end gap-3">
          <div className="min-w-[220px] space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as ComplaintStatus)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{statusOptions.map((option) => <SelectItem key={option} value={option}>{option.replace("_", " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <Button onClick={updateStatus}>Save Status</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Remarks</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2"><Input placeholder="Add remark..." value={remarkText} onChange={(e) => setRemarkText(e.target.value)} /><Button onClick={addRemark}>Add</Button></div>
          {remarks.map((remark) => <div key={remark.id} className="rounded border p-3"><p>{remark.text}</p><p className="text-xs text-muted-foreground">{formatDate(remark.createdAt)}</p></div>)}
        </CardContent>
      </Card>
    </div>
  );
}
