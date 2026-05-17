import { z } from "zod";

import { ALL_UOM_TYPES, requiresTargetDate, requiresTargetValue } from "@/lib/constants/uom-types";
import { THRUST_AREAS } from "@/lib/constants/thrust-areas";

export const MAX_GOALS_PER_EMPLOYEE = 8;
export const MIN_GOAL_WEIGHTAGE = 10;
export const REQUIRED_TOTAL_WEIGHTAGE = 100;

export const goalInputSchema = z
  .object({
    id: z.string().optional(),
    sourceType: z.enum(["individual", "shared"]).optional(),
    sharedGoalId: z.string().nullable().optional(),
    sharedGoalAssignmentId: z.string().nullable().optional(),
    isSharedGoalPrimaryOwner: z.boolean().optional(),
    sharedGoalSyncStatus: z.enum(["synced", "pending", "conflict"]).nullable().optional(),
    title: z.string().trim().min(1, "Goal title is required."),
    description: z.string().trim().optional(),
    thrustArea: z.enum(THRUST_AREAS, {
      error: "Thrust area is required."
    }),
    uomType: z.enum(ALL_UOM_TYPES, {
      error: "Measurement is required."
    }),
    targetValue: z.number().positive().nullable().optional(),
    targetDate: z.string().trim().nullable().optional(),
    weightage: z
      .number()
      .int()
      .min(MIN_GOAL_WEIGHTAGE, "Goal weightage must be at least 10%.")
      .max(100, "Goal weightage cannot exceed 100%.")
  })
  .superRefine((goal, context) => {
    if (requiresTargetValue(goal.uomType) && !goal.targetValue) {
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

export const goalSubmissionInputSchema = z
  .object({
    employeeId: z.string().min(1, "Employee is required."),
    managerId: z.string().min(1, "Manager is required."),
    cycleId: z.string().min(1, "Goal cycle is required."),
    goals: z
      .array(goalInputSchema)
      .min(1, "At least one goal is required.")
      .max(MAX_GOALS_PER_EMPLOYEE, "An employee can create a maximum of 8 goals.")
  })
  .superRefine((submission, context) => {
    const totalWeightage = submission.goals.reduce(
      (total, goal) => total + goal.weightage,
      0
    );

    if (totalWeightage !== REQUIRED_TOTAL_WEIGHTAGE) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["goals"],
        message: "Total goal weightage must equal 100% before submission."
      });
    }
  });

export type GoalInput = z.infer<typeof goalInputSchema>;
export type GoalSubmissionInput = z.infer<typeof goalSubmissionInputSchema>;
