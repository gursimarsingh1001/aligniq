import { z } from "zod";

import {
  ALL_CHECKIN_PROGRESS_STATUSES,
  ALL_CHECKIN_WINDOWS
} from "@/lib/constants/checkin-windows";

export const managerCheckinInputSchema = z.object({
  employeeId: z.string().min(1, "Employee is required."),
  managerId: z.string().min(1, "Manager is required."),
  cycleId: z.string().min(1, "Goal cycle is required."),
  quarterLabel: z.string().trim().min(1, "Quarter label is required."),
  comment: z.string().trim().min(1, "Manager check-in comment is required.")
});

export const employeeAchievementInputSchema = z.object({
  goalId: z.string().min(1, "Goal is required."),
  actualValue: z.number().nonnegative().nullable().optional(),
  completionDate: z.string().trim().nullable().optional(),
  progressStatus: z.enum(ALL_CHECKIN_PROGRESS_STATUSES, {
    error: "Progress status is required."
  })
});

export const saveEmployeeAchievementsInputSchema = z.object({
  employeeId: z.string().min(1, "Employee is required."),
  cycleId: z.string().min(1, "Goal cycle is required."),
  checkinWindow: z.enum(ALL_CHECKIN_WINDOWS, {
    error: "Check-in window is required."
  }),
  achievements: z
    .array(employeeAchievementInputSchema)
    .min(1, "At least one achievement update is required.")
});

export type ManagerCheckinInput = z.infer<typeof managerCheckinInputSchema>;
export type SaveEmployeeAchievementsInput = z.infer<
  typeof saveEmployeeAchievementsInputSchema
>;
