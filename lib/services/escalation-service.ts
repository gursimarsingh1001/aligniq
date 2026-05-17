import { mockEscalationLogs, mockEscalationRules } from "@/lib/data/mock-escalations";
import type {
  EscalationSeverity,
  EscalationStatus,
  EscalationType
} from "@/lib/types/escalation";

export const ESCALATION_STATUS_LABELS: Record<EscalationStatus, string> = {
  open: "Open",
  notified: "Notified",
  resolved: "Resolved"
};

export const ESCALATION_SEVERITY_LABELS: Record<EscalationSeverity, string> = {
  low: "Low",
  medium: "Medium",
  high: "High"
};

export const ESCALATION_TYPE_LABELS: Record<EscalationType, string> = {
  goal_submission_overdue: "Goal Submission Overdue",
  manager_approval_overdue: "Manager Approval Overdue",
  quarterly_checkin_overdue: "Quarterly Check-in Overdue"
};

export function getEscalationRules() {
  return mockEscalationRules;
}

export function getEscalationLogs() {
  return [...mockEscalationLogs].sort(
    (first, second) =>
      new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime()
  );
}

export function getEscalationSummary() {
  const logs = getEscalationLogs();

  return {
    open: logs.filter((log) => log.status === "open").length,
    notified: logs.filter((log) => log.status === "notified").length,
    resolved: logs.filter((log) => log.status === "resolved").length,
    highSeverity: logs.filter((log) => log.severity === "high").length
  };
}
