"use client";

import { useEffect, useState } from "react";
import { ComplaintCard } from "@/components/shared/complaint-card";
import { staffService } from "@/lib/services/staff.service";
import type { Complaint } from "@/types";

export default function StaffComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    staffService.getAssignedComplaints().then(setComplaints).catch(() => setComplaints([]));
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Assigned Complaints</h2>
      <div className="grid gap-3">
        {complaints.map((complaint) => <ComplaintCard key={complaint.id} complaint={complaint} href={`/staff/complaints/${complaint.id}`} />)}
        {complaints.length === 0 && <p className="text-sm text-muted-foreground">No complaints assigned yet.</p>}
      </div>
    </div>
  );
}
