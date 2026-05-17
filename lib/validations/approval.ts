import { z } from "zod";

import {
  goalInputSchema,
  MAX_GOALS_PER_EMPLOYEE,
  REQUIRED_TOTAL_WEIGHTAGE
} from "@/lib/validations/goal";

export const approveGoalSubmissionInputSchema = z
  .object({
    submissionId: z.string().min(1, "Goal submission is required."),
    managerId: z.string().min(1, "Manager is required."),
    comment: z.string().trim().optional(),
    goals: z
      .array(goalInputSchema)
      .min(1, "At least one goal is required.")
      .max(MAX_GOALS_PER_EMPLOYEE, "An employee can create a maximum of 8 goals.")
      .optional()
  })
  .superRefine((approval, context) => {
    if (!approval.goals) {
      return;
    }

    const totalWeightage = approval.goals.reduce(
      (total, goal) => total + goal.weightage,
      0
    );

    if (totalWeightage !== REQUIRED_TOTAL_WEIGHTAGE) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["goals"],
        message: "Total goal weightage must equal 100% before approval."
      });
    }
  });

export const returnGoalSubmissionInputSchema = z.object({
  submissionId: z.string().min(1, "Goal submission is required."),
  managerId: z.string().min(1, "Manager is required."),
  comment: z.string().trim().min(1, "Return comment is required.")
});

export type ApproveGoalSubmissionInput = z.infer<
  typeof approveGoalSubmissionInputSchema
>;
export type ReturnGoalSubmissionInput = z.infer<
  typeof returnGoalSubmissionInputSchema
>;
