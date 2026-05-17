export type AuditEntityType =
  | "goal"
  | "goal_cycle"
  | "goal_submission"
  | "shared_goal"
  | "quarterly_update"
  | "checkin"
  | "user";

export type AuditAction =
  | "approved"
  | "checkin_added"
  | "created"
  | "cycle_opened"
  | "assigned"
  | "pushed"
  | "returned"
  | "synced"
  | "submitted"
  | "updated";

export type AuditLog = {
  id: string;
  actorId: string | null;
  entityType: AuditEntityType;
  entityId: string | null;
  action: AuditAction;
  summary: string;
  metadata: Record<string, unknown>;
  createdAt: string;
};

export type AuditLogRow = AuditLog & {
  actorName: string;
  actionLabel: string;
  entityTypeLabel: string;
  entityName: string;
  oldValue: string;
  newValue: string;
  details: string;
};
