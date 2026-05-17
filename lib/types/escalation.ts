import type { AppRoute } from "@/lib/constants/routes";

export type EscalationSeverity = "low" | "medium" | "high";

export type EscalationStatus = "open" | "notified" | "resolved";

export type EscalationType =
  | "goal_submission_overdue"
  | "manager_approval_overdue"
  | "quarterly_checkin_overdue";

export type EscalationRule = {
  id: string;
  name: string;
  description: string;
  thresholdLabel: string;
  escalationChain: string;
  isActive: boolean;
};

export type EscalationLog = {
  id: string;
  type: EscalationType;
  affectedEmployeeName: string;
  affectedManagerName: string;
  triggerReason: string;
  severity: EscalationSeverity;
  status: EscalationStatus;
  createdAt: string;
  nextAction: string;
  targetRoute: AppRoute;
  highlightId: string;
};
