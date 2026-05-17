import {
  CHECKIN_WINDOW_LABELS,
  CHECKIN_WINDOWS,
  type CheckinWindow
} from "@/lib/constants/checkin-windows";
import { THRUST_AREAS, type ThrustArea } from "@/lib/constants/thrust-areas";
import { UOM_TYPES, UOM_TYPE_LABELS, type UomType } from "@/lib/constants/uom-types";
import { POLICY_KNOWLEDGE_BASE } from "@/lib/data/policy-knowledge-base";
import { mockUsers } from "@/lib/data/mock-users";
import {
  getPlannedVsActualRows,
  getTeamCheckinSummaries
} from "@/lib/services/checkin-service";
import type { PlannedVsActualRow } from "@/lib/types/checkin";
import type {
  GoalCopilotSuggestion,
  ManagerCheckinSummary,
  ManagerCheckinSummaryInput,
  ManagerSummaryEmployee,
  PolicyAnswer,
  PolicyKnowledgeChunk
} from "@/lib/types/ai";
import {
  formatDate,
  formatNumber,
  formatPercent,
  formatTargetDisplay
} from "@/lib/utils/formatters";
import { getDisplayProgressScore } from "@/lib/utils/progress";

const POLICY_SOURCE_NOTE =
  "Answers are based on the current AlignIQ policy knowledge base.";

const FALLBACK_POLICY_ANSWER =
  "I could not find this in the current policy knowledge base. Please check with HR/Admin.";

const DEFAULT_MANAGER_ID = "demo-manager";

type GoalSuggestionRule = {
  keywords: string[];
  title: string;
  description: string;
  thrustArea: ThrustArea;
  uomType: UomType;
  targetExample: string;
  weightage: number;
  measurableReason: string;
};

const goalSuggestionRules: GoalSuggestionRule[] = [
  {
    keywords: ["sales", "sale", "revenue", "pipeline", "growth"],
    title: "Increase revenue contribution",
    description:
      "Grow measurable revenue contribution from assigned accounts or opportunities.",
    thrustArea: "Business Impact",
    uomType: UOM_TYPES.NUMERIC_MIN,
    targetExample: "Achieve 25 qualified opportunities or equivalent revenue target",
    weightage: 20,
    measurableReason:
      "The target uses a numeric minimum, so progress can be tracked against a clear planned outcome."
  },
  {
    keywords: ["defect", "defects", "errors", "quality", "rework", "bugs"],
    title: "Reduce quality defects",
    description:
      "Reduce defects or errors found during delivery, review, or operational checks.",
    thrustArea: "Engineering Quality",
    uomType: UOM_TYPES.NUMERIC_MAX,
    targetExample: "Keep defects at or below 8 for the quarter",
    weightage: 25,
    measurableReason:
      "The target uses a lower-is-better measure, making progress visible as defects decrease."
  },
  {
    keywords: ["training", "certification", "course", "learning", "skill"],
    title: "Complete planned capability development",
    description:
      "Complete the planned training, certification, or development milestone by the target date.",
    thrustArea: "People Development",
    uomType: UOM_TYPES.TIMELINE,
    targetExample: "Complete certification by 30 Jun 2026",
    weightage: 15,
    measurableReason:
      "The goal is measurable because completion can be checked against a specific deadline."
  },
  {
    keywords: ["safety", "incident", "incidents", "compliance", "violation"],
    title: "Maintain zero reportable incidents",
    description:
      "Maintain zero reportable safety, compliance, or policy incidents during the quarter.",
    thrustArea: "Operational Excellence",
    uomType: UOM_TYPES.ZERO_BASED,
    targetExample: "0 reportable incidents",
    weightage: 20,
    measurableReason:
      "Zero target goals are clear for exception-based outcomes: actual 0 equals 100% progress."
  },
  {
    keywords: [
      "turnaround",
      "tat",
      "delay",
      "cost",
      "cycle time",
      "response time",
      "resolution time"
    ],
    title: "Reduce turnaround time",
    description:
      "Reduce turnaround time for a defined workflow while maintaining expected quality.",
    thrustArea: "Operational Excellence",
    uomType: UOM_TYPES.NUMERIC_MAX,
    targetExample: "Reduce average turnaround time to 3 business days or less",
    weightage: 25,
    measurableReason:
      "The goal is measurable because lower actual turnaround time improves progress against the target."
  },
  {
    keywords: [
      "customer",
      "satisfaction",
      "nps",
      "csat",
      "feedback",
      "experience"
    ],
    title: "Improve customer satisfaction",
    description:
      "Improve customer satisfaction or experience scores for the assigned area.",
    thrustArea: "Customer Experience",
    uomType: UOM_TYPES.PERCENTAGE_MIN,
    targetExample: "Reach 85% CSAT or agreed satisfaction score",
    weightage: 25,
    measurableReason:
      "The goal uses a percentage minimum, so progress improves as the satisfaction score rises."
  }
];

