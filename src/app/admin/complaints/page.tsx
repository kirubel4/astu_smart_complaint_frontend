"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/lib/services/admin.service";
import { ComplaintCard } from "@/components/shared/complaint-card";
import type { Complaint } from "@/types";

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    adminService.getComplaints().then((complaints) => setComplaints(complaints ?? [])).catch(() => setComplaints([]));
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">All Complaints</h2>
      <div className="grid gap-3">
        {complaints.map((complaint) => <ComplaintCard key={complaint.id} complaint={complaint} />)}
      </div>
    </div>
  );
}
