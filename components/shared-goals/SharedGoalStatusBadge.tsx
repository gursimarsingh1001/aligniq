import { Badge } from "@/components/ui/badge";
import type { SharedGoalStatus } from "@/lib/types/shared-goal";
import { cn } from "@/lib/utils";

const statusLabels: Record<SharedGoalStatus, string> = {
  active: "Active",
  archived: "Archived",
  completed: "Completed",
  draft: "Draft"
};

export function SharedGoalStatusBadge({
  status
}: {
  status: SharedGoalStatus;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "border-transparent font-medium",
        status === "active" && "bg-emerald-50 text-emerald-700",
        status === "draft" && "bg-amber-50 text-amber-700",
        status === "completed" && "bg-blue-50 text-blue-700",
        status === "archived" && "bg-slate-100 text-slate-600"
      )}
    >
      {statusLabels[status]}
    </Badge>
  );
}
