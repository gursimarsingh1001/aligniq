import { GOAL_STATUSES, type GoalStatus } from "@/lib/constants/goal-status";
import { CHECKIN_PROGRESS_STATUSES } from "@/lib/constants/checkin-windows";
import {
  mockSharedGoalAssignments,
  mockSharedGoals
} from "@/lib/data/mock-shared-goals";
import { mockDepartments, mockUsers } from "@/lib/data/mock-users";
import {
  failure,
  success,
  type ServiceResult
} from "@/lib/services/service-result";
import type { AuditLog } from "@/lib/types/audit";
import type { EmployeeQuarterlyAchievement } from "@/lib/types/checkin";
import type { Goal, QuarterlyUpdate } from "@/lib/types/goal";
import type {
  SharedGoal,
  SharedGoalAssignment,
  SharedGoalCreateInput,
  SharedGoalPrimaryOwnerUpdate,
  SharedGoalWithAssignments
} from "@/lib/types/shared-goal";
import { getCurrentIsoTimestamp } from "@/lib/utils/dates";
import { calculateProgressScore } from "@/lib/utils/progress";
import {
  sharedGoalInputSchema,
  sharedGoalWeightageSchema
} from "@/lib/validations/shared-goal";

type SharedGoalMutationResult = {
  auditLog: AuditLog;
  sharedGoal: SharedGoalWithAssignments;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getAssignments(sharedGoalId: string) {
  return mockSharedGoalAssignments.filter(
    (assignment) => assignment.sharedGoalId === sharedGoalId
  );
}

function withAssignments(sharedGoal: SharedGoal): SharedGoalWithAssignments {
  return {
    ...sharedGoal,
    assignments: getAssignments(sharedGoal.id)
  };
}

function getEmployee(employeeId: string) {
  return mockUsers.find((user) => user.id === employeeId) ?? null;
}

function getDepartmentName(departmentId: string) {
  return (
    mockDepartments.find((department) => department.id === departmentId)?.name ??
    "Unassigned"
  );
}

function getProgressStatus(progressScore: number) {
  if (progressScore >= 100) {
    return CHECKIN_PROGRESS_STATUSES.COMPLETED;
  }

  if (progressScore >= 50) {
    return CHECKIN_PROGRESS_STATUSES.ON_TRACK;
  }

  return CHECKIN_PROGRESS_STATUSES.NOT_STARTED;
}

function toSharedGoalSheetGoal(
  sharedGoal: SharedGoal,
  assignment: SharedGoalAssignment,
  status: GoalStatus = GOAL_STATUSES.DRAFT
): Goal {
  return {
    id: assignment.linkedGoalId,
    submissionId: `shared-submission-${assignment.employeeId}`,
    employeeId: assignment.employeeId,
    cycleId: "cycle-fy26-q2",
    title: sharedGoal.title,
    description: sharedGoal.description,
    thrustArea: sharedGoal.thrustArea,
    uomType: sharedGoal.uomType,
    targetValue: sharedGoal.targetValue,
    targetDate: sharedGoal.targetDate,
    weightage: assignment.weightage,
    status,
    lockedAt: status === GOAL_STATUSES.APPROVED ? sharedGoal.updatedAt : null,
    sortOrder: 100 + mockSharedGoalAssignments.indexOf(assignment),
    createdAt: assignment.createdAt,
    updatedAt: assignment.updatedAt,
    sourceType: "shared",
    sharedGoalId: sharedGoal.id,
    sharedGoalAssignmentId: assignment.id,
    isSharedGoalPrimaryOwner: assignment.isPrimaryOwner,
    sharedGoalSyncStatus: assignment.syncStatus
  };
}

function createAuditLog({
  action,
  actorId,
  details,
  entityId,
  newValue,
  oldValue,
  summary
}: {
  action: AuditLog["action"];
  actorId: string;
  details: string;
  entityId: string;
  newValue?: string;
  oldValue?: string;
  summary: string;
}): AuditLog {
  return {
    id: `audit-${entityId}-${action}-${Date.now()}`,
    actorId,
    entityType: "shared_goal",
    entityId,
    action,
    summary,
    metadata: {
      details,
      newValue,
      oldValue
    },
    createdAt: getCurrentIsoTimestamp()
  };
}

export function getSharedGoalsForAdmin() {
  return mockSharedGoals.map(withAssignments);
}

export function getSharedGoalsForManager(managerId: string) {
  const directReportIds = mockUsers
    .filter((user) => user.managerId === managerId)
    .map((user) => user.id);

  return mockSharedGoals
    .filter(
      (sharedGoal) =>
        sharedGoal.createdById === managerId ||
        sharedGoal.primaryOwnerId === managerId ||
        sharedGoal.assignedEmployeeIds.some((employeeId) =>
          directReportIds.includes(employeeId)
        )
    )
    .map(withAssignments);
}

export function getSharedGoalsForEmployee(employeeId: string) {
  return mockSharedGoals
    .filter(
      (sharedGoal) =>
        sharedGoal.status === "active" &&
        sharedGoal.assignedEmployeeIds.includes(employeeId)
    )
    .map(withAssignments);
}

export function getSharedGoalSheetGoalsForEmployee(employeeId: string) {
  return getSharedGoalsForEmployee(employeeId).flatMap((sharedGoal) =>
    sharedGoal.assignments
      .filter((assignment) => assignment.employeeId === employeeId)
      .map((assignment) =>
        toSharedGoalSheetGoal(sharedGoal, assignment, GOAL_STATUSES.DRAFT)
      )
  );
}

export function getApprovedSharedGoalSheetGoalsForEmployee(employeeId: string) {
  return getSharedGoalsForEmployee(employeeId).flatMap((sharedGoal) =>
    sharedGoal.assignments
      .filter((assignment) => assignment.employeeId === employeeId)
      .map((assignment) =>
        toSharedGoalSheetGoal(sharedGoal, assignment, GOAL_STATUSES.APPROVED)
      )
  );
}

export function getReportSharedGoalSheetGoals() {
  return mockSharedGoals
    .filter((sharedGoal) => sharedGoal.status === "active")
    .flatMap((sharedGoal) =>
      getAssignments(sharedGoal.id).map((assignment) =>
        toSharedGoalSheetGoal(sharedGoal, assignment, GOAL_STATUSES.APPROVED)
      )
    );
}

export function getSharedGoalAssignmentByLinkedGoalId(linkedGoalId: string) {
  return mockSharedGoalAssignments.find(
    (assignment) => assignment.linkedGoalId === linkedGoalId
  ) ?? null;
}

export function getSharedGoalById(sharedGoalId: string) {
  return mockSharedGoals.find((sharedGoal) => sharedGoal.id === sharedGoalId) ?? null;
}

export function getSharedGoalQuarterlyUpdate(goal: Goal): QuarterlyUpdate | null {
  if (!goal.sharedGoalId) {
    return null;
  }

  const assignment = getSharedGoalAssignmentByLinkedGoalId(goal.id);

  if (!assignment || assignment.achievementValue === null) {
    return null;
  }

  const progressScore = calculateProgressScore(
    goal,
    assignment.achievementValue,
    assignment.completionDate
  );

  return {
    id: `shared-update-${assignment.id}`,
    goalId: goal.id,
    employeeId: goal.employeeId,
    cycleId: goal.cycleId,
    actualValue: assignment.achievementValue,
    completionDate: assignment.completionDate,
    progressScore,
    employeeComment: assignment.isPrimaryOwner
      ? "Primary owner achievement captured for linked shared goal."
      : "Achievement synced from the primary owner.",
    createdAt: assignment.createdAt,
    updatedAt: assignment.updatedAt
  };
}

export function getSharedGoalAchievement(goal: Goal): EmployeeQuarterlyAchievement | null {
  const update = getSharedGoalQuarterlyUpdate(goal);

  if (!update) {
    return null;
  }

  return {
    id: `achievement-${update.id}`,
    goalId: goal.id,
    employeeId: goal.employeeId,
    cycleId: goal.cycleId,
    checkinWindow: "q2",
    actualValue: update.actualValue,
    completionDate: update.completionDate,
    progressStatus: getProgressStatus(update.progressScore),
    progressScore: update.progressScore,
    createdAt: update.createdAt,
    updatedAt: update.updatedAt
  };
}

export function createSharedGoal(
  input: SharedGoalCreateInput,
  createdById: string
): ServiceResult<SharedGoalMutationResult> {
  const parsedInput = sharedGoalInputSchema.safeParse(input);

  if (!parsedInput.success) {
    return failure(
      "Shared goal failed validation.",
      parsedInput.error.issues.map((issue) => issue.message)
    );
  }

  const now = getCurrentIsoTimestamp();
  const id = `shared-goal-${slugify(parsedInput.data.title)}-${Date.now()}`;
  const sharedGoal: SharedGoal = {
    ...parsedInput.data,
    id,
    createdById,
    targetValue: parsedInput.data.targetValue ?? null,
    targetDate: parsedInput.data.targetDate ?? null,
    status: "draft",
    createdAt: now,
    updatedAt: now
  };
  const assignments: SharedGoalAssignment[] = parsedInput.data.assignedEmployeeIds.map(
    (employeeId) => ({
      id: `shared-assignment-${id}-${employeeId}`,
      sharedGoalId: id,
      employeeId,
      weightage: 10,
      isPrimaryOwner: employeeId === parsedInput.data.primaryOwnerId,
      linkedGoalId: `shared-linked-${id}-${employeeId}`,
      achievementValue: null,
      completionDate: null,
      syncStatus: employeeId === parsedInput.data.primaryOwnerId ? "pending" : "pending",
      lastSyncedAt: null,
      createdAt: now,
      updatedAt: now
    })
  );
  const goalWithAssignments = {
    ...sharedGoal,
    assignments
  };

  return success({
    sharedGoal: goalWithAssignments,
    auditLog: createAuditLog({
      action: "created",
      actorId: createdById,
      details: `Shared goal created for ${getDepartmentName(sharedGoal.departmentId)}.`,
      entityId: sharedGoal.id,
      newValue: "Draft",
      summary: `Shared goal "${sharedGoal.title}" was created.`
    })
  });
}

export function activateSharedGoal(
  sharedGoal: SharedGoalWithAssignments,
  actorId: string
): ServiceResult<SharedGoalMutationResult> {
  const activatedGoal: SharedGoalWithAssignments = {
    ...sharedGoal,
    status: "active",
    updatedAt: getCurrentIsoTimestamp()
  };

  return success({
    sharedGoal: activatedGoal,
    auditLog: createAuditLog({
      action: "pushed",
      actorId,
      details: `Shared goal pushed to ${sharedGoal.assignments.length} linked employee goal sheet(s).`,
      entityId: sharedGoal.id,
      newValue: "Active",
      oldValue: sharedGoal.status,
      summary: `Shared goal "${sharedGoal.title}" was pushed to linked employees.`
    })
  });
}

export function updateSharedGoalWeightage(
  sharedGoal: SharedGoalWithAssignments,
  employeeId: string,
  weightage: number,
  actorId: string
): ServiceResult<SharedGoalMutationResult> {
  const parsedInput = sharedGoalWeightageSchema.safeParse({
    sharedGoalId: sharedGoal.id,
    employeeId,
    weightage
  });

  if (!parsedInput.success) {
    return failure(
      "Shared goal weightage failed validation.",
      parsedInput.error.issues.map((issue) => issue.message)
    );
  }

  const employee = getEmployee(employeeId);
  const currentAssignment = sharedGoal.assignments.find(
    (assignment) => assignment.employeeId === employeeId
  );
  const updatedSharedGoal = {
    ...sharedGoal,
    assignments: sharedGoal.assignments.map((assignment) =>
      assignment.employeeId === employeeId
        ? {
            ...assignment,
            weightage,
            updatedAt: getCurrentIsoTimestamp()
          }
        : assignment
    )
  };

  return success({
    sharedGoal: updatedSharedGoal,
    auditLog: createAuditLog({
      action: "updated",
      actorId,
      details: `${employee?.name ?? "Employee"} adjusted shared goal weightage.`,
      entityId: sharedGoal.id,
      newValue: `${weightage}%`,
      oldValue: currentAssignment ? `${currentAssignment.weightage}%` : undefined,
      summary: `Shared goal weightage was updated for ${employee?.name ?? employeeId}.`
    })
  });
}

export function assignSharedGoal(
  sharedGoal: SharedGoalWithAssignments,
  employeeIds: string[],
  actorId: string
): ServiceResult<SharedGoalMutationResult> {
  const now = getCurrentIsoTimestamp();
  const existingEmployeeIds = new Set(
    sharedGoal.assignments.map((assignment) => assignment.employeeId)
  );
  const nextEmployeeIds = Array.from(new Set(employeeIds));
  const addedAssignments = nextEmployeeIds
    .filter((employeeId) => !existingEmployeeIds.has(employeeId))
    .map<SharedGoalAssignment>((employeeId) => ({
      id: `shared-assignment-${sharedGoal.id}-${employeeId}`,
      sharedGoalId: sharedGoal.id,
      employeeId,
      weightage: 10,
      isPrimaryOwner: employeeId === sharedGoal.primaryOwnerId,
      linkedGoalId: `shared-linked-${sharedGoal.id}-${employeeId}`,
      achievementValue: null,
      completionDate: null,
      syncStatus: "pending",
      lastSyncedAt: null,
      createdAt: now,
      updatedAt: now
    }));
  const updatedSharedGoal = {
    ...sharedGoal,
    assignedEmployeeIds: nextEmployeeIds,
    assignments: [
      ...sharedGoal.assignments.filter((assignment) =>
        nextEmployeeIds.includes(assignment.employeeId)
      ),
      ...addedAssignments
    ],
    updatedAt: now
  };

  return success({
    sharedGoal: updatedSharedGoal,
    auditLog: createAuditLog({
      action: "assigned",
      actorId,
      details: `Shared goal assignment updated for ${nextEmployeeIds.length} employee(s).`,
      entityId: sharedGoal.id,
      newValue: `${nextEmployeeIds.length} employee(s)`,
      summary: `Shared goal "${sharedGoal.title}" assignment was updated.`
    })
  });
}

export function syncSharedGoalAchievement(
  sharedGoal: SharedGoalWithAssignments,
  primaryOwnerUpdate: SharedGoalPrimaryOwnerUpdate,
  actorId: string
): ServiceResult<SharedGoalMutationResult> {
  const now = getCurrentIsoTimestamp();
  const updatedSharedGoal = {
    ...sharedGoal,
    assignments: sharedGoal.assignments.map((assignment) => ({
      ...assignment,
      achievementValue: primaryOwnerUpdate.actualValue,
      completionDate: primaryOwnerUpdate.completionDate,
      syncStatus: "synced" as const,
      lastSyncedAt: now,
      updatedAt: now
    })),
    updatedAt: now
  };

  return success({
    sharedGoal: updatedSharedGoal,
    auditLog: createAuditLog({
      action: "synced",
      actorId,
      details: "Primary owner achievement synced to linked shared goal sheets.",
      entityId: sharedGoal.id,
      newValue: "Synced",
      summary: `Shared goal "${sharedGoal.title}" achievement was synced.`
    })
  });
}
