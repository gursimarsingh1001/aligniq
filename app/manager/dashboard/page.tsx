import { ManagerDashboard } from "@/components/manager/ManagerDashboard";
import { AppShell } from "@/components/layout/AppShell";
import { CHECKIN_WINDOWS } from "@/lib/constants/checkin-windows";
import { GOAL_STATUSES } from "@/lib/constants/goal-status";
import { ROUTES } from "@/lib/constants/routes";
import { mockDepartments, mockUsers } from "@/lib/data/mock-users";
import { getApprovalQueueItemsForManager } from "@/lib/services/approval-service";
import {
  getPlannedVsActualRows,
  getTeamCheckinSummaries
} from "@/lib/services/checkin-service";
import { getActiveGoalCycle } from "@/lib/services/goal-service";
import { getSharedGoalsForManager } from "@/lib/services/shared-goal-service";
import { formatDate, formatPercent } from "@/lib/utils/formatters";
import { getDisplayProgressScore } from "@/lib/utils/progress";

const MANAGER_ID = "demo-manager";

function getDepartmentName(departmentId: string | null | undefined) {
  if (!departmentId) {
    return "Unassigned";
  }

  return (
    mockDepartments.find((department) => department.id === departmentId)?.name ??
    "Unassigned"
  );
}

function getTeamMembers(managerId: string) {
  return mockUsers.filter((user) => user.managerId === managerId && user.isActive);
}

function getTeamProgress(employeeId: string) {
  const rows = getPlannedVsActualRows(employeeId, CHECKIN_WINDOWS.Q2);
  const progressRows = rows.filter((row) => row.achievement);
  const averageProgress =
    progressRows.length > 0
      ? progressRows.reduce(
          (total, row) =>
            total + getDisplayProgressScore(row.achievement?.progressScore ?? 0),
          0
        ) / progressRows.length
      : 0;

  return {
    rows,
    averageProgress
  };
}

