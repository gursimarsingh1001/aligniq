import { GOAL_STATUSES } from "@/lib/constants/goal-status";
import { ROLES } from "@/lib/constants/roles";
import { mockCheckins } from "@/lib/data/mock-checkins";
import { mockGoalSubmissions } from "@/lib/data/mock-goals";
import { mockUsers } from "@/lib/data/mock-users";
import { getAchievementReportRows } from "@/lib/services/report-service";
import type {
  AnalyticsDashboard,
  AnalyticsDistributionItem,
  AnalyticsMetric,
  AtRiskGoalRow,
  DepartmentQuarterHeatmapRow,
  DepartmentCompletionRate,
  HeatmapQuarter,
  HeatmapStatus,
  GoalTrendPoint,
  ManagerEffectivenessRow
} from "@/lib/types/analytics";
import type { AchievementReportRow } from "@/lib/types/report";
import { formatPercent, formatUomLabel } from "@/lib/utils/formatters";
import { getDisplayProgressScore } from "@/lib/utils/progress";

function toPercent(completed: number, total: number) {
  if (total === 0) {
    return 0;
  }

  return Math.round((completed / total) * 100);
}

function average(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return Number(
    (values.reduce((total, value) => total + value, 0) / values.length).toFixed(1)
  );
}

function getDistribution(
  rows: AchievementReportRow[],
  getLabel: (row: AchievementReportRow) => string
): AnalyticsDistributionItem[] {
  const counts = rows.reduce<Map<string, number>>((map, row) => {
    const label = getLabel(row);
    map.set(label, (map.get(label) ?? 0) + 1);
    return map;
  }, new Map());

  return Array.from(counts.entries())
    .map(([label, value]) => ({
      label,
      value,
      percent: toPercent(value, rows.length)
    }))
    .sort((first, second) => second.value - first.value);
}

function getDepartmentCompletionRates(
  rows: AchievementReportRow[]
): DepartmentCompletionRate[] {
  const groupedRows = rows.reduce<Map<string, AchievementReportRow[]>>(
    (map, row) => {
      map.set(row.departmentName, [...(map.get(row.departmentName) ?? []), row]);
      return map;
    },
    new Map()
  );

  return Array.from(groupedRows.entries()).map(([departmentName, departmentRows]) => {
    const completed = departmentRows.filter(
      (row) => row.checkinCompletionStatus === "completed"
    ).length;

    return {
      departmentName,
      completed,
      total: departmentRows.length,
      completionRate: toPercent(completed, departmentRows.length)
    };
  });
}

function getGoalTrends(rows: AchievementReportRow[]): GoalTrendPoint[] {
  const q2Average = average(rows.map((row) => row.progressScore));
  const q2CompletionRate = toPercent(
    rows.filter((row) => row.checkinCompletionStatus === "completed").length,
    rows.length
  );

  return [
    {
      quarter: "FY26 Q1",
      averageProgressScore: 68,
      completionRate: 72
    },
    {
      quarter: "FY26 Q2",
      averageProgressScore: q2Average,
      completionRate: q2CompletionRate
    },
    {
      quarter: "FY26 Q3",
      averageProgressScore: 0,
      completionRate: 0
    },
    {
      quarter: "FY26 Q4",
      averageProgressScore: 0,
      completionRate: 0
    }
  ];
}

function getManagerEffectiveness(rows: AchievementReportRow[]) {
  return mockUsers
    .filter((user) => user.role === ROLES.MANAGER)
    .map<ManagerEffectivenessRow>((manager) => {
      const directReports = mockUsers.filter(
        (user) => user.managerId === manager.id
      );
      const directReportIds = directReports.map((user) => user.id);
      const managerRows = rows.filter((row) =>
        directReportIds.includes(row.employeeId)
      );
      const checkinsCompleted = new Set(
        mockCheckins
          .filter(
            (checkin) =>
              checkin.managerId === manager.id &&
              directReportIds.includes(checkin.employeeId)
          )
          .map((checkin) => checkin.employeeId)
      ).size;
      const pendingApprovals = mockGoalSubmissions.filter(
        (submission) =>
          submission.managerId === manager.id &&
          submission.status === GOAL_STATUSES.SUBMITTED
      ).length;
      const checkinCompletionRate = toPercent(
        checkinsCompleted,
        directReports.length
      );
      const averageProgressScore = average(
        managerRows.map((row) => row.progressScore)
      );
      const effectivenessScore = Math.max(
        0,
        Math.min(
          100,
          Math.round(
            checkinCompletionRate * 0.5 +
              Math.min(averageProgressScore, 100) * 0.5 -
              pendingApprovals * 5
          )
        )
      );

      return {
        managerId: manager.id,
        managerName: manager.name,
        directReports: directReports.length,
        checkinsCompleted,
        checkinCompletionRate,
        pendingApprovals,
        averageProgressScore,
        effectivenessScore
      };
    });
}

