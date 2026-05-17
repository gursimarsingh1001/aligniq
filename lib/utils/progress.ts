import { UOM_TYPES } from "@/lib/constants/uom-types";
import type { Goal } from "@/lib/types/goal";
import {
  differenceInCalendarDays,
  isDateOnOrBefore
} from "@/lib/utils/dates";

function roundProgress(value: number) {
  if (!Number.isFinite(value) || value < 0) {
    return 0;
  }

  return Number(value.toFixed(2));
}

function calculateHigherIsBetter(actual: number | null | undefined, target: number | null) {
  if (actual === null || actual === undefined || !target || target <= 0) {
    return 0;
  }

  return roundProgress((actual / target) * 100);
}

function calculateLowerIsBetter(actual: number | null | undefined, target: number | null) {
  if (actual === null || actual === undefined || !target || target <= 0) {
    return 0;
  }

  if (actual <= 0) {
    return 100;
  }

  return roundProgress((target / actual) * 100);
}

function calculateTimelineProgress(targetDate: string | null, completionDate?: string | null) {
  if (!targetDate || !completionDate) {
    return 0;
  }

  if (isDateOnOrBefore(completionDate, targetDate)) {
    return 100;
  }

  const lateDays = Math.max(differenceInCalendarDays(targetDate, completionDate), 0);

  return roundProgress(Math.max(100 - lateDays * 5, 0));
}

export function calculateProgressScore(
  goal: Goal,
  actualAchievement: number | null | undefined,
  completionDate?: string | null
) {
  switch (goal.uomType) {
    case UOM_TYPES.NUMERIC_MIN:
    case UOM_TYPES.PERCENTAGE_MIN:
      return calculateHigherIsBetter(actualAchievement, goal.targetValue);
    case UOM_TYPES.NUMERIC_MAX:
    case UOM_TYPES.PERCENTAGE_MAX:
      return calculateLowerIsBetter(actualAchievement, goal.targetValue);
    case UOM_TYPES.TIMELINE:
      return calculateTimelineProgress(goal.targetDate, completionDate);
    case UOM_TYPES.ZERO_BASED:
      return actualAchievement === 0 ? 100 : 0;
    default:
      return 0;
  }
}

export function getDisplayProgressScore(progressScore: number) {
  return Math.min(Math.max(progressScore, 0), 100);
}

export function calculateWeightedScore(progressScore: number, weightage: number) {
  return roundProgress((progressScore * weightage) / 100);
}
