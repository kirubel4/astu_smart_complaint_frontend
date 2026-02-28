"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { staffService } from "@/lib/services/staff.service";
import { ComplaintCard } from "@/components/shared/complaint-card";
import type { Complaint } from "@/types";

export default function StaffDashboardPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    staffService.getAssignedComplaints().then(setComplaints).catch(() => setComplaints([]));
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Staff Dashboard</h2>
      <Card>
        <CardHeader><CardTitle>Assigned Complaints ({complaints.length})</CardTitle></CardHeader>
        <CardContent className="grid gap-3">
          {complaints.slice(0, 5).map((complaint) => <ComplaintCard key={complaint.id} complaint={complaint} href={`/staff/complaints/${complaint.id}`} />)}
          {complaints.length === 0 && <p className="text-sm text-muted-foreground">No assigned complaints.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
