import {
  CHECKIN_PROGRESS_STATUSES,
  CHECKIN_WINDOWS
} from "@/lib/constants/checkin-windows";
import { GOAL_STATUSES, isGoalLocked } from "@/lib/constants/goal-status";
import { UOM_TYPES } from "@/lib/constants/uom-types";
import { mockCheckins } from "@/lib/data/mock-checkins";
import {
  mockGoals,
  mockQuarterlyUpdates
} from "@/lib/data/mock-goals";
import { mockDepartments, mockUsers } from "@/lib/data/mock-users";
import {
  getApprovedSharedGoalSheetGoalsForEmployee,
  getSharedGoalAchievement
} from "@/lib/services/shared-goal-service";
import type {
  EmployeeQuarterlyAchievement,
  ManagerCheckin,
  PlannedVsActualRow,
  SaveEmployeeAchievementsInput,
  TeamCheckinSummary
} from "@/lib/types/checkin";
import type { Goal } from "@/lib/types/goal";
import { getCurrentIsoTimestamp } from "@/lib/utils/dates";
import { calculateProgressScore } from "@/lib/utils/progress";
import {
  saveEmployeeAchievementsInputSchema,
  managerCheckinInputSchema,
  type ManagerCheckinInput
} from "@/lib/validations/checkin";
import {
  failure,
  success,
  type ServiceResult
} from "@/lib/services/service-result";

const demoEmployeeApprovedGoals: Goal[] = [
  {
    id: "checkin-goal-emma-approval-workflow",
    submissionId: "checkin-submission-emma-q2",
    employeeId: "demo-employee",
    cycleId: "cycle-fy26-q2",
    title: "Complete quarterly goal review milestone",
    description:
      "Finish the planned quarterly goal review activity before the target date.",
    thrustArea: "Product Delivery",
    uomType: UOM_TYPES.TIMELINE,
    targetValue: null,
    targetDate: "2026-06-20",
    weightage: 35,
    status: GOAL_STATUSES.APPROVED,
    lockedAt: "2026-04-12T14:00:00.000Z",
    sortOrder: 1,
    createdAt: "2026-04-01T00:00:00.000Z",
    updatedAt: "2026-04-12T14:00:00.000Z"
  },
  {
    id: "checkin-goal-emma-completion-clarity",
    submissionId: "checkin-submission-emma-q2",
    employeeId: "demo-employee",
    cycleId: "cycle-fy26-q2",
    title: "Improve goal completion clarity",
    description: "Increase task success rate in usability testing.",
    thrustArea: "Customer Experience",
    uomType: UOM_TYPES.PERCENTAGE_MIN,
    targetValue: 85,
    targetDate: null,
    weightage: 35,
    status: GOAL_STATUSES.APPROVED,
    lockedAt: "2026-04-12T14:00:00.000Z",
    sortOrder: 2,
    createdAt: "2026-04-01T00:00:00.000Z",
    updatedAt: "2026-04-12T14:00:00.000Z"
  },
  {
    id: "checkin-goal-emma-handoff-defects",
    submissionId: "checkin-submission-emma-q2",
    employeeId: "demo-employee",
    cycleId: "cycle-fy26-q2",
    title: "Reduce design handoff defects",
    description: "Lower defects found during implementation reviews.",
    thrustArea: "Operational Excellence",
    uomType: UOM_TYPES.NUMERIC_MAX,
    targetValue: 8,
    targetDate: null,
    weightage: 30,
    status: GOAL_STATUSES.APPROVED,
    lockedAt: "2026-04-12T14:00:00.000Z",
    sortOrder: 3,
    createdAt: "2026-04-01T00:00:00.000Z",
    updatedAt: "2026-04-12T14:00:00.000Z"
  }
];

function getDepartmentName(departmentId: string | null) {
  if (!departmentId) {
    return "Unassigned";
  }

  return (
    mockDepartments.find((department) => department.id === departmentId)?.name ??
    "Unassigned"
  );
}

function getProgressStatusFromScore(progressScore: number) {
  if (progressScore >= 100) {
    return CHECKIN_PROGRESS_STATUSES.COMPLETED;
  }

  if (progressScore >= 50) {
    return CHECKIN_PROGRESS_STATUSES.ON_TRACK;
  }

  return CHECKIN_PROGRESS_STATUSES.NOT_STARTED;
}

function getSeedAchievement(goal: Goal): EmployeeQuarterlyAchievement | null {
  if (goal.sharedGoalId) {
    return getSharedGoalAchievement(goal);
  }

  const seedUpdate = mockQuarterlyUpdates.find(
    (update) =>
      update.goalId === goal.id ||
      update.goalId.replace("goal-", "checkin-goal-") === goal.id
  );

  if (!seedUpdate) {
    return null;
  }

  return {
    id: `achievement-${seedUpdate.id}`,
    goalId: goal.id,
    employeeId: goal.employeeId,
    cycleId: goal.cycleId,
    checkinWindow: "q2",
    actualValue: seedUpdate.actualValue,
    completionDate: seedUpdate.completionDate,
    progressStatus: getProgressStatusFromScore(seedUpdate.progressScore),
    progressScore: seedUpdate.progressScore,
    createdAt: seedUpdate.createdAt,
    updatedAt: seedUpdate.updatedAt
  };
}

export function getApprovedGoalsForEmployeeCheckin(employeeId: string) {
  const approvedGoals = mockGoals
    .filter((goal) => goal.employeeId === employeeId && isGoalLocked(goal.status))
    .sort((firstGoal, secondGoal) => firstGoal.sortOrder - secondGoal.sortOrder);
  const approvedSharedGoals =
    getApprovedSharedGoalSheetGoalsForEmployee(employeeId);

  if (approvedGoals.length > 0) {
    return [...approvedGoals, ...approvedSharedGoals];
  }

  return employeeId === "demo-employee"
    ? [...demoEmployeeApprovedGoals, ...approvedSharedGoals]
    : approvedSharedGoals;
}

