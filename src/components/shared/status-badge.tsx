import { Badge } from "@/components/ui/badge";
import type { ComplaintStatus } from "@/types";

const styles: Record<ComplaintStatus, string> = {
  OPEN: "bg-red-100 text-red-700",
  IN_PROGRESS: "bg-amber-100 text-amber-700",
  RESOLVED: "bg-emerald-100 text-emerald-700",
};

export function StatusBadge({ status }: { status: ComplaintStatus }) {
  return <Badge className={styles[status]}>{status.replace("_", " ")}</Badge>;
}
