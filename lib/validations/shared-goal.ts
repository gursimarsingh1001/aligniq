import { z } from "zod";

import { THRUST_AREAS } from "@/lib/constants/thrust-areas";
import {
  ALL_UOM_TYPES,
  requiresTargetDate,
  requiresTargetValue
} from "@/lib/constants/uom-types";
import { MIN_GOAL_WEIGHTAGE } from "@/lib/validations/goal";

export const sharedGoalInputSchema = z
  .object({
    title: z.string().trim().min(1, "Goal title is required."),
    description: z.string().trim().min(1, "Description is required."),
    departmentId: z.string().trim().min(1, "Department is required."),
    thrustArea: z.enum(THRUST_AREAS, {
      error: "Thrust area is required."
    }),
    uomType: z.enum(ALL_UOM_TYPES, {
      error: "Measurement is required."
    }),
    targetValue: z.number().nonnegative().nullable().optional(),
    targetDate: z.string().trim().nullable().optional(),
    primaryOwnerId: z.string().trim().min(1, "Primary owner is required."),
    assignedEmployeeIds: z
      .array(z.string().trim().min(1))
      .min(1, "Assign the shared goal to at least one employee.")
  })
  .superRefine((goal, context) => {
    if (!goal.assignedEmployeeIds.includes(goal.primaryOwnerId)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["primaryOwnerId"],
        message: "Primary owner must be included in assigned employees."
      });
    }

    if (requiresTargetValue(goal.uomType) && goal.targetValue === null) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["targetValue"],
        message: "Target value is required for this measurement."
      });
    }

    if (requiresTargetDate(goal.uomType) && !goal.targetDate) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["targetDate"],
        message: "Target date is required for timeline goals."
      });
    }
  });

export const sharedGoalWeightageSchema = z.object({
  sharedGoalId: z.string().trim().min(1),
  employeeId: z.string().trim().min(1),
  weightage: z
    .number()
    .int()
    .min(MIN_GOAL_WEIGHTAGE, "Shared goal weightage must be at least 10%.")
    .max(100, "Shared goal weightage cannot exceed 100%.")
});

export type SharedGoalInput = z.infer<typeof sharedGoalInputSchema>;
export type SharedGoalWeightageInput = z.infer<typeof sharedGoalWeightageSchema>;
