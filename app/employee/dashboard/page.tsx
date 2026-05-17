import { EmployeeDashboard } from "@/components/employee/EmployeeDashboard";
import { AppShell } from "@/components/layout/AppShell";
import { GOAL_STATUSES } from "@/lib/constants/goal-status";
import { ROUTES } from "@/lib/constants/routes";
import { CHECKIN_WINDOWS } from "@/lib/constants/checkin-windows";
import { mockDepartments, mockUsers } from "@/lib/data/mock-users";
import {
  getActiveGoalCycle,
  getGoalSubmissionByEmployeeId
} from "@/lib/services/goal-service";
import {
  getCheckinsByEmployeeId,
  getPlannedVsActualRows
} from "@/lib/services/checkin-service";
import type { Goal } from "@/lib/types/goal";
import {
  formatDate,
  formatPercent,
  formatTargetDisplay
} from "@/lib/utils/formatters";
import { getDisplayProgressScore } from "@/lib/utils/progress";

const EMPLOYEE_ID = "demo-employee";

function getDepartmentName(departmentId: string | null | undefined) {
  if (!departmentId) {
    return "Unassigned";
  }

  return (
    mockDepartments.find((department) => department.id === departmentId)?.name ??
    "Unassigned"
  );
}

function formatGoalTarget(goal: Goal) {
  return formatTargetDisplay(goal);
}

function buildDashboardData() {
  const employee = mockUsers.find((user) => user.id === EMPLOYEE_ID);
  const activeCycle = getActiveGoalCycle();
  const submission = getGoalSubmissionByEmployeeId(EMPLOYEE_ID, activeCycle?.id);
  const manager = employee?.managerId
    ? mockUsers.find((user) => user.id === employee.managerId)
    : null;
  const plannedVsActualRows = getPlannedVsActualRows(EMPLOYEE_ID, CHECKIN_WINDOWS.Q2);
  const managerCheckin = getCheckinsByEmployeeId(EMPLOYEE_ID, activeCycle?.id)[0] ?? null;
  const goals = plannedVsActualRows.map((row) => row.goal);
  const updates = plannedVsActualRows.filter((row) => row.achievement);
  const totalWeightage = goals.reduce((total, goal) => total + goal.weightage, 0);
  const displayWeightage = Math.min(totalWeightage, 100);
  const averageProgress =
    updates.length > 0
      ? updates.reduce(
          (total, row) =>
            total + getDisplayProgressScore(row.achievement?.progressScore ?? 0),
          0
        ) / updates.length
      : 0;
  const approvedCount = goals.filter(
    (goal) => goal.status === GOAL_STATUSES.APPROVED
  ).length;
  const submittedOrApproved = submission
    ? submission.status !== GOAL_STATUSES.DRAFT
    : false;

  return {
    employeeName: employee?.name ?? "Employee",
    employeeTitle: employee?.title ?? "Employee",
    departmentName: getDepartmentName(employee?.departmentId),
    managerName: manager?.name ?? "Manager",
    cycleName: activeCycle?.name ?? "Current cycle",
    cycleWindow: activeCycle
      ? `${formatDate(activeCycle.startsOn)} - ${formatDate(activeCycle.endsOn)}`
      : "Active quarter",
    submissionStatus: submission?.status ?? GOAL_STATUSES.DRAFT,
    metrics: [
      {
        label: "Overall progress",
        value: formatPercent(averageProgress, 1),
        helper: `${updates.length} of ${goals.length} goals updated`,
        accent: "blue" as const,
        progress: averageProgress
      },
      {
        label: "Active goals",
        value: `${goals.length}`,
        helper: `${approvedCount} approved for tracking`,
        accent: "emerald" as const,
        progress: goals.length ? (approvedCount / goals.length) * 100 : 0
      },
      {
        label: "Weightage planned",
        value: `${displayWeightage}%`,
        helper: totalWeightage === 100 ? "Balanced for submission" : "Review weights",
        accent: totalWeightage === 100 ? ("emerald" as const) : ("amber" as const),
        progress: Math.min(totalWeightage, 100)
      },
      {
        label: "Manager check-in",
        value: managerCheckin ? "Completed" : "Pending",
        helper: managerCheckin ? "Feedback captured" : "Discussion needed",
        accent: managerCheckin ? ("emerald" as const) : ("amber" as const),
        progress: managerCheckin ? 100 : 40
      }
    ],
    goalRows: plannedVsActualRows.map((row) => ({
      id: row.goal.id,
      title: row.goal.title,
      description: row.goal.description ?? "No description added.",
      thrustArea: row.goal.thrustArea,
      weightage: row.goal.weightage,
      target: formatGoalTarget(row.goal),
      status: row.goal.status,
      progressScore: getDisplayProgressScore(row.achievement?.progressScore ?? 0)
    })),
    nextActions: [
      {
        title: submittedOrApproved
          ? "Review goal progress"
          : "Finish goal submission",
        description: submittedOrApproved
          ? "Open quarterly check-ins to keep actual achievement current."
          : "Confirm total weightage and submit goals for manager review.",
        href: submittedOrApproved ? ROUTES.EMPLOYEE_CHECKINS : ROUTES.EMPLOYEE_GOALS
      },
      {
        title: "Prepare Q2 check-in",
        description: "Update actual achievement and status for each approved goal.",
        href: ROUTES.EMPLOYEE_CHECKINS
      },
      {
        title: "Use AlignIQ Assistant",
        description: "Draft sharper goal language or ask policy questions.",
        href: ROUTES.AI_ASSISTANT
      }
    ],
    managerFeedback: managerCheckin?.comment ?? "No manager feedback has been added yet.",
    managerFeedbackDate: managerCheckin?.updatedAt ? formatDate(managerCheckin.updatedAt) : null
  };
}

export default function EmployeeDashboardPage() {
  return (
    <AppShell>
      <EmployeeDashboard data={buildDashboardData()} />
    </AppShell>
  );
}
