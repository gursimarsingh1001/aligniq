import type { ThrustArea } from "@/lib/constants/thrust-areas";
import type { UomType } from "@/lib/constants/uom-types";

export type SharedGoalStatus = "draft" | "active" | "completed" | "archived";

export type SharedGoalSyncStatus = "synced" | "pending" | "conflict";

export type SharedGoal = {
  id: string;
  title: string;
  description: string;
  thrustArea: ThrustArea;
  uomType: UomType;
  targetValue: number | null;
  targetDate: string | null;
  primaryOwnerId: string;
  createdById: string;
  departmentId: string;
  assignedEmployeeIds: string[];
  status: SharedGoalStatus;
  createdAt: string;
  updatedAt: string;
};

export type SharedGoalAssignment = {
  id: string;
  sharedGoalId: string;
  employeeId: string;
  weightage: number;
  isPrimaryOwner: boolean;
  linkedGoalId: string;
  achievementValue: number | null;
  completionDate: string | null;
  syncStatus: SharedGoalSyncStatus;
  lastSyncedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SharedGoalWithAssignments = SharedGoal & {
  assignments: SharedGoalAssignment[];
};

export type SharedGoalCreateInput = {
  title: string;
  description: string;
  departmentId: string;
  thrustArea: ThrustArea;
  uomType: UomType;
  targetValue: number | null;
  targetDate: string | null;
  primaryOwnerId: string;
  assignedEmployeeIds: string[];
};

export type SharedGoalPrimaryOwnerUpdate = {
  actualValue: number | null;
  completionDate: string | null;
};
