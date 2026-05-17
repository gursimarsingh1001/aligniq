import { Lock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  GOAL_STATUS_LABELS,
  GOAL_STATUSES,
  isGoalLocked,
  type GoalStatus
} from "@/lib/constants/goal-status";
import { cn } from "@/lib/utils";

type GoalStatusBadgeProps = {
  status: GoalStatus;
};

export function GoalStatusBadge({ status }: GoalStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 border-transparent",
        status === GOAL_STATUSES.APPROVED || status === GOAL_STATUSES.LOCKED
          ? "bg-emerald-50 text-emerald-700"
          : status === GOAL_STATUSES.SUBMITTED
            ? "bg-blue-50 text-blue-700"
            : status === GOAL_STATUSES.RETURNED
              ? "bg-amber-50 text-amber-700"
              : "bg-slate-100 text-slate-600"
      )}
    >
      {isGoalLocked(status) ? <Lock className="h-3 w-3" aria-hidden="true" /> : null}
      {GOAL_STATUS_LABELS[status]}
    </Badge>
  );
}
