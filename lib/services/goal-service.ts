import { GOAL_STATUSES, isGoalLocked } from "@/lib/constants/goal-status";
import {
  mockGoalCycles,
  mockGoals,
  mockQuarterlyUpdates
} from "@/lib/data/mock-goals";
import { mockUsers } from "@/lib/data/mock-users";
import type {
  Goal,
  GoalSubmissionWithGoals,
  QuarterlyUpdate
} from "@/lib/types/goal";
import {
  calculateProgressScore
} from "@/lib/utils/progress";
import { getCurrentIsoTimestamp } from "@/lib/utils/dates";
import {
  goalSubmissionInputSchema,
  MAX_GOALS_PER_EMPLOYEE,
  REQUIRED_TOTAL_WEIGHTAGE,
  type GoalInput,
  type GoalSubmissionInput
} from "@/lib/validations/goal";
import {
  failure,
  success,
  type ServiceResult
} from "@/lib/services/service-result";
import {
  getStoredEvaluationState,
  upsertEvaluationGoalSubmission
} from "@/lib/storage/local-store";

type WeightageGoal = Pick<GoalInput, "weightage">;

export type WeightageValidationResult = {
  isValid: boolean;
  goalCount: number;
  totalWeightage: number;
  errors: string[];
};

export type SaveQuarterlyUpdateInput = {
  goalId: string;
  employeeId: string;
  actualValue?: number | null;
  completionDate?: string | null;
  employeeComment?: string | null;
};

export function getActiveGoalCycle() {
  return mockGoalCycles.find((cycle) => cycle.status === "active") ?? null;
}

export function getManagerIdForEmployee(employeeId: string) {
  return mockUsers.find((user) => user.id === employeeId)?.managerId ?? null;
}

function getEvaluationGoalSubmissions() {
  return getStoredEvaluationState().goalSubmissions;
}

export function getGoalsByEmployeeId(employeeId: string, cycleId?: string) {
  return getEvaluationGoalSubmissions()
    .flatMap((submission) => submission.goals)
    .filter(
      (goal) =>
        goal.employeeId === employeeId && (!cycleId || goal.cycleId === cycleId)
    )
    .sort((firstGoal, secondGoal) => firstGoal.sortOrder - secondGoal.sortOrder);
}

export function getGoalSubmissionByEmployeeId(
  employeeId: string,
  cycleId = getActiveGoalCycle()?.id
): GoalSubmissionWithGoals | null {
  const submission = getEvaluationGoalSubmissions().find(
    (item) => item.employeeId === employeeId && item.cycleId === cycleId
  );

  if (!submission) {
    return null;
  }

  return submission;
}

export function getQuarterlyUpdatesByEmployeeId(
  employeeId: string,
  cycleId?: string
) {
  return mockQuarterlyUpdates.filter(
    (update) =>
      update.employeeId === employeeId && (!cycleId || update.cycleId === cycleId)
  );
}

export function validateGoalWeightage(
  goals: WeightageGoal[]
): WeightageValidationResult {
  const totalWeightage = goals.reduce((total, goal) => total + goal.weightage, 0);
  const errors: string[] = [];

  if (goals.length > MAX_GOALS_PER_EMPLOYEE) {
    errors.push("An employee can create a maximum of 8 goals.");
  }

  if (totalWeightage !== REQUIRED_TOTAL_WEIGHTAGE) {
    errors.push("Total goal weightage must equal 100% before submission.");
  }

  return {
    isValid: errors.length === 0,
    goalCount: goals.length,
    totalWeightage,
    errors
  };
}

export function submitEmployeeGoals(
  input: GoalSubmissionInput
): ServiceResult<GoalSubmissionWithGoals> {
  const parsedInput = goalSubmissionInputSchema.safeParse(input);

  if (!parsedInput.success) {
    return failure(
      "Goal submission failed validation.",
      parsedInput.error.issues.map((issue) => issue.message)
    );
  }

  const existingSubmission = getGoalSubmissionByEmployeeId(
    parsedInput.data.employeeId,
    parsedInput.data.cycleId
  );

  if (existingSubmission && isGoalLocked(existingSubmission.status)) {
    return failure("Approved goals are locked and cannot be submitted again.");
  }

  const now = getCurrentIsoTimestamp();
  const submissionId = `local-submission-${parsedInput.data.employeeId}-${parsedInput.data.cycleId}`;

  const goals: Goal[] = parsedInput.data.goals.map((goal, index) => ({
    id: goal.id ?? `local-goal-${parsedInput.data.employeeId}-${index + 1}`,
    submissionId,
    employeeId: parsedInput.data.employeeId,
    cycleId: parsedInput.data.cycleId,
    title: goal.title,
    description: goal.description ?? null,
    thrustArea: goal.thrustArea,
    uomType: goal.uomType,
    targetValue: goal.targetValue ?? null,
    targetDate: goal.targetDate ?? null,
    weightage: goal.weightage,
    status: GOAL_STATUSES.SUBMITTED,
    lockedAt: null,
    sortOrder: index + 1,
    createdAt: now,
    updatedAt: now,
    sourceType: goal.sourceType ?? (goal.sharedGoalId ? "shared" : "individual"),
    sharedGoalId: goal.sharedGoalId ?? null,
    sharedGoalAssignmentId: goal.sharedGoalAssignmentId ?? null,
    isSharedGoalPrimaryOwner: goal.isSharedGoalPrimaryOwner,
    sharedGoalSyncStatus: goal.sharedGoalSyncStatus ?? null
  }));

  const updatedSubmission: GoalSubmissionWithGoals = {
    id: submissionId,
    employeeId: parsedInput.data.employeeId,
    managerId: parsedInput.data.managerId,
    cycleId: parsedInput.data.cycleId,
    status: GOAL_STATUSES.SUBMITTED,
    submittedAt: now,
    reviewedAt: null,
    reviewedBy: null,
    managerComment: null,
    createdAt: now,
    updatedAt: now,
    goals
  };

  upsertEvaluationGoalSubmission(updatedSubmission);

  return success(updatedSubmission);
}

export function persistEmployeeGoalSubmission(
  submission: GoalSubmissionWithGoals
) {
  upsertEvaluationGoalSubmission(submission);
}

export function saveQuarterlyUpdate(
  input: SaveQuarterlyUpdateInput
): ServiceResult<QuarterlyUpdate> {
  const goal = mockGoals.find((item) => item.id === input.goalId);

  if (!goal || goal.employeeId !== input.employeeId) {
    return failure("Goal was not found for this employee.");
  }

  if (!isGoalLocked(goal.status)) {
    return failure("Quarterly updates can only be saved for approved goals.");
  }

  const now = getCurrentIsoTimestamp();
  const existingUpdate = mockQuarterlyUpdates.find(
    (update) => update.goalId === input.goalId
  );
  const progressScore = calculateProgressScore(
    goal,
    input.actualValue,
    input.completionDate
  );

  return success({
    id: existingUpdate?.id ?? `local-update-${input.goalId}`,
    goalId: input.goalId,
    employeeId: input.employeeId,
    cycleId: goal.cycleId,
    actualValue: input.actualValue ?? null,
    completionDate: input.completionDate ?? null,
    progressScore,
    employeeComment: input.employeeComment ?? null,
    createdAt: existingUpdate?.createdAt ?? now,
    updatedAt: now
  });
}
