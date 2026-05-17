export const GOAL_STATUSES = {
  DRAFT: "draft",
  SUBMITTED: "submitted",
  APPROVED: "approved",
  RETURNED: "returned",
  LOCKED: "locked"
} as const;

export type GoalStatus = (typeof GOAL_STATUSES)[keyof typeof GOAL_STATUSES];

export const ALL_GOAL_STATUSES = [
  GOAL_STATUSES.DRAFT,
  GOAL_STATUSES.SUBMITTED,
  GOAL_STATUSES.APPROVED,
  GOAL_STATUSES.RETURNED,
  GOAL_STATUSES.LOCKED
] as const satisfies readonly GoalStatus[];

export const GOAL_STATUS_LABELS: Record<GoalStatus, string> = {
  [GOAL_STATUSES.DRAFT]: "Draft",
  [GOAL_STATUSES.SUBMITTED]: "Submitted",
  [GOAL_STATUSES.APPROVED]: "Approved",
  [GOAL_STATUSES.RETURNED]: "Returned",
  [GOAL_STATUSES.LOCKED]: "Locked"
};

export const EDITABLE_GOAL_STATUSES = [
  GOAL_STATUSES.DRAFT,
  GOAL_STATUSES.RETURNED
] as const satisfies readonly GoalStatus[];

export function isGoalLocked(status: GoalStatus) {
  return status === GOAL_STATUSES.APPROVED || status === GOAL_STATUSES.LOCKED;
}