function tokenize(value: string) {
  return value
    .toLowerCase()
    .split(/[^a-z0-9%]+/)
    .filter((token) => token.length > 1);
}

function scorePolicyChunk(query: string, chunk: PolicyKnowledgeChunk) {
  const normalizedQuery = query.toLowerCase();
  const queryTokens = new Set(tokenize(query));
  const searchableText = `${chunk.title} ${chunk.content}`.toLowerCase();

  const keywordScore = chunk.keywords.reduce((score, keyword) => {
    const normalizedKeyword = keyword.toLowerCase();
    const keywordTokens = tokenize(normalizedKeyword);

    if (normalizedQuery.includes(normalizedKeyword)) {
      return score + 4;
    }

    if (
      keywordTokens.length > 0 &&
      keywordTokens.every((token) => queryTokens.has(token))
    ) {
      return score + keywordTokens.length + 3;
    }

    return queryTokens.has(normalizedKeyword) ? score + 2 : score;
  }, 0);

  const tokenScore = Array.from(queryTokens).reduce(
    (score, token) => (searchableText.includes(token) ? score + 1 : score),
    0
  );

  return keywordScore + tokenScore;
}

function getBestPolicyChunks(query: string) {
  return POLICY_KNOWLEDGE_BASE.map((chunk) => ({
    chunk,
    score: scorePolicyChunk(query, chunk)
  }))
    .filter((item) => item.score > 0)
    .sort((first, second) => second.score - first.score)
    .slice(0, 3)
    .map((item) => item.chunk);
}

export function answerPolicyQuestion(question: string): PolicyAnswer {
  const trimmedQuestion = question.trim();
  const matchedChunks = getBestPolicyChunks(trimmedQuestion);

  if (!trimmedQuestion || matchedChunks.length === 0) {
    return {
      question: trimmedQuestion,
      answer: FALLBACK_POLICY_ANSWER,
      matchedChunks: [],
      confidence: "not_found",
      sourceNote: POLICY_SOURCE_NOTE
    };
  }

  return {
    question: trimmedQuestion,
    answer: matchedChunks.map((chunk) => chunk.content).join(" "),
    matchedChunks,
    confidence: "matched",
    sourceNote: POLICY_SOURCE_NOTE
  };
}

function findGoalSuggestionRule(idea: string) {
  const normalizedIdea = idea.toLowerCase();

  return (
    goalSuggestionRules.find((rule) =>
      rule.keywords.some((keyword) => normalizedIdea.includes(keyword))
    ) ?? null
  );
}

export function suggestGoalDraft(roughGoal: string): GoalCopilotSuggestion {
  const sourceIdea = roughGoal.trim();
  const rule = findGoalSuggestionRule(sourceIdea) ?? {
    keywords: [],
    title: "Improve quarterly execution outcome",
    description:
      "Improve a clearly defined business outcome using an agreed measurable target.",
    thrustArea: THRUST_AREAS[0],
    uomType: UOM_TYPES.NUMERIC_MIN,
    targetExample: "Set a numeric target agreed with the manager",
    weightage: 20,
    measurableReason:
      "The goal becomes measurable once the outcome, target value, and review window are clearly defined."
  };

  return {
    sourceIdea,
    title: rule.title,
    description: rule.description,
    thrustArea: rule.thrustArea,
    uomType: rule.uomType,
    targetExample: rule.targetExample,
    weightage: rule.weightage,
    measurableReason: rule.measurableReason
  };
}

function formatPlannedTarget(row: PlannedVsActualRow) {
  return formatTargetDisplay(row.goal);
}

