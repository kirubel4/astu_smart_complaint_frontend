"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { adminService } from "@/lib/services/admin.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardAnalytics } from "@/types";

const colors = ["#0284c7", "#0d9488", "#f59e0b", "#ef4444", "#6366f1"];

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    adminService
      .getDashboard()
      .then((result) => setData(result ?? null))
      .catch((err: unknown) => {
        setData(null);
        setError(err instanceof Error ? err.message : "Failed to load dashboard data.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-muted-foreground">Loading analytics...</p>;
  if (error) return <p className="text-sm text-destructive">{error}</p>;
  if (!data) return <p className="text-sm text-muted-foreground">No analytics data available.</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Admin Analytics Dashboard</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Total Complaints</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{data.totalComplaints}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Resolution Rate</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{data.resolutionRate}%</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Open</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{data.complaintsByStatus.find((x) => x.status === "OPEN")?.count || 0}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">In Progress</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{data.complaintsByStatus.find((x) => x.status === "IN_PROGRESS")?.count || 0}</p></CardContent></Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card><CardHeader><CardTitle>Complaints by Status</CardTitle></CardHeader><CardContent className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={data.complaintsByStatus}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="status" /><YAxis /><Tooltip /><Bar dataKey="count" fill="#0284c7" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle>Complaints by Category</CardTitle></CardHeader><CardContent className="h-72"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data.complaintsByCategory} dataKey="count" nameKey="category" outerRadius={90} label>{data.complaintsByCategory.map((entry, index) => <Cell key={entry.category} fill={colors[index % colors.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
      </div>
      <Card><CardHeader><CardTitle>Submissions per Day</CardTitle></CardHeader><CardContent className="h-80"><ResponsiveContainer width="100%" height="100%"><LineChart data={data.submissionsPerDay}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><YAxis /><Tooltip /><Line type="monotone" dataKey="count" stroke="#0d9488" strokeWidth={3} /></LineChart></ResponsiveContainer></CardContent></Card>
    </div>
  );
}
