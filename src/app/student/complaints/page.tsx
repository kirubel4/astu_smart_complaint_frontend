"use client";

import { useEffect, useState } from "react";
import { ComplaintCard } from "@/components/shared/complaint-card";
import { complaintService } from "@/lib/services/complaint.service";
import type { Complaint } from "@/types";

export default function StudentComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    complaintService.getStudentComplaints().then(setComplaints).catch(() => setComplaints([]));
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">My Complaints</h2>
      <div className="grid gap-3">
        {complaints.map((complaint) => (
          <ComplaintCard key={complaint.id} complaint={complaint} href={`/student/complaints/${complaint.id}`} />
        ))}
        {complaints.length === 0 && <p className="text-sm text-muted-foreground">No complaints found.</p>}
      </div>
    </div>
  );
}
