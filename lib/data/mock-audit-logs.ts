import type { AuditLog } from "@/lib/types/audit";

export const mockAuditLogs: AuditLog[] = [
  {
    id: "audit-emma-submitted",
    actorId: "demo-employee",
    entityType: "goal_submission",
    entityId: "submission-emma-q2",
    action: "submitted",
    summary: "Emma Patel submitted FY26 Q2 goals.",
    metadata: {
      goalCount: 3,
      totalWeightage: 100,
      oldValue: "Draft",
      newValue: "Submitted",
      details: "Employee submitted goals with total weightage of 100%."
    },
    createdAt: "2026-04-10T09:30:00.000Z"
  },
  {
    id: "audit-emma-approved",
    actorId: "demo-manager",
    entityType: "goal_submission",
    entityId: "submission-emma-q2",
    action: "approved",
    summary: "Marcus Chen approved Emma Patel goals.",
    metadata: {
      oldValue: "Submitted",
      newValue: "Approved",
      details: "Manager approved the submitted Q2 goals."
    },
    createdAt: "2026-04-12T14:00:00.000Z"
  },
  {
    id: "audit-lina-returned",
    actorId: "demo-manager",
    entityType: "goal_submission",
    entityId: "submission-lina-q2",
    action: "returned",
    summary: "Marcus Chen returned Lina Gomez goals for rework.",
    metadata: {
      oldValue: "Submitted",
      newValue: "Returned",
      reason: "Reliability target must be measurable",
      details: "Submission returned with manager guidance for measurable targets."
    },
    createdAt: "2026-04-12T10:20:00.000Z"
  },
  {
    id: "audit-cycle-opened",
    actorId: "demo-admin",
    entityType: "goal_cycle",
    entityId: "cycle-fy26-q2",
    action: "cycle_opened",
    summary: "Ava Rodriguez opened FY26 Q2 goal cycle.",
    metadata: {
      cycle: "FY26 Q2",
      oldValue: "Draft",
      newValue: "Active",
      details: "Goal setting cycle was opened for employee submissions."
    },
    createdAt: "2026-04-01T08:00:00.000Z"
  },
  {
    id: "audit-noah-submitted",
    actorId: "employee-noah",
    entityType: "goal_submission",
    entityId: "submission-noah-q2",
    action: "submitted",
    summary: "Noah Williams submitted FY26 Q2 goals.",
    metadata: {
      oldValue: "Draft",
      newValue: "Submitted",
      details: "Submission is awaiting manager review."
    },
    createdAt: "2026-04-13T10:15:00.000Z"
  },
  {
    id: "audit-owen-approved",
    actorId: "manager-priya",
    entityType: "goal_submission",
    entityId: "submission-owen-q2",
    action: "approved",
    summary: "Priya Nair approved Owen Miller goals.",
    metadata: {
      oldValue: "Submitted",
      newValue: "Approved",
      details: "Approved goals are locked for quarterly tracking."
    },
    createdAt: "2026-04-10T11:30:00.000Z"
  },
  {
    id: "audit-emma-quarterly-update",
    actorId: "demo-employee",
    entityType: "quarterly_update",
    entityId: "update-emma-completion-clarity",
    action: "updated",
    summary: "Emma Patel updated Q2 achievement progress.",
    metadata: {
      oldValue: "Not recorded",
      newValue: "91.76% progress",
      details: "Quarterly update captured actual achievement against target."
    },
    createdAt: "2026-06-28T10:05:00.000Z"
  },
  {
    id: "audit-emma-manager-checkin",
    actorId: "demo-manager",
    entityType: "checkin",
    entityId: "checkin-emma-q2",
    action: "checkin_added",
    summary: "Marcus Chen added Emma Patel Q2 check-in comments.",
    metadata: {
      oldValue: "Pending",
      newValue: "Completed",
      details: "Manager documented the quarterly check-in discussion."
    },
    createdAt: "2026-06-15T11:00:00.000Z"
  },
  {
    id: "audit-shared-resolution-created",
    actorId: "demo-manager",
    entityType: "shared_goal",
    entityId: "shared-goal-resolution-turnaround",
    action: "created",
    summary: "Marcus Chen created a shared customer resolution goal.",
    metadata: {
      oldValue: "-",
      newValue: "Draft",
      details: "Shared departmental KPI created for Product & Engineering."
    },
    createdAt: "2026-04-08T09:00:00.000Z"
  },
  {
    id: "audit-shared-resolution-pushed",
    actorId: "demo-manager",
    entityType: "shared_goal",
    entityId: "shared-goal-resolution-turnaround",
    action: "pushed",
    summary: "Marcus Chen pushed a shared customer resolution goal.",
    metadata: {
      oldValue: "Draft",
      newValue: "Active",
      details: "Shared goal pushed to three linked employee goal sheets."
    },
    createdAt: "2026-04-09T12:00:00.000Z"
  },
  {
    id: "audit-shared-resolution-synced",
    actorId: "demo-employee",
    entityType: "shared_goal",
    entityId: "shared-goal-resolution-turnaround",
    action: "synced",
    summary: "Shared goal achievement synced from Emma Patel.",
    metadata: {
      oldValue: "Pending",
      newValue: "Synced",
      details: "Primary owner achievement synced across linked goal sheets."
    },
    createdAt: "2026-06-28T10:30:00.000Z"
  }
];