function formatActualAchievement(row: PlannedVsActualRow) {
  if (!row.achievement) {
    return "not recorded";
  }

  if (row.goal.targetDate) {
    return row.achievement.completionDate
      ? formatDate(row.achievement.completionDate)
      : "not recorded";
  }

  return formatNumber(row.achievement.actualValue);
}

function getProgressCategory(score: number) {
  if (score >= 100) {
    return "completed or exceeded";
  }

  if (score >= 50) {
    return "on track";
  }

  return "needs attention";
}

function getManagerFallbackId(managerId: string) {
  const summaries = getTeamCheckinSummaries(managerId, CHECKIN_WINDOWS.Q2);

  return summaries.length > 0 ? managerId : DEFAULT_MANAGER_ID;
}

export function getManagerSummaryEmployees(
  managerId: string,
  checkinWindow: CheckinWindow = CHECKIN_WINDOWS.Q2
): ManagerSummaryEmployee[] {
  const resolvedManagerId = getManagerFallbackId(managerId);

  return getTeamCheckinSummaries(resolvedManagerId, checkinWindow).map((summary) => ({
    employeeId: summary.employeeId,
    employeeName: summary.employeeName,
    departmentName: summary.departmentName
  }));
}

export function generateManagerCheckinSummary({
  checkinWindow,
  employeeId,
  managerId
}: ManagerCheckinSummaryInput): ManagerCheckinSummary {
  const resolvedManagerId = getManagerFallbackId(managerId);
  const employee =
    mockUsers.find((user) => user.id === employeeId) ??
    mockUsers.find((user) => user.id === "demo-employee");
  const employeeName = employee?.name ?? "Selected employee";
  const quarterLabel = CHECKIN_WINDOW_LABELS[checkinWindow];
  const rows = getPlannedVsActualRows(employeeId, checkinWindow);
  const rowsWithScores = rows.map((row) => ({
    row,
    score: row.achievement?.progressScore ?? 0,
    category: getProgressCategory(row.achievement?.progressScore ?? 0)
  }));
  const completed = rowsWithScores.filter((item) => item.score >= 100);
  const onTrack = rowsWithScores.filter(
    (item) => item.score >= 50 && item.score < 100
  );
  const attention = rowsWithScores.filter((item) => item.score < 50);
  const keyAchievements =
    completed.length > 0
      ? completed.map(({ row, score }) => {
          const displayScore = getDisplayProgressScore(score);

          return `${row.goal.title}: ${formatPercent(displayScore, 1)} against planned target ${formatPlannedTarget(row)}.`;
        })
      : ["No completed or exceeded goals are recorded for this quarter yet."];
  const risks =
    attention.length > 0
      ? attention.map(
          ({ row }) =>
            `${row.goal.title}: actual achievement is ${formatActualAchievement(row)} against planned target ${formatPlannedTarget(row)}.`
        )
      : ["No goals are currently below the 50% tracking threshold."];
  const suggestedManagerComment =
    rows.length === 0
      ? "No approved goals or quarterly updates are available yet. Confirm goal approval status before completing the check-in."
      : `${employeeName} has ${completed.length} goal(s) completed or exceeded, ${onTrack.length} on track, and ${attention.length} needing attention for ${quarterLabel}. Discuss blockers, confirm next actions, and keep support focused on the goals below target.`;

  return {
    employeeId,
    employeeName,
    quarterLabel,
    summary:
      rows.length === 0
        ? `No planned vs actual data is available for ${employeeName} in ${quarterLabel}.`
        : `${employeeName}'s ${quarterLabel} check-in shows ${completed.length} completed or exceeded goal(s), ${onTrack.length} on-track goal(s), and ${attention.length} goal(s) needing attention. This summary uses planned target, actual achievement, and progress score data from AlignIQ.`,
    keyAchievements,
    risks,
      suggestedManagerComment:
        resolvedManagerId === managerId
          ? suggestedManagerComment
          : `${suggestedManagerComment} Default manager team view is shown for this role.`,
    reminder:
      "Progress score is for tracking only and is not a final performance rating."
  };
}

export function getGoalCopilotUomLabel(uomType: UomType) {
  return UOM_TYPE_LABELS[uomType];
}