function buildDashboardData() {
  const manager = mockUsers.find((user) => user.id === MANAGER_ID);
  const activeCycle = getActiveGoalCycle();
  const teamMembers = getTeamMembers(MANAGER_ID);
  const approvalQueue = getApprovalQueueItemsForManager(MANAGER_ID);
  const checkinSummaries = getTeamCheckinSummaries(
    MANAGER_ID,
    CHECKIN_WINDOWS.Q2
  );
  const sharedGoals = getSharedGoalsForManager(MANAGER_ID);
  const teamHealth = teamMembers.map((employee) => {
    const checkinSummary = checkinSummaries.find(
      (summary) => summary.employeeId === employee.id
    );
    const teamProgress = getTeamProgress(employee.id);
    const updatedGoals =
      checkinSummary?.updatedGoalCount ??
      teamProgress.rows.filter((row) => row.achievement).length;
    const approvedGoals = checkinSummary?.approvedGoalCount ?? teamProgress.rows.length;

    return {
      id: employee.id,
      name: employee.name,
      title: employee.title,
      departmentName: getDepartmentName(employee.departmentId),
      approvedGoals,
      updatedGoals,
      averageProgress: teamProgress.averageProgress,
      checkinCompleted: Boolean(checkinSummary?.managerCheckin)
    };
  });
  const totalApprovedGoals = teamHealth.reduce(
    (total, member) => total + member.approvedGoals,
    0
  );
  const totalUpdatedGoals = teamHealth.reduce(
    (total, member) => total + member.updatedGoals,
    0
  );
  const completedCheckins = teamHealth.filter(
    (member) => member.checkinCompleted
  ).length;
  const checkinCoverage =
    teamHealth.length > 0 ? (completedCheckins / teamHealth.length) * 100 : 0;
  const teamProgress =
    teamHealth.length > 0
      ? teamHealth.reduce((total, member) => total + member.averageProgress, 0) /
        teamHealth.length
      : 0;
  const atRiskMembers = teamHealth.filter(
    (member) =>
      member.averageProgress < 50 ||
      member.updatedGoals < member.approvedGoals ||
      !member.checkinCompleted
  );
  const pendingApprovalGoals = approvalQueue.reduce(
    (total, item) => total + item.goalCount,
    0
  );

  return {
    managerName: manager?.name ?? "Manager",
    managerTitle: manager?.title ?? "Manager",
    departmentName: getDepartmentName(manager?.departmentId),
    cycleName: activeCycle?.name ?? "Current cycle",
    cycleWindow: activeCycle
      ? `${formatDate(activeCycle.startsOn)} - ${formatDate(activeCycle.endsOn)}`
      : "Active quarter",
    metrics: [
      {
        label: "Team alignment",
        value: formatPercent(teamProgress, 1),
        helper: `${totalUpdatedGoals} of ${totalApprovedGoals} goal updates captured`,
        accent:
          teamProgress >= 85
            ? ("emerald" as const)
            : teamProgress >= 50
              ? ("blue" as const)
              : ("amber" as const),
        progress: teamProgress
      },
      {
        label: "Pending approvals",
        value: `${approvalQueue.length}`,
        helper: `${pendingApprovalGoals} submitted goals need review`,
        accent: approvalQueue.length > 0 ? ("amber" as const) : ("emerald" as const),
        progress: approvalQueue.length > 0 ? 65 : 100
      },
      {
        label: "Check-in coverage",
        value: `${completedCheckins}/${teamHealth.length}`,
        helper: `${formatPercent(checkinCoverage, 0)} manager comments completed`,
        accent:
          checkinCoverage >= 85
            ? ("emerald" as const)
            : checkinCoverage >= 50
              ? ("blue" as const)
              : ("amber" as const),
        progress: checkinCoverage
      },
      {
        label: "Focus items",
        value: `${atRiskMembers.length}`,
        helper:
          atRiskMembers.length > 0
            ? "Employees with pending updates or check-ins"
            : "No urgent follow-ups visible",
        accent: atRiskMembers.length > 0 ? ("red" as const) : ("emerald" as const),
        progress: atRiskMembers.length > 0 ? 45 : 100
      }
    ],
    approvals: approvalQueue.map((item) => ({
      id: item.submission.id,
      employeeId: item.employee.id,
      employeeName: item.employee.name,
      departmentName: item.department?.name ?? "Unassigned",
      submittedAt: item.submission.submittedAt
        ? formatDate(item.submission.submittedAt)
        : "Not submitted",
      goalCount: item.goalCount,
      totalWeightage: item.totalWeightage
    })),
    teamHealth,
    coachingSignals: [
      ...approvalQueue.map((item) => ({
        id: `approval-${item.submission.id}`,
        employeeId: item.employee.id,
        employeeName: item.employee.name,
        title: "Goal approval awaiting review",
        description: `${item.goalCount} goals are submitted and ready for decision.`,
        tone: "amber" as const,
        href: ROUTES.MANAGER_APPROVALS
      })),
      ...teamHealth
        .filter((member) => member.updatedGoals < member.approvedGoals)
        .map((member) => ({
          id: `updates-${member.id}`,
          employeeId: member.id,
          employeeName: member.name,
          title: "Quarterly updates incomplete",
          description: `${member.updatedGoals} of ${member.approvedGoals} approved goals have achievement updates.`,
          tone: "red" as const,
          href: ROUTES.MANAGER_CHECKINS
        })),
      ...teamHealth
        .filter((member) => !member.checkinCompleted)
        .map((member) => ({
          id: `checkin-${member.id}`,
          employeeId: member.id,
          employeeName: member.name,
          title: "Manager check-in pending",
          description: "Add a structured comment after the quarterly discussion.",
          tone: "blue" as const,
          href: ROUTES.MANAGER_CHECKINS
        }))
    ].slice(0, 5),
    sharedGoals: sharedGoals.map((goal) => ({
      id: goal.id,
      title: goal.title,
      assignmentCount: goal.assignments.length,
      syncedCount: goal.assignments.filter(
        (assignment) => assignment.syncStatus === "synced"
      ).length,
      status: goal.status === GOAL_STATUSES.DRAFT ? "Draft" : "Active"
    })),
    primaryActions: [
      {
        title: "Review approvals",
        href: ROUTES.MANAGER_APPROVALS
      },
      {
        title: "Open check-ins",
        href: ROUTES.MANAGER_CHECKINS
      }
    ]
  };
}

export default function ManagerDashboardPage() {
  return (
    <AppShell>
      <ManagerDashboard data={buildDashboardData()} />
    </AppShell>
  );
}
