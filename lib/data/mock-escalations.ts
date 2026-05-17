import { ROUTES } from "@/lib/constants/routes";
import type { EscalationLog, EscalationRule } from "@/lib/types/escalation";

export const mockEscalationRules: EscalationRule[] = [
  {
    id: "rule-goals-not-submitted",
    name: "Employee goals not submitted",
    description:
      "Flags employees whose goals remain in draft after the cycle opening grace period.",
    thresholdLabel: "5 days after cycle opening",
    escalationChain: "Employee -> Manager -> HR",
    isActive: true
  },
  {
    id: "rule-manager-approval-pending",
    name: "Manager approval pending",
    description:
      "Flags submitted goal sets waiting too long for manager approval or return.",
    thresholdLabel: "3 days after submission",
    escalationChain: "Manager -> Skip-level / HR",
    isActive: true
  },
  {
    id: "rule-quarterly-checkin-missing",
    name: "Quarterly check-in incomplete",
    description:
      "Flags employees or managers with missing quarterly updates near the check-in close.",
    thresholdLabel: "Within active check-in window",
    escalationChain: "Employee -> Manager -> HR",
    isActive: true
  }
];

export const mockEscalationLogs: EscalationLog[] = [
  {
    id: "escalation-sophia-goals-draft",
    type: "goal_submission_overdue",
    affectedEmployeeName: "Sophia Lee",
    affectedManagerName: "Priya Nair",
    triggerReason: "Goal submission is still in draft after the submission window.",
    severity: "high",
    status: "open",
    createdAt: "2026-04-16T09:00:00.000Z",
    nextAction: "Manager follow-up required; HR visibility if unresolved.",
    targetRoute: ROUTES.ADMIN_REPORTS,
    highlightId: "employee-sophia-lee"
  },
  {
    id: "escalation-noah-approval-pending",
    type: "manager_approval_overdue",
    affectedEmployeeName: "Noah Williams",
    affectedManagerName: "Marcus Chen",
    triggerReason: "Submitted goals are pending manager approval for more than 3 days.",
    severity: "medium",
    status: "notified",
    createdAt: "2026-04-17T10:30:00.000Z",
    nextAction: "Manager should approve or return goals for rework.",
    targetRoute: ROUTES.ADMIN_REPORTS,
    highlightId: "employee-noah-williams"
  },
  {
    id: "escalation-lina-checkin-missing",
    type: "quarterly_checkin_overdue",
    affectedEmployeeName: "Lina Gomez",
    affectedManagerName: "Marcus Chen",
    triggerReason: "Quarterly check-in is not completed for the active window.",
    severity: "medium",
    status: "open",
    createdAt: "2026-06-29T15:00:00.000Z",
    nextAction: "Confirm goal readiness and complete check-in discussion.",
    targetRoute: ROUTES.ADMIN_REPORTS,
    highlightId: "employee-lina-gomez"
  },
  {
    id: "escalation-emma-checkin-complete",
    type: "quarterly_checkin_overdue",
    affectedEmployeeName: "Emma Patel",
    affectedManagerName: "Marcus Chen",
    triggerReason: "Reminder was resolved after manager comment was saved.",
    severity: "low",
    status: "resolved",
    createdAt: "2026-06-14T12:00:00.000Z",
    nextAction: "No action required.",
    targetRoute: ROUTES.ADMIN_REPORTS,
    highlightId: "employee-emma-patel"
  }
];
