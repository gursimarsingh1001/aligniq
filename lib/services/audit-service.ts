import { mockAuditLogs } from "@/lib/data/mock-audit-logs";
import { mockCheckins } from "@/lib/data/mock-checkins";
import {
  mockGoalCycles,
  mockGoals,
  mockGoalSubmissions,
  mockQuarterlyUpdates
} from "@/lib/data/mock-goals";
import { mockSharedGoals } from "@/lib/data/mock-shared-goals";
import { mockUsers } from "@/lib/data/mock-users";
import type {
  AuditAction,
  AuditEntityType,
  AuditLog,
  AuditLogRow
} from "@/lib/types/audit";

export type AuditLogFilters = {
  actorId?: string;
  entityType?: AuditEntityType;
  entityId?: string;
  action?: AuditAction;
  limit?: number;
};

export const AUDIT_ACTION_LABELS: Record<AuditAction, string> = {
  approved: "Approved",
  checkin_added: "Check-in Added",
  created: "Created",
  cycle_opened: "Cycle Opened",
  assigned: "Assigned",
  pushed: "Pushed",
  returned: "Returned",
  synced: "Synced",
  submitted: "Submitted",
  updated: "Updated"
};

export const AUDIT_ENTITY_TYPE_LABELS: Record<AuditEntityType, string> = {
  checkin: "Manager Check-in",
  goal: "Goal",
  goal_cycle: "Goal Cycle",
  goal_submission: "Goal Submission",
  shared_goal: "Shared Goal",
  quarterly_update: "Quarterly Update",
  user: "User"
};

function getMetadataText(
  metadata: Record<string, unknown>,
  key: "details" | "newValue" | "oldValue"
) {
  const value = metadata[key];

  return typeof value === "string" ? value : "-";
}

function getActorName(actorId: string | null) {
  if (!actorId) {
    return "System";
  }

  return mockUsers.find((user) => user.id === actorId)?.name ?? "Unknown user";
}

function getEntityName(log: AuditLog) {
  if (!log.entityId) {
    return "-";
  }

  if (log.entityType === "goal") {
    return mockGoals.find((goal) => goal.id === log.entityId)?.title ?? log.entityId;
  }

  if (log.entityType === "goal_cycle") {
    return (
      mockGoalCycles.find((cycle) => cycle.id === log.entityId)?.name ??
      log.entityId
    );
  }

  if (log.entityType === "goal_submission") {
    const submission = mockGoalSubmissions.find(
      (item) => item.id === log.entityId
    );
    const employee = submission
      ? mockUsers.find((user) => user.id === submission.employeeId)
      : null;

    return employee ? `${employee.name} goal submission` : log.entityId;
  }

  if (log.entityType === "shared_goal") {
    return (
      mockSharedGoals.find((sharedGoal) => sharedGoal.id === log.entityId)?.title ??
      log.entityId
    );
  }

  if (log.entityType === "quarterly_update") {
    const update = mockQuarterlyUpdates.find((item) => item.id === log.entityId);
    const goal = update
      ? mockGoals.find((item) => item.id === update.goalId)
      : null;

    return goal?.title ?? log.entityId;
  }

  if (log.entityType === "checkin") {
    const checkin = mockCheckins.find((item) => item.id === log.entityId);
    const employee = checkin
      ? mockUsers.find((user) => user.id === checkin.employeeId)
      : null;

    return employee ? `${employee.name} check-in` : log.entityId;
  }

  if (log.entityType === "user") {
    return mockUsers.find((user) => user.id === log.entityId)?.name ?? log.entityId;
  }

  return log.entityId;
}

function toAuditLogRow(log: AuditLog): AuditLogRow {
  return {
    ...log,
    actorName: getActorName(log.actorId),
    actionLabel: AUDIT_ACTION_LABELS[log.action],
    entityTypeLabel: AUDIT_ENTITY_TYPE_LABELS[log.entityType],
    entityName: getEntityName(log),
    oldValue: getMetadataText(log.metadata, "oldValue"),
    newValue: getMetadataText(log.metadata, "newValue"),
    details: getMetadataText(log.metadata, "details")
  };
}

export function getAuditLogs(filters: AuditLogFilters = {}): AuditLog[] {
  const logs = mockAuditLogs
    .filter((log) => !filters.actorId || log.actorId === filters.actorId)
    .filter((log) => !filters.entityType || log.entityType === filters.entityType)
    .filter((log) => !filters.entityId || log.entityId === filters.entityId)
    .filter((log) => !filters.action || log.action === filters.action)
    .sort(
      (firstLog, secondLog) =>
        new Date(secondLog.createdAt).getTime() -
        new Date(firstLog.createdAt).getTime()
    );

  return typeof filters.limit === "number" ? logs.slice(0, filters.limit) : logs;
}

export function getAuditLogRows(filters: AuditLogFilters = {}): AuditLogRow[] {
  return getAuditLogs(filters).map(toAuditLogRow);
}
