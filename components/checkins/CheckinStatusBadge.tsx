import { Badge } from "@/components/ui/badge";
import {
  CHECKIN_PROGRESS_STATUS_LABELS,
  CHECKIN_PROGRESS_STATUSES,
  type CheckinProgressStatus
} from "@/lib/constants/checkin-windows";
import { cn } from "@/lib/utils";

type CheckinStatusBadgeProps = {
  status: CheckinProgressStatus;
};

export function CheckinStatusBadge({ status }: CheckinStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "border-transparent",
        status === CHECKIN_PROGRESS_STATUSES.COMPLETED
          ? "bg-emerald-50 text-emerald-700"
          : status === CHECKIN_PROGRESS_STATUSES.ON_TRACK
            ? "bg-blue-50 text-blue-700"
            : "bg-slate-100 text-slate-600"
      )}
    >
      {CHECKIN_PROGRESS_STATUS_LABELS[status]}
    </Badge>
  );
}
