import {
  CHECKIN_PROGRESS_STATUSES,
  CHECKIN_WINDOW_LABELS,
  CHECKIN_WINDOWS,
  type CheckinProgressStatus
} from "@/lib/constants/checkin-windows";
import { GOAL_STATUSES } from "@/lib/constants/goal-status";
import { ROLES } from "@/lib/constants/roles";
import {
  mockGoals,
  mockGoalCycles,
  mockGoalSubmissions,
  mockQuarterlyUpdates
} from "@/lib/data/mock-goals";
import { mockCheckins } from "@/lib/data/mock-checkins";
import { mockDepartments, mockUsers } from "@/lib/data/mock-users";
import { UOM_TYPES } from "@/lib/constants/uom-types";
import {
  getReportSharedGoalSheetGoals,
  getSharedGoalQuarterlyUpdate
} from "@/lib/services/shared-goal-service";
import type { Goal, GoalSubmission, QuarterlyUpdate } from "@/lib/types/goal";
import type {
  AchievementReportRow,
  AdminDashboardSummary,
  CycleTimelineItem,
  GoalSummaryReportRow
} from "@/lib/types/report";
import { rowsToCsv } from "@/lib/utils/csv";
import {
  CYCLE_WINDOW_DETAILS,
  CYCLE_WINDOW_ORDER,
  DEFAULT_ACTIVE_CYCLE_WINDOW,
  getCycleWindowStatus,
  type CycleWindow
} from "@/lib/utils/cycle-windows";
import {
  formatDate,
  formatNumber,
  formatTargetDisplay,
  formatUomLabel
} from "@/lib/utils/formatters";
import { calculateWeightedScore } from "@/lib/utils/progress";

export type AchievementReportFilters = {
  cycleId?: string;
  managerId?: string;
  departmentId?: string;
  quarterLabel?: string;
};

const REPORT_QUARTER_LABEL = CHECKIN_WINDOW_LABELS[CHECKIN_WINDOWS.Q2];

function getEmployees() {
  return mockUsers.filter(
    (user) => user.role === ROLES.EMPLOYEE && user.isActive
  );
}

function getUserName(userId: string) {
  return mockUsers.find((user) => user.id === userId)?.name ?? "Unknown";
}

function getDepartmentName(departmentId: string | null) {
  if (!departmentId) {
    return "Unassigned";
  }

  return (
    mockDepartments.find((department) => department.id === departmentId)?.name ??
    "Unassigned"
  );
}

function getReportSubmissions(): GoalSubmission[] {
  return mockGoalSubmissions.map((submission) => {
    if (submission.employeeId !== "demo-employee") {
      return submission;
    }

    return {
      ...submission,
      status: GOAL_STATUSES.APPROVED,
      submittedAt: "2026-04-10T09:30:00.000Z",
      reviewedAt: "2026-04-12T14:00:00.000Z",
      reviewedBy: "demo-manager",
      managerComment: "Approved for Q2 tracking."
    };
  });
}

function getReportGoals(): Goal[] {
  const individualGoals = mockGoals.map((goal) => {
    if (goal.employeeId !== "demo-employee") {
      return goal;
    }

    return {
      ...goal,
      status: GOAL_STATUSES.APPROVED,
      lockedAt: "2026-04-12T14:00:00.000Z"
    };
  });

  return [...individualGoals, ...getReportSharedGoalSheetGoals()];
}

function getCheckinProgressStatus(
  update: QuarterlyUpdate | null
): CheckinProgressStatus | "pending" {
  if (!update) {
    return "pending";
  }

  if (update.progressScore >= 100) {
    return CHECKIN_PROGRESS_STATUSES.COMPLETED;
  }

  if (update.progressScore >= 50) {
    return CHECKIN_PROGRESS_STATUSES.ON_TRACK;
  }

  return CHECKIN_PROGRESS_STATUSES.NOT_STARTED;
}

function getCompletionStatus(update: QuarterlyUpdate | null) {
  return update ? "completed" : "pending";
}

function formatPlannedTarget(goal: Goal) {
  return formatTargetDisplay(goal);
}

function formatActualAchievement(goal: Goal, update: QuarterlyUpdate | null) {
  if (!update) {
    return "-";
  }

  return goal.uomType === UOM_TYPES.TIMELINE
    ? formatDate(update.completionDate)
    : formatNumber(update.actualValue);
}

function countUnique(values: string[]) {
  return new Set(values).size;
}

function getActiveCycleId() {
  return mockGoalCycles.find((cycle) => cycle.status === "active")?.id;
}

