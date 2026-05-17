export const APPROVAL_STATUSES = {
  PENDING: "pending",
  APPROVED: "approved",
  RETURNED: "returned"
} as const;

export type ApprovalStatus =
  (typeof APPROVAL_STATUSES)[keyof typeof APPROVAL_STATUSES];

export const ALL_APPROVAL_STATUSES = [
  APPROVAL_STATUSES.PENDING,
  APPROVAL_STATUSES.APPROVED,
  APPROVAL_STATUSES.RETURNED
] as const satisfies readonly ApprovalStatus[];

export const APPROVAL_STATUS_LABELS: Record<ApprovalStatus, string> = {
  [APPROVAL_STATUSES.PENDING]: "Pending approval",
  [APPROVAL_STATUSES.APPROVED]: "Approved",
  [APPROVAL_STATUSES.RETURNED]: "Returned for rework"
};
