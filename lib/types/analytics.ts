import type { UomType } from "@/lib/constants/uom-types";

export type AnalyticsMetric = {
  label: string;
  value: string;
  helperText: string;
};

export type GoalTrendPoint = {
  quarter: string;
  averageProgressScore: number;
  completionRate: number;
};

export type AnalyticsDistributionItem = {
  label: string;
  value: number;
  percent: number;
};

export type DepartmentCompletionRate = {
  departmentName: string;
  completed: number;
  total: number;
  completionRate: number;
};

export type ManagerEffectivenessRow = {
  managerId: string;
  managerName: string;
  directReports: number;
  checkinsCompleted: number;
  checkinCompletionRate: number;
  pendingApprovals: number;
  averageProgressScore: number;
  effectivenessScore: number;
};

export type AtRiskGoalRow = {
  id: string;
  employeeName: string;
  managerName: string;
  goalTitle: string;
  uomType: UomType;
  progressScore: number;
  reason: string;
  severity: "low" | "medium" | "high";
};

export type HeatmapQuarter = "q1" | "q2" | "q3" | "q4";

export type HeatmapStatus = "healthy" | "watch" | "at_risk" | "no_data";

export type DepartmentQuarterHeatmapCell = {
  department: string;
  quarter: HeatmapQuarter;
  completionRate: number | null;
  status: HeatmapStatus;
};

export type DepartmentQuarterHeatmapRow = {
  department: string;
  quarters: Record<HeatmapQuarter, DepartmentQuarterHeatmapCell>;
};

export type AnalyticsDashboard = {
  metrics: AnalyticsMetric[];
  goalTrends: GoalTrendPoint[];
  completionHeatmap: DepartmentQuarterHeatmapRow[];
  departmentCompletion: DepartmentCompletionRate[];
  thrustAreaDistribution: AnalyticsDistributionItem[];
  uomTypeDistribution: AnalyticsDistributionItem[];
  managerEffectiveness: ManagerEffectivenessRow[];
  atRiskGoals: AtRiskGoalRow[];
};