function getSubmissionCompletionCount(submissions: GoalSubmission[]) {
  return countUnique(
    submissions
      .filter((submission) => submission.status !== GOAL_STATUSES.DRAFT)
      .map((submission) => submission.employeeId)
  );
}

function getApprovalCompletionCount(submissions: GoalSubmission[]) {
  return submissions.filter(
    (submission) =>
      submission.status === GOAL_STATUSES.APPROVED ||
      submission.status === GOAL_STATUSES.RETURNED
  ).length;
}

function getApprovedGoalEmployeeIds(goals: Goal[]) {
  return Array.from(
    new Set(
      goals
        .filter((goal) => goal.status === GOAL_STATUSES.APPROVED)
        .map((goal) => goal.employeeId)
    )
  );
}

export function getAchievementReportRows(
  filters: AchievementReportFilters = {}
): AchievementReportRow[] {
  return getReportGoals()
    .filter((goal) => !filters.cycleId || goal.cycleId === filters.cycleId)
    .flatMap<AchievementReportRow>((goal) => {
      const employee = mockUsers.find((user) => user.id === goal.employeeId);
      const cycle = mockGoalCycles.find((item) => item.id === goal.cycleId);
      const update =
        mockQuarterlyUpdates.find((item) => item.goalId === goal.id) ??
        getSharedGoalQuarterlyUpdate(goal);

      if (!employee || !cycle) {
        return [];
      }

      if (filters.managerId && employee.managerId !== filters.managerId) {
        return [];
      }

      if (filters.departmentId && employee.departmentId !== filters.departmentId) {
        return [];
      }

      if (filters.quarterLabel && filters.quarterLabel !== REPORT_QUARTER_LABEL) {
        return [];
      }

      const progressScore = update?.progressScore ?? 0;

      return [{
        employeeId: employee.id,
        employeeName: employee.name,
        managerId: employee.managerId ?? "",
        managerName: employee.managerId
          ? getUserName(employee.managerId)
          : "Unassigned",
        departmentName: getDepartmentName(employee.departmentId),
        cycleName: cycle.name,
        quarterLabel: REPORT_QUARTER_LABEL,
        goalId: goal.id,
        goalTitle: goal.title,
        goalType: goal.sharedGoalId ? "Shared" : "Individual",
        sharedGoalId: goal.sharedGoalId ?? null,
        thrustArea: goal.thrustArea,
        uomType: goal.uomType,
        plannedTarget: formatPlannedTarget(goal),
        actualAchievement: formatActualAchievement(goal, update),
        targetValue: goal.targetValue,
        targetDate: goal.targetDate,
        actualValue: update?.actualValue ?? null,
        completionDate: update?.completionDate ?? null,
        weightage: goal.weightage,
        progressScore,
        weightedScore: calculateWeightedScore(progressScore, goal.weightage),
        goalStatus: goal.status,
        employeeStatus: getCheckinProgressStatus(update),
        checkinCompletionStatus: getCompletionStatus(update)
      }];
    });
}

export function getGoalSummaryReportRows(
  filters: AchievementReportFilters = {}
): GoalSummaryReportRow[] {
  const rowsByEmployee = new Map<string, AchievementReportRow[]>();

  for (const row of getAchievementReportRows(filters)) {
    rowsByEmployee.set(row.employeeId, [
      ...(rowsByEmployee.get(row.employeeId) ?? []),
      row
    ]);
  }

  return Array.from(rowsByEmployee.values()).map((rows) => {
    const firstRow = rows[0];
    const totalWeightage = rows.reduce((total, row) => total + row.weightage, 0);
    const progressTotal = rows.reduce(
      (total, row) => total + row.progressScore,
      0
    );
    const weightedAchievementScore = rows.reduce(
      (total, row) => total + row.weightedScore,
      0
    );

    return {
      employeeId: firstRow.employeeId,
      employeeName: firstRow.employeeName,
      cycleName: firstRow.cycleName,
      goalCount: rows.length,
      totalWeightage,
      averageProgressScore: Number((progressTotal / rows.length).toFixed(2)),
      weightedAchievementScore: Number(weightedAchievementScore.toFixed(2))
    };
  });
}

