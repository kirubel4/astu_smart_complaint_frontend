"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComplaintCard } from "@/components/shared/complaint-card";
import { complaintService } from "@/lib/services/complaint.service";
import type { Complaint } from "@/types";
import { PageSkeleton } from "@/components/shared/loading";

function DashboardContent() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    complaintService.getStudentComplaints().then(setComplaints).catch(() => setComplaints([]));
  }, []);

  const stats = useMemo(() => {
    const total = complaints.length;
    const open = complaints.filter((c) => c.status === "OPEN").length;
    const inProgress = complaints.filter((c) => c.status === "IN_PROGRESS").length;
    const resolved = complaints.filter((c) => c.status === "RESOLVED").length;
    return { total, open, inProgress, resolved };
  }, [complaints]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Student Dashboard</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(stats).map(([label, value]) => (
          <Card key={label}>
            <CardHeader className="pb-2"><CardTitle className="text-sm capitalize">{label}</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold">{value}</p></CardContent>
          </Card>
        ))}
      </div>
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Recent Complaints</h3>
        <div className="grid gap-3">
          {complaints.slice(0, 5).map((complaint) => (
            <ComplaintCard key={complaint.id} complaint={complaint} href={`/student/complaints/${complaint.id}`} />
          ))}
          {complaints.length === 0 && <p className="text-sm text-muted-foreground">No complaints yet.</p>}
        </div>
      </div>
    </div>
  );
}

export default function StudentDashboardPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
