export const UOM_TYPES = {
  NUMERIC_MIN: "numeric_min",
  NUMERIC_MAX: "numeric_max",
  PERCENTAGE_MIN: "percentage_min",
  PERCENTAGE_MAX: "percentage_max",
  TIMELINE: "timeline",
  ZERO_BASED: "zero_based"
} as const;

export type UomType = (typeof UOM_TYPES)[keyof typeof UOM_TYPES];

export const ALL_UOM_TYPES = [
  UOM_TYPES.NUMERIC_MIN,
  UOM_TYPES.NUMERIC_MAX,
  UOM_TYPES.PERCENTAGE_MIN,
  UOM_TYPES.PERCENTAGE_MAX,
  UOM_TYPES.TIMELINE,
  UOM_TYPES.ZERO_BASED
] as const satisfies readonly UomType[];

export const UOM_TYPE_LABELS: Record<UomType, string> = {
  [UOM_TYPES.NUMERIC_MIN]: "Minimum number",
  [UOM_TYPES.NUMERIC_MAX]: "Maximum number",
  [UOM_TYPES.PERCENTAGE_MIN]: "Minimum percentage",
  [UOM_TYPES.PERCENTAGE_MAX]: "Maximum percentage",
  [UOM_TYPES.TIMELINE]: "Due date",
  [UOM_TYPES.ZERO_BASED]: "Zero target"
};

export const UOM_TYPE_DIRECTION_LABELS: Record<UomType, string> = {
  [UOM_TYPES.NUMERIC_MIN]: "Higher value is better",
  [UOM_TYPES.NUMERIC_MAX]: "Lower value is better",
  [UOM_TYPES.PERCENTAGE_MIN]: "Higher value is better",
  [UOM_TYPES.PERCENTAGE_MAX]: "Lower value is better",
  [UOM_TYPES.TIMELINE]: "Complete by target date",
  [UOM_TYPES.ZERO_BASED]: "Actual of 0 equals 100%"
};

export const UOM_TYPES_REQUIRING_TARGET_VALUE = [
  UOM_TYPES.NUMERIC_MIN,
  UOM_TYPES.NUMERIC_MAX,
  UOM_TYPES.PERCENTAGE_MIN,
  UOM_TYPES.PERCENTAGE_MAX
] as const satisfies readonly UomType[];

export const UOM_TYPES_REQUIRING_TARGET_DATE = [
  UOM_TYPES.TIMELINE
] as const satisfies readonly UomType[];

export function requiresTargetValue(uomType: UomType) {
  return (UOM_TYPES_REQUIRING_TARGET_VALUE as readonly UomType[]).includes(uomType);
}

export function requiresTargetDate(uomType: UomType) {
  return (UOM_TYPES_REQUIRING_TARGET_DATE as readonly UomType[]).includes(uomType);
}
