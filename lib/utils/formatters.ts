import { ROLE_LABELS, type Role } from "@/lib/constants/roles";
import {
  UOM_TYPES,
  UOM_TYPE_DIRECTION_LABELS,
  UOM_TYPE_LABELS,
  type UomType
} from "@/lib/constants/uom-types";

type GoalTargetLike = {
  uomType: UomType;
  targetDate?: string | null;
  targetValue?: number | null;
};

export function formatPercent(value: number, fractionDigits = 1) {
  return `${value.toFixed(fractionDigits)}%`;
}

export function formatWeightage(value: number) {
  return `${value}%`;
}

export function formatNumber(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "-";
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2
  }).format(value);
}

export function formatDate(value: string | null | undefined) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(value));
}

export function formatRole(role: Role) {
  return ROLE_LABELS[role];
}

export function formatUomType(uomType: UomType) {
  return UOM_TYPE_LABELS[uomType];
}

export function formatUomLabel(uomType: UomType) {
  return UOM_TYPE_LABELS[uomType];
}

export function formatDirectionLabel(uomType: UomType) {
  return UOM_TYPE_DIRECTION_LABELS[uomType];
}

export function formatTargetDisplay(goal: GoalTargetLike) {
  if (goal.uomType !== UOM_TYPES.TIMELINE && goal.uomType !== UOM_TYPES.ZERO_BASED) {
    if (goal.targetValue === null || goal.targetValue === undefined) {
      return "-";
    }
  }

  if (goal.uomType === UOM_TYPES.TIMELINE && !goal.targetDate) {
    return "-";
  }

  const formattedValue = formatNumber(goal.targetValue);

  switch (goal.uomType) {
    case UOM_TYPES.NUMERIC_MIN:
      return `At least ${formattedValue}`;
    case UOM_TYPES.NUMERIC_MAX:
      return `${formattedValue} or less`;
    case UOM_TYPES.PERCENTAGE_MIN:
      return `At least ${formattedValue}%`;
    case UOM_TYPES.PERCENTAGE_MAX:
      return `${formattedValue}% or less`;
    case UOM_TYPES.TIMELINE:
      return `Complete by ${formatDate(goal.targetDate)}`;
    case UOM_TYPES.ZERO_BASED:
      return "0 occurrences";
    default:
      return formattedValue;
  }
}
