"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { adminService } from "@/lib/services/admin.service";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Complaint, ComplaintStatus, User } from "@/types";

const statusOptions: ComplaintStatus[] = ["OPEN", "IN_PROGRESS", "RESOLVED"];

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [staffUsers, setStaffUsers] = useState<User[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<Record<string, string>>({});
  const [selectedStatus, setSelectedStatus] = useState<Record<string, ComplaintStatus>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const load = async () => {
    const [complaintsData, usersData] = await Promise.all([adminService.getComplaints(), adminService.getUsers()]);
    const list: Complaint[] = complaintsData ?? [];
    const staff = (usersData ?? []).filter((u: User) => u.role === "STAFF");

    setComplaints(list);
    setStaffUsers(staff);
    setSelectedStaff(
      Object.fromEntries(
        list.map((item: Complaint) => [item.id, item.staffId ?? item.assignedTo?.id ?? ""])
      )
    );
    setSelectedStatus(Object.fromEntries(list.map((item: Complaint) => [item.id, item.status])));
  };

  useEffect(() => {
    load().catch(() => {
      setComplaints([]);
      setStaffUsers([]);
    });
  }, []);

  const staffById = useMemo(() => Object.fromEntries(staffUsers.map((user) => [user.id, user])), [staffUsers]);

  const assign = async (complaintId: string) => {
    const staffId = selectedStaff[complaintId];
    if (!staffId) {
      toast.error("Select a staff member first.");
      return;
    }

    try {
      setLoadingId(complaintId);
      await adminService.assignComplaintToStaff(complaintId, staffId);
      toast.success("Complaint assigned.");
      await load();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to assign complaint.");
    } finally {
      setLoadingId(null);
    }
  };

  const changeStatus = async (complaintId: string) => {
    const status = selectedStatus[complaintId];
    if (!status) return;

    try {
      setLoadingId(complaintId);
      await adminService.updateComplaintStatus(complaintId, status);
      toast.success("Status updated.");
      await load();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to update status.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">All Complaints</h2>
      <div className="grid gap-3">
        {complaints.map((complaint) => (
          <Card key={complaint.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base">{complaint.title}</CardTitle>
                <StatusBadge status={complaint.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{complaint.description}</p>
              <p className="text-xs text-muted-foreground">
                Student: {complaint.student?.name || "N/A"} ({complaint.student?.email || "N/A"})
              </p>
              <p className="text-xs text-muted-foreground">
                Assigned: {complaint.assignedTo ? `${complaint.assignedTo.name} (${complaint.assignedTo.email})` : "Not assigned"}
              </p>

              <div className="grid gap-2 md:grid-cols-[1fr_auto]">
                <select
                  className="h-10 rounded-md border bg-background px-3 text-sm"
                  value={selectedStaff[complaint.id] ?? ""}
                  onChange={(e) => setSelectedStaff((prev) => ({ ...prev, [complaint.id]: e.target.value }))}
                >
                  <option value="">Select staff</option>
                  {staffUsers.map((staff) => (
                    <option key={staff.id} value={staff.id}>
                      {staff.name} ({staff.email})
                    </option>
                  ))}
                </select>
                <Button onClick={() => assign(complaint.id)} disabled={loadingId === complaint.id}>
                  Assign
                </Button>
              </div>

              <div className="grid gap-2 md:grid-cols-[1fr_auto]">
                <select
                  className="h-10 rounded-md border bg-background px-3 text-sm"
                  value={selectedStatus[complaint.id] ?? complaint.status}
                  onChange={(e) =>
                    setSelectedStatus((prev) => ({ ...prev, [complaint.id]: e.target.value as ComplaintStatus }))
                  }
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status.replace("_", " ")}
                    </option>
                  ))}
                </select>
                <Button variant="secondary" onClick={() => changeStatus(complaint.id)} disabled={loadingId === complaint.id}>
                  Update Status
                </Button>
              </div>

              {complaint.assignedTo && !staffById[complaint.assignedTo.id] && (
                <p className="text-xs text-muted-foreground">Assigned user is no longer in current staff list.</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      {complaints.length === 0 && <p className="text-sm text-muted-foreground">No complaints available.</p>}
    </div>
  );
}