function getAtRiskGoals(rows: AchievementReportRow[]): AtRiskGoalRow[] {
  return rows
    .filter(
      (row) =>
        row.progressScore < 50 ||
        row.checkinCompletionStatus === "pending" ||
        row.goalStatus === GOAL_STATUSES.SUBMITTED ||
        row.goalStatus === GOAL_STATUSES.RETURNED
    )
    .map((row) => {
      const isHighRisk =
        row.goalStatus === GOAL_STATUSES.RETURNED || row.progressScore < 25;
      const reason =
        row.goalStatus === GOAL_STATUSES.SUBMITTED
          ? "Manager approval is pending."
          : row.goalStatus === GOAL_STATUSES.RETURNED
            ? "Goal submission was returned for rework."
            : row.checkinCompletionStatus === "pending"
              ? "Quarterly actual achievement is not recorded."
              : "Progress score is below the tracking threshold.";

      return {
        id: row.goalId,
        employeeName: row.employeeName,
        managerName: row.managerName,
        goalTitle: row.goalTitle,
        uomType: row.uomType,
        progressScore: row.progressScore,
        reason,
        severity: isHighRisk ? "high" : "medium"
      } satisfies AtRiskGoalRow;
    });
}

const heatmapQuarterOrder = ["q1", "q2", "q3", "q4"] as const satisfies readonly HeatmapQuarter[];

const analyticsOnlyCompletionRates: Record<
  string,
  Partial<Record<HeatmapQuarter, number | null>>
> = {
  "Sales": {
    q1: 92,
    q2: 86,
    q3: 74,
    q4: null
  },
  "Engineering": {
    q1: 78,
    q3: 64,
    q4: null
  },
  "Customer Success": {
    q1: 88,
    q2: 81,
    q3: 69,
    q4: null
  },
  "Operations": {
    q1: 61,
    q2: 52,
    q3: 58,
    q4: null
  },
  "HR / Admin": {
    q1: 95,
    q2: 90,
    q3: 83,
    q4: null
  }
};

function getHeatmapStatus(completionRate: number | null): HeatmapStatus {
  if (completionRate === null) {
    return "no_data";
  }

  if (completionRate >= 85) {
    return "healthy";
  }

  if (completionRate >= 60) {
    return "watch";
  }

  return "at_risk";
}

function getDepartmentQ2CompletionRates(rows: AchievementReportRow[]) {
  return getDepartmentCompletionRates(rows).reduce<Record<string, number>>(
    (rates, department) => ({
      ...rates,
      [department.departmentName]: department.completionRate
    }),
    {}
  );
}

function getCompletionHeatmap(
  rows: AchievementReportRow[]
): DepartmentQuarterHeatmapRow[] {
  const q2CompletionRates = getDepartmentQ2CompletionRates(rows);
  const departments = Array.from(
    new Set([
      ...Object.keys(analyticsOnlyCompletionRates),
      ...Object.keys(q2CompletionRates)
    ])
  );

  return departments.map((department) => {
    const quarters = heatmapQuarterOrder.reduce<
      DepartmentQuarterHeatmapRow["quarters"]
    >((cells, quarter) => {
      const analyticsRate =
        analyticsOnlyCompletionRates[department]?.[quarter] ?? null;
      const completionRate =
        quarter === "q2" && q2CompletionRates[department] !== undefined
          ? q2CompletionRates[department]
          : analyticsRate;

      return {
        ...cells,
        [quarter]: {
          department,
          quarter,
          completionRate,
          status: getHeatmapStatus(completionRate)
        }
      };
    }, {} as DepartmentQuarterHeatmapRow["quarters"]);

    return {
      department,
      quarters
    };
  });
}

function getMetrics(rows: AchievementReportRow[]): AnalyticsMetric[] {
  const completedRows = rows.filter(
    (row) => row.checkinCompletionStatus === "completed"
  );
  const atRiskRows = getAtRiskGoals(rows);
  const averageProgressScore = average(rows.map((row) => row.progressScore));

  return [
    {
      label: "Average progress score",
      value: formatPercent(getDisplayProgressScore(averageProgressScore), 1),
      helperText: "Average across reportable goal rows."
    },
    {
      label: "Goal update completion",
      value: formatPercent(toPercent(completedRows.length, rows.length), 0),
      helperText: "Goal rows with actual achievement recorded."
    },
    {
      label: "At-risk goals",
      value: String(atRiskRows.length),
      helperText: "Goals needing approval, update, or attention."
    },
    {
      label: "Manager check-ins",
      value: String(mockCheckins.length),
      helperText: "Saved manager check-in comments in the current workspace."
    }
  ];
}

export function getAnalyticsDashboard(): AnalyticsDashboard {
  const rows = getAchievementReportRows();

  return {
    metrics: getMetrics(rows),
    goalTrends: getGoalTrends(rows),
    completionHeatmap: getCompletionHeatmap(rows),
    departmentCompletion: getDepartmentCompletionRates(rows),
    thrustAreaDistribution: getDistribution(rows, (row) => row.thrustArea),
    uomTypeDistribution: getDistribution(rows, (row) => formatUomLabel(row.uomType)),
    managerEffectiveness: getManagerEffectiveness(rows),
    atRiskGoals: getAtRiskGoals(rows)
  };
}
