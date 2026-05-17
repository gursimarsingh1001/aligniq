import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  ESCALATION_SEVERITY_LABELS,
  ESCALATION_STATUS_LABELS
} from "@/lib/services/escalation-service";
import type {
  EscalationSeverity,
  EscalationStatus
} from "@/lib/types/escalation";

type EscalationStatusBadgeProps =
  | {
      status: EscalationStatus;
      severity?: never;
    }
  | {
      severity: EscalationSeverity;
      status?: never;
    };

export function EscalationStatusBadge({
  severity,
  status
}: EscalationStatusBadgeProps) {
  if (severity) {
    return (
      <Badge
        variant="outline"
        className={cn(
          "border-transparent",
          severity === "high"
            ? "bg-red-50 text-red-700"
            : severity === "medium"
              ? "bg-amber-50 text-amber-700"
              : "bg-blue-50 text-blue-700"
        )}
      >
        {ESCALATION_SEVERITY_LABELS[severity]}
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "border-transparent",
        status === "resolved"
          ? "bg-emerald-50 text-emerald-700"
          : status === "notified"
            ? "bg-blue-50 text-blue-700"
            : "bg-amber-50 text-amber-700"
      )}
    >
      {ESCALATION_STATUS_LABELS[status]}
    </Badge>
  );
}