export function getEmployeeQuarterlyAchievements(
  employeeId: string,
  checkinWindow = "q2"
) {
  return getApprovedGoalsForEmployeeCheckin(employeeId)
    .map(getSeedAchievement)
    .filter(
      (achievement): achievement is EmployeeQuarterlyAchievement =>
        Boolean(achievement)
    )
    .filter((achievement) => achievement.checkinWindow === checkinWindow);
}

export function getPlannedVsActualRows(
  employeeId: string,
  checkinWindow = "q2"
): PlannedVsActualRow[] {
  const achievements = getEmployeeQuarterlyAchievements(employeeId, checkinWindow);

  return getApprovedGoalsForEmployeeCheckin(employeeId).map((goal) => ({
    goal,
    achievement:
      achievements.find((item) => item.goalId === goal.id) ??
      (checkinWindow === CHECKIN_WINDOWS.Q2 ? getSeedAchievement(goal) : null)
  }));
}

export function saveEmployeeQuarterlyAchievements(
  input: SaveEmployeeAchievementsInput
): ServiceResult<EmployeeQuarterlyAchievement[]> {
  const parsedInput = saveEmployeeAchievementsInputSchema.safeParse(input);

  if (!parsedInput.success) {
    return failure(
      "Quarterly achievement update failed validation.",
      parsedInput.error.issues.map((issue) => issue.message)
    );
  }

  const approvedGoals = getApprovedGoalsForEmployeeCheckin(
    parsedInput.data.employeeId
  );
  const now = getCurrentIsoTimestamp();

  const achievements = parsedInput.data.achievements.map((achievement) => {
    const goal = approvedGoals.find((item) => item.id === achievement.goalId);

    if (!goal) {
      throw new Error("Quarterly updates can only be saved for approved goals.");
    }

    if (goal.sharedGoalId && !goal.isSharedGoalPrimaryOwner) {
      const syncedAchievement = getSharedGoalAchievement(goal);

      if (syncedAchievement) {
        return {
          ...syncedAchievement,
          checkinWindow: parsedInput.data.checkinWindow
        };
      }
    }

    return {
      id: `local-achievement-${achievement.goalId}-${parsedInput.data.checkinWindow}`,
      goalId: achievement.goalId,
      employeeId: parsedInput.data.employeeId,
      cycleId: parsedInput.data.cycleId,
      checkinWindow: parsedInput.data.checkinWindow,
      actualValue: achievement.actualValue ?? null,
      completionDate: achievement.completionDate ?? null,
      progressStatus: achievement.progressStatus,
      progressScore: calculateProgressScore(
        goal,
        achievement.actualValue,
        achievement.completionDate
      ),
      createdAt: now,
      updatedAt: now
    };
  });

  return success(achievements);
}

export function getTeamCheckinSummaries(
  managerId: string,
  checkinWindow = "q2"
): TeamCheckinSummary[] {
  return mockUsers
    .filter((user) => user.managerId === managerId)
    .map<TeamCheckinSummary | null>((employee) => {
      const approvedGoals = getApprovedGoalsForEmployeeCheckin(employee.id);
      const achievements = getEmployeeQuarterlyAchievements(
        employee.id,
        checkinWindow
      );

      if (approvedGoals.length === 0 && achievements.length === 0) {
        return null;
      }

      return {
        employeeId: employee.id,
        employeeName: employee.name,
        departmentName: getDepartmentName(employee.departmentId),
        approvedGoalCount: approvedGoals.length,
        updatedGoalCount: achievements.length,
        managerCheckin:
          mockCheckins.find(
            (checkin) =>
              checkin.employeeId === employee.id &&
              checkin.managerId === managerId &&
              checkin.quarterLabel.toLowerCase().includes(checkinWindow)
          ) ?? null
      };
    })
    .filter((summary): summary is TeamCheckinSummary => Boolean(summary));
}

export function getCheckinsForManager(managerId: string, cycleId?: string) {
  return mockCheckins.filter(
    (checkin) =>
      checkin.managerId === managerId && (!cycleId || checkin.cycleId === cycleId)
  );
}

export function getCheckinsByEmployeeId(employeeId: string, cycleId?: string) {
  return mockCheckins.filter(
    (checkin) =>
      checkin.employeeId === employeeId && (!cycleId || checkin.cycleId === cycleId)
  );
}

export function saveManagerCheckin(
  input: ManagerCheckinInput
): ServiceResult<ManagerCheckin> {
  const parsedInput = managerCheckinInputSchema.safeParse(input);

  if (!parsedInput.success) {
    return failure(
      "Manager check-in failed validation.",
      parsedInput.error.issues.map((issue) => issue.message)
    );
  }

  const now = getCurrentIsoTimestamp();
  const existingCheckin = mockCheckins.find(
    (checkin) =>
      checkin.employeeId === parsedInput.data.employeeId &&
      checkin.managerId === parsedInput.data.managerId &&
      checkin.cycleId === parsedInput.data.cycleId
  );

  return success({
    id:
      existingCheckin?.id ??
      `local-checkin-${parsedInput.data.managerId}-${parsedInput.data.employeeId}`,
    employeeId: parsedInput.data.employeeId,
    managerId: parsedInput.data.managerId,
    cycleId: parsedInput.data.cycleId,
    quarterLabel: parsedInput.data.quarterLabel,
    comment: parsedInput.data.comment,
    createdAt: existingCheckin?.createdAt ?? now,
    updatedAt: now
  });
}
