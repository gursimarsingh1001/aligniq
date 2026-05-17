import { UOM_TYPES } from "@/lib/constants/uom-types";
import type {
  SharedGoal,
  SharedGoalAssignment
} from "@/lib/types/shared-goal";

const CREATED_AT = "2026-04-08T09:00:00.000Z";

export const mockSharedGoals: SharedGoal[] = [
  {
    id: "shared-goal-resolution-turnaround",
    title: "Improve customer resolution turnaround",
    description:
      "Reduce average customer issue resolution time for priority requests.",
    thrustArea: "Customer Experience",
    uomType: UOM_TYPES.NUMERIC_MAX,
    targetValue: 24,
    targetDate: null,
    primaryOwnerId: "demo-employee",
    createdById: "demo-manager",
    departmentId: "dept-product-engineering",
    assignedEmployeeIds: ["demo-employee", "employee-noah", "employee-lina"],
    status: "active",
    createdAt: CREATED_AT,
    updatedAt: "2026-04-09T12:00:00.000Z"
  },
  {
    id: "shared-goal-compliance-breaches",
    title: "Maintain zero critical compliance breaches",
    description:
      "Maintain zero critical compliance breaches across assigned operating areas.",
    thrustArea: "Operational Excellence",
    uomType: UOM_TYPES.ZERO_BASED,
    targetValue: 0,
    targetDate: null,
    primaryOwnerId: "employee-noah",
    createdById: "demo-admin",
    departmentId: "dept-product-engineering",
    assignedEmployeeIds: ["employee-noah", "employee-lina", "employee-owen"],
    status: "active",
    createdAt: "2026-04-10T09:00:00.000Z",
    updatedAt: "2026-04-10T11:45:00.000Z"
  }
];

export const mockSharedGoalAssignments: SharedGoalAssignment[] = [
  {
    id: "shared-assignment-resolution-emma",
    sharedGoalId: "shared-goal-resolution-turnaround",
    employeeId: "demo-employee",
    weightage: 10,
    isPrimaryOwner: true,
    linkedGoalId: "shared-linked-resolution-demo-employee",
    achievementValue: 22,
    completionDate: "2026-06-22",
    syncStatus: "synced",
    lastSyncedAt: "2026-06-28T10:30:00.000Z",
    createdAt: CREATED_AT,
    updatedAt: "2026-06-28T10:30:00.000Z"
  },
  {
    id: "shared-assignment-resolution-noah",
    sharedGoalId: "shared-goal-resolution-turnaround",
    employeeId: "employee-noah",
    weightage: 10,
    isPrimaryOwner: false,
    linkedGoalId: "shared-linked-resolution-employee-noah",
    achievementValue: 22,
    completionDate: "2026-06-22",
    syncStatus: "synced",
    lastSyncedAt: "2026-06-28T10:30:00.000Z",
    createdAt: CREATED_AT,
    updatedAt: "2026-06-28T10:30:00.000Z"
  },
  {
    id: "shared-assignment-resolution-lina",
    sharedGoalId: "shared-goal-resolution-turnaround",
    employeeId: "employee-lina",
    weightage: 10,
    isPrimaryOwner: false,
    linkedGoalId: "shared-linked-resolution-employee-lina",
    achievementValue: 22,
    completionDate: "2026-06-22",
    syncStatus: "synced",
    lastSyncedAt: "2026-06-28T10:30:00.000Z",
    createdAt: CREATED_AT,
    updatedAt: "2026-06-28T10:30:00.000Z"
  },
  {
    id: "shared-assignment-compliance-noah",
    sharedGoalId: "shared-goal-compliance-breaches",
    employeeId: "employee-noah",
    weightage: 15,
    isPrimaryOwner: true,
    linkedGoalId: "shared-linked-compliance-employee-noah",
    achievementValue: 0,
    completionDate: "2026-06-29",
    syncStatus: "synced",
    lastSyncedAt: "2026-06-29T09:30:00.000Z",
    createdAt: "2026-04-10T09:00:00.000Z",
    updatedAt: "2026-06-29T09:30:00.000Z"
  },
  {
    id: "shared-assignment-compliance-lina",
    sharedGoalId: "shared-goal-compliance-breaches",
    employeeId: "employee-lina",
    weightage: 15,
    isPrimaryOwner: false,
    linkedGoalId: "shared-linked-compliance-employee-lina",
    achievementValue: 0,
    completionDate: "2026-06-29",
    syncStatus: "synced",
    lastSyncedAt: "2026-06-29T09:30:00.000Z",
    createdAt: "2026-04-10T09:00:00.000Z",
    updatedAt: "2026-06-29T09:30:00.000Z"
  },
  {
    id: "shared-assignment-compliance-owen",
    sharedGoalId: "shared-goal-compliance-breaches",
    employeeId: "employee-owen",
    weightage: 15,
    isPrimaryOwner: false,
    linkedGoalId: "shared-linked-compliance-employee-owen",
    achievementValue: 0,
    completionDate: "2026-06-29",
    syncStatus: "synced",
    lastSyncedAt: "2026-06-29T09:30:00.000Z",
    createdAt: "2026-04-10T09:00:00.000Z",
    updatedAt: "2026-06-29T09:30:00.000Z"
  }
];
