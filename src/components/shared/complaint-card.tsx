import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/lib/utils";
import type { Complaint } from "@/types";

export function ComplaintCard({ complaint, href }: { complaint: Complaint; href?: string }) {
  const inner = (
    <Card className="transition hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">{complaint.title}</CardTitle>
          <StatusBadge status={complaint.status} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-2 text-sm text-muted-foreground">{complaint.description}</p>
        <p className="mt-2 text-xs text-muted-foreground">Created: {formatDate(complaint.createdAt)}</p>
      </CardContent>
    </Card>
  );

  if (!href) return inner;
  return <Link href={href}>{inner}</Link>;
}
