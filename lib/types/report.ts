import type { GoalStatus } from "@/lib/constants/goal-status";
import type { CheckinProgressStatus } from "@/lib/constants/checkin-windows";
import type { UomType } from "@/lib/constants/uom-types";

export type ReportCompletionStatus = "completed" | "pending" | "not_applicable";

export type AchievementReportRow = {
  employeeId: string;
  employeeName: string;
  managerId: string;
  managerName: string;
  departmentName: string;
  cycleName: string;
  quarterLabel: string;
  goalId: string;
  goalTitle: string;
  goalType?: "Individual" | "Shared";
  sharedGoalId?: string | null;
  thrustArea: string;
  uomType: UomType;
  plannedTarget: string;
  actualAchievement: string;
  targetValue: number | null;
  targetDate: string | null;
  actualValue: number | null;
  completionDate: string | null;
  weightage: number;
  progressScore: number;
  weightedScore: number;
  goalStatus: GoalStatus;
  employeeStatus: CheckinProgressStatus | "pending";
  checkinCompletionStatus: ReportCompletionStatus;
};

export type GoalSummaryReportRow = {
  employeeId: string;
  employeeName: string;
  cycleName: string;
  goalCount: number;
  totalWeightage: number;
  averageProgressScore: number;
  weightedAchievementScore: number;
};

export type AdminMetric = {
  label: string;
  value: number;
  helperText: string;
};

export type CompletionDashboardItem = {
  label: string;
  completed: number;
  total: number;
  pending: number;
  helperText: string;
};

export type AdminDashboardSummary = {
  metrics: {
    totalEmployees: AdminMetric;
    goalsSubmitted: AdminMetric;
    goalsApproved: AdminMetric;
    pendingManagerApprovals: AdminMetric;
    quarterlyUpdatesCompleted: AdminMetric;
    managerCheckinsCompleted: AdminMetric;
  };
  completion: CompletionDashboardItem[];
  exceptions: string[];
};

export type CycleTimelineItem = {
  id: string;
  title: string;
  windowLabel: string;
  description: string;
  status: "active" | "closed" | "upcoming";
};