export function getAdminDashboardSummary(): AdminDashboardSummary {
  const employees = getEmployees();
  const submissions = getReportSubmissions();
  const goals = getReportGoals();
  const activeCycleId = getActiveCycleId();
  const activeCycleUpdates = mockQuarterlyUpdates.filter(
    (update) => !activeCycleId || update.cycleId === activeCycleId
  );
  const activeCycleCheckins = mockCheckins.filter(
    (checkin) => !activeCycleId || checkin.cycleId === activeCycleId
  );
  const submittedEmployees = getSubmissionCompletionCount(submissions);
  const reviewableSubmissions = submissions.filter(
    (submission) => submission.status !== GOAL_STATUSES.DRAFT
  );
  const approvedSubmissions = submissions.filter(
    (submission) => submission.status === GOAL_STATUSES.APPROVED
  );
  const pendingApprovals = submissions.filter(
    (submission) => submission.status === GOAL_STATUSES.SUBMITTED
  );
  const employeesWithUpdates = countUnique(
    activeCycleUpdates.map((update) => update.employeeId)
  );
  const employeesWithManagerCheckins = countUnique(
    activeCycleCheckins.map((checkin) => checkin.employeeId)
  );

  return {
    metrics: {
      totalEmployees: {
        label: "Total employees",
        value: employees.length,
        helperText: "Active employees in the organization."
      },
      goalsSubmitted: {
        label: "Goals submitted",
        value: submittedEmployees,
        helperText: "Employees with submitted, returned, or approved goals."
      },
      goalsApproved: {
        label: "Goals approved",
        value: approvedSubmissions.length,
        helperText: "Goal submissions approved for quarterly tracking."
      },
      pendingManagerApprovals: {
        label: "Pending manager approvals",
        value: pendingApprovals.length,
        helperText: "Submitted goal sets still waiting for review."
      },
      quarterlyUpdatesCompleted: {
        label: "Quarterly updates completed",
        value: employeesWithUpdates,
        helperText: "Employees with at least one Q2 achievement update."
      },
      managerCheckinsCompleted: {
        label: "Manager check-ins completed",
        value: employeesWithManagerCheckins,
        helperText: "Employees with a saved manager check-in comment."
      }
    },
    completion: [
      {
        label: "Employee goal submission completion",
        completed: submittedEmployees,
        total: employees.length,
        pending: Math.max(employees.length - submittedEmployees, 0),
        helperText: "Employees who have moved goals beyond draft."
      },
      {
        label: "Manager approval completion",
        completed: getApprovalCompletionCount(reviewableSubmissions),
        total: reviewableSubmissions.length,
        pending: pendingApprovals.length,
        helperText: "Submitted goal sets that have been approved or returned."
      },
      {
        label: "Quarterly check-in completion",
        completed: employeesWithUpdates,
        total: employees.length,
        pending: Math.max(employees.length - employeesWithUpdates, 0),
        helperText: "Employees with actual achievement updates recorded."
      },
      {
        label: "Manager check-in completion",
        completed: employeesWithManagerCheckins,
        total: employees.length,
        pending: Math.max(employees.length - employeesWithManagerCheckins, 0),
        helperText: "Employees with manager discussion comments saved."
      }
    ],
    exceptions: [
      `${pendingApprovals.length} submitted goal set requires manager approval.`,
      `${Math.max(employees.length - employeesWithUpdates, 0)} employees still need quarterly achievement updates.`,
      `${Math.max(employees.length - employeesWithManagerCheckins, 0)} employees still need manager check-in comments.`,
      `${getApprovedGoalEmployeeIds(goals).length} employees currently have approved goals for tracking.`
    ]
  };
}

export function getCycleTimelineItems(
  activeWindow: CycleWindow = DEFAULT_ACTIVE_CYCLE_WINDOW
): CycleTimelineItem[] {
  return CYCLE_WINDOW_ORDER.map((window) => ({
    id: window,
    title: CYCLE_WINDOW_DETAILS[window].label,
    windowLabel: CYCLE_WINDOW_DETAILS[window].windowLabel,
    description: CYCLE_WINDOW_DETAILS[window].description,
    status: getCycleWindowStatus(window, activeWindow)
  }));
}

export function exportReportToCsv(rows = getAchievementReportRows()) {
  return rowsToCsv(
    rows.map((row) => ({
      "Employee Name": row.employeeName,
      Department: row.departmentName,
      "Manager Name": row.managerName,
      "Goal Title": row.goalTitle,
      "Goal Type": row.goalType ?? "Individual",
      "Thrust Area": row.thrustArea,
      Measurement: formatUomLabel(row.uomType),
      "Planned Target": row.plannedTarget,
      "Actual Achievement": row.actualAchievement,
      Quarter: row.quarterLabel,
      "Employee Status": row.employeeStatus,
      "Progress Score": row.progressScore,
      "Check-in Completion Status": row.checkinCompletionStatus,
      "Goal Status": row.goalStatus
    }))
  );
}
