import type { GoalStatus } from "@/lib/constants/goal-status";
import type { ThrustArea } from "@/lib/constants/thrust-areas";
import type { UomType } from "@/lib/constants/uom-types";
import type { SharedGoalSyncStatus } from "@/lib/types/shared-goal";

export type GoalCycleStatus = "draft" | "active" | "closed" | "archived";

export type GoalCycle = {
  id: string;
  name: string;
  startsOn: string;
  endsOn: string;
  submissionDeadline: string;
  checkinStartsOn: string;
  checkinEndsOn: string;
  status: GoalCycleStatus;
  createdAt: string;
  updatedAt: string;
};

export type GoalSubmission = {
  id: string;
  employeeId: string;
  managerId: string;
  cycleId: string;
  status: GoalStatus;
  submittedAt: string | null;
  reviewedAt: string | null;
  reviewedBy: string | null;
  managerComment: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Goal = {
  id: string;
  submissionId: string;
  employeeId: string;
  cycleId: string;
  title: string;
  description: string | null;
  thrustArea: ThrustArea;
  uomType: UomType;
  targetValue: number | null;
  targetDate: string | null;
  weightage: number;
  status: GoalStatus;
  lockedAt: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  sourceType?: "individual" | "shared";
  sharedGoalId?: string | null;
  sharedGoalAssignmentId?: string | null;
  isSharedGoalPrimaryOwner?: boolean;
  sharedGoalSyncStatus?: SharedGoalSyncStatus | null;
};

export type GoalSubmissionWithGoals = GoalSubmission & {
  goals: Goal[];
};

export type QuarterlyUpdate = {
  id: string;
  goalId: string;
  employeeId: string;
  cycleId: string;
  actualValue: number | null;
  completionDate: string | null;
  progressScore: number;
  employeeComment: string | null;
  createdAt: string;
  updatedAt: string;
};

export type GoalWithQuarterlyUpdate = Goal & {
  quarterlyUpdate: QuarterlyUpdate | null;
};
