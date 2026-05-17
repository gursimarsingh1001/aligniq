import { GOAL_STATUSES } from "@/lib/constants/goal-status";
import {
  mockGoals,
  mockGoalSubmissions
} from "@/lib/data/mock-goals";
import { mockDepartments, mockUsers } from "@/lib/data/mock-users";
import type { AuditLog } from "@/lib/types/audit";
import type { Goal, GoalSubmissionWithGoals } from "@/lib/types/goal";
import type { AlignIQUser, Department } from "@/lib/types/user";
import { getCurrentIsoTimestamp } from "@/lib/utils/dates";
import {
  approveGoalSubmissionInputSchema,
  returnGoalSubmissionInputSchema,
  type ApproveGoalSubmissionInput,
  type ReturnGoalSubmissionInput
} from "@/lib/validations/approval";
import {
  failure,
  success,
  type ServiceResult
} from "@/lib/services/service-result";

export type ApprovalDecisionResult = {
  submission: GoalSubmissionWithGoals;
  auditLog: AuditLog;
};

export type ApprovalQueueItem = {
  submission: GoalSubmissionWithGoals;
  employee: AlignIQUser;
  department: Department | null;
  goalCount: number;
  totalWeightage: number;
};

function getSubmissionGoals(submissionId: string) {
  return mockGoals.filter((goal) => goal.submissionId === submissionId);
}

function getSubmittedSubmission(submissionId: string, managerId: string) {
  const submission = mockGoalSubmissions.find(
    (item) => item.id === submissionId && item.managerId === managerId
  );

  if (!submission || submission.status !== GOAL_STATUSES.SUBMITTED) {
    return null;
  }

  return submission;
}

function getEmployee(employeeId: string) {
  return mockUsers.find((user) => user.id === employeeId) ?? null;
}

function getDepartment(departmentId: string | null) {
  if (!departmentId) {
    return null;
  }

  return (
    mockDepartments.find((department) => department.id === departmentId) ?? null
  );
}

function buildReviewedGoals({
  goals,
  reviewedGoals,
  now
}: {
  goals: Goal[];
  reviewedGoals?: ApproveGoalSubmissionInput["goals"];
  now: string;
}) {
  return goals.map((goal, index) => {
    const reviewedGoal = reviewedGoals?.find((item) => item.id === goal.id);

    return {
      ...goal,
      targetValue: reviewedGoal?.targetValue ?? goal.targetValue,
      targetDate: reviewedGoal?.targetDate ?? goal.targetDate,
      weightage: reviewedGoal?.weightage ?? goal.weightage,
      status: GOAL_STATUSES.APPROVED,
      lockedAt: now,
      sortOrder: index + 1,
      updatedAt: now
    };
  });
}

export function getPendingApprovalsForManager(managerId: string) {
  return mockGoalSubmissions
    .filter(
      (submission) =>
        submission.managerId === managerId &&
        submission.status === GOAL_STATUSES.SUBMITTED
    )
    .map<GoalSubmissionWithGoals>((submission) => ({
      ...submission,
      goals: getSubmissionGoals(submission.id)
    }));
}

export function getApprovalQueueItemsForManager(managerId: string) {
  return getPendingApprovalsForManager(managerId)
    .map<ApprovalQueueItem | null>((submission) => {
      const employee = getEmployee(submission.employeeId);

      if (!employee) {
        return null;
      }

      return {
        submission,
        employee,
        department: getDepartment(employee.departmentId),
        goalCount: submission.goals.length,
        totalWeightage: submission.goals.reduce(
          (total, goal) => total + goal.weightage,
          0
        )
      };
    })
    .filter((item): item is ApprovalQueueItem => Boolean(item));
}

export function approveGoalSubmission(
  input: ApproveGoalSubmissionInput
): ServiceResult<ApprovalDecisionResult> {
  const parsedInput = approveGoalSubmissionInputSchema.safeParse(input);

  if (!parsedInput.success) {
    return failure(
      "Approval failed validation.",
      parsedInput.error.issues.map((issue) => issue.message)
    );
  }

  const submission = getSubmittedSubmission(
    parsedInput.data.submissionId,
    parsedInput.data.managerId
  );

  if (!submission) {
    return failure("Pending submission was not found for this manager.");
  }

  const now = getCurrentIsoTimestamp();
  const approvedGoals: Goal[] = buildReviewedGoals({
    goals: getSubmissionGoals(submission.id),
    reviewedGoals: parsedInput.data.goals,
    now
  });

  const updatedSubmission: GoalSubmissionWithGoals = {
    ...submission,
    status: GOAL_STATUSES.APPROVED,
    reviewedAt: now,
    reviewedBy: parsedInput.data.managerId,
    managerComment: parsedInput.data.comment ?? null,
    updatedAt: now,
    goals: approvedGoals
  };

  return success({
    submission: updatedSubmission,
    auditLog: {
      id: `local-audit-approve-${submission.id}`,
      actorId: parsedInput.data.managerId,
      entityType: "goal_submission",
      entityId: submission.id,
      action: "approved",
      summary: "Manager approved goal submission.",
      metadata: {
        goalCount: approvedGoals.length,
        totalWeightage: approvedGoals.reduce(
          (total, goal) => total + goal.weightage,
          0
        )
      },
      createdAt: now
    }
  });
}

export function returnGoalSubmission(
  input: ReturnGoalSubmissionInput
): ServiceResult<ApprovalDecisionResult> {
  const parsedInput = returnGoalSubmissionInputSchema.safeParse(input);

  if (!parsedInput.success) {
    return failure(
      "Return for rework failed validation.",
      parsedInput.error.issues.map((issue) => issue.message)
    );
  }

  const submission = getSubmittedSubmission(
    parsedInput.data.submissionId,
    parsedInput.data.managerId
  );

  if (!submission) {
    return failure("Pending submission was not found for this manager.");
  }

  const now = getCurrentIsoTimestamp();
  const returnedGoals: Goal[] = getSubmissionGoals(submission.id).map((goal) => ({
    ...goal,
    status: GOAL_STATUSES.RETURNED,
    lockedAt: null,
    updatedAt: now
  }));

  const updatedSubmission: GoalSubmissionWithGoals = {
    ...submission,
    status: GOAL_STATUSES.RETURNED,
    reviewedAt: now,
    reviewedBy: parsedInput.data.managerId,
    managerComment: parsedInput.data.comment,
    updatedAt: now,
    goals: returnedGoals
  };

  return success({
    submission: updatedSubmission,
    auditLog: {
      id: `local-audit-return-${submission.id}`,
      actorId: parsedInput.data.managerId,
      entityType: "goal_submission",
      entityId: submission.id,
      action: "returned",
      summary: "Manager returned goal submission for rework.",
      metadata: {
        reason: parsedInput.data.comment
      },
      createdAt: now
    }
  });
}
