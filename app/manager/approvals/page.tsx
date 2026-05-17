"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  ClipboardCheck,
  Inbox,
  Scale
} from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { ApprovalActions } from "@/components/manager/ApprovalActions";
import { ApprovalDetailPanel } from "@/components/manager/ApprovalDetailPanel";
import { ApprovalQueue } from "@/components/manager/ApprovalQueue";
import { ReturnForReworkDialog } from "@/components/manager/ReturnForReworkDialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useDemoSession } from "@/lib/auth/session";
import {
  approveGoalSubmission,
  getApprovalQueueItemsForManager,
  returnGoalSubmission,
  type ApprovalQueueItem
} from "@/lib/services/approval-service";
import type { Goal } from "@/lib/types/goal";
import {
  approveGoalSubmissionInputSchema,
  type ApproveGoalSubmissionInput
} from "@/lib/validations/approval";
import type { GoalInput } from "@/lib/validations/goal";
import { cn } from "@/lib/utils";

function toGoalInput(goal: Goal): GoalInput {
  return {
    id: goal.id,
    title: goal.title,
    description: goal.description ?? undefined,
    thrustArea: goal.thrustArea,
    uomType: goal.uomType,
    targetValue: goal.targetValue,
    targetDate: goal.targetDate,
    weightage: goal.weightage
  };
}

type ApprovalMetricCardProps = {
  icon: typeof Inbox;
  label: string;
  value: string;
  helper: string;
  tone: "blue" | "emerald" | "amber" | "slate";
};

const approvalMetricToneStyles: Record<ApprovalMetricCardProps["tone"], string> = {
  blue: "bg-blue-50 text-blue-700",
  emerald: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  slate: "bg-slate-100 text-slate-700"
};

function ApprovalMetricCard({
  helper,
  icon: Icon,
  label,
  tone,
  value
}: ApprovalMetricCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-subtle">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {label}
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-normal text-slate-950">
            {value}
          </p>
        </div>
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
            approvalMetricToneStyles[tone]
          )}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 text-sm leading-5 text-slate-600">{helper}</p>
    </div>
  );
}

function getApprovalValidationMessages(input: ApproveGoalSubmissionInput) {
  const parsedInput = approveGoalSubmissionInputSchema.safeParse(input);

  if (parsedInput.success) {
    return [];
  }

  return Array.from(
    new Set(parsedInput.error.issues.map((issue) => issue.message))
  );
}

function updateQueueItemGoal({
  goalId,
  items,
  selectedSubmissionId,
  updates
}: {
  goalId: string;
  items: ApprovalQueueItem[];
  selectedSubmissionId: string;
  updates: Partial<Pick<Goal, "targetDate" | "targetValue" | "weightage">>;
}) {
  return items.map((item) => {
    if (item.submission.id !== selectedSubmissionId) {
      return item;
    }

    const goals = item.submission.goals.map((goal) =>
      goal.id === goalId
        ? {
            ...goal,
            ...updates
          }
        : goal
    );

    return {
      ...item,
      submission: {
        ...item.submission,
        goals
      },
      goalCount: goals.length,
      totalWeightage: goals.reduce((total, goal) => total + goal.weightage, 0)
    };
  });
}

function ManagerApprovalsWorkspace({ managerId }: { managerId: string }) {
  const [queueItems, setQueueItems] = useState<ApprovalQueueItem[]>(() =>
    getApprovalQueueItemsForManager(managerId)
  );
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(
    () => getApprovalQueueItemsForManager(managerId)[0]?.submission.id ?? null
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);

  const selectedItem =
    queueItems.find((item) => item.submission.id === selectedSubmissionId) ?? null;
  const totalPendingGoals = queueItems.reduce(
    (total, item) => total + item.goalCount,
    0
  );
  const readySubmissions = queueItems.filter(
    (item) =>
      getApprovalValidationMessages({
        submissionId: item.submission.id,
        managerId,
        goals: item.submission.goals.map(toGoalInput)
      }).length === 0
  ).length;
  const averageWeightage =
    queueItems.length > 0
      ? Math.round(
          queueItems.reduce((total, item) => total + item.totalWeightage, 0) /
            queueItems.length
        )
      : 0;
  const validationMessages = useMemo(() => {
    if (!selectedItem) {
      return [];
    }

    return getApprovalValidationMessages({
      submissionId: selectedItem.submission.id,
      managerId,
      goals: selectedItem.submission.goals.map(toGoalInput)
    });
  }, [managerId, selectedItem]);
  const canApprove = Boolean(selectedItem) && validationMessages.length === 0;

  function selectSubmission(submissionId: string) {
    setSelectedSubmissionId(submissionId);
    setSuccessMessage(null);
    setErrorMessage(null);
  }

  function removeSubmissionFromQueue(submissionId: string) {
    const nextItems = queueItems.filter(
      (item) => item.submission.id !== submissionId
    );

    setQueueItems(nextItems);
    setSelectedSubmissionId(nextItems[0]?.submission.id ?? null);
  }

  function handleChangeGoal(
    goalId: string,
    updates: Partial<Pick<Goal, "targetDate" | "targetValue" | "weightage">>
  ) {
    if (!selectedSubmissionId) {
      return;
    }

    setQueueItems((currentItems) =>
      updateQueueItemGoal({
        goalId,
        items: currentItems,
        selectedSubmissionId,
        updates
      })
    );
    setSuccessMessage(null);
    setErrorMessage(null);
  }

  function handleApprove() {
    if (!selectedItem) {
      return;
    }

    const result = approveGoalSubmission({
      submissionId: selectedItem.submission.id,
      managerId,
      goals: selectedItem.submission.goals.map(toGoalInput)
    });

    if (!result.ok) {
      setSuccessMessage(null);
      setErrorMessage(
        result.details?.length ? result.details.join(" ") : result.error
      );
      return;
    }

    removeSubmissionFromQueue(selectedItem.submission.id);
    setErrorMessage(null);
    setSuccessMessage(
      `${selectedItem.employee.name}'s goals were approved. ${result.data.auditLog.summary}`
    );
  }

  function handleReturnForRework(comment: string) {
    if (!selectedItem) {
      return;
    }

    const result = returnGoalSubmission({
      submissionId: selectedItem.submission.id,
      managerId,
      comment
    });

    if (!result.ok) {
      setSuccessMessage(null);
      setErrorMessage(
        result.details?.length ? result.details.join(" ") : result.error
      );
      return;
    }

    removeSubmissionFromQueue(selectedItem.submission.id);
    setIsReturnDialogOpen(false);
    setErrorMessage(null);
    setSuccessMessage(
      `${selectedItem.employee.name}'s goals were returned for rework. ${result.data.auditLog.summary}`
    );
  }

  return (
    <div className="w-full space-y-6">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-subtle">
        <div className="relative p-5 sm:p-7">
          <div className="absolute right-10 top-8 h-52 w-52 rounded-full bg-blue-100/70 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-28 w-80 rounded-full bg-slate-100 blur-2xl" />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border-transparent bg-blue-50 text-blue-700">
                  Manager workspace
                </Badge>
                <Badge className="border-transparent bg-slate-100 text-slate-700">
                  Goal review
                </Badge>
              </div>
              <h1 className="mt-5 text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
                Goal Approvals
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                Review submitted goal plans, adjust target or weightage where
                needed, and send clear decisions back to employees.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:w-80">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Current review queue
              </p>
              <div className="mt-3 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <Inbox className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-semibold text-slate-950">
                    {queueItems.length} pending submission
                    {queueItems.length === 1 ? "" : "s"}
                  </p>
                  <p className="text-sm text-slate-500">
                    {totalPendingGoals} goals awaiting decision
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ApprovalMetricCard
          helper="Submitted goal sets awaiting manager action."
          icon={Inbox}
          label="Pending approvals"
          tone={queueItems.length > 0 ? "amber" : "emerald"}
          value={`${queueItems.length}`}
        />
        <ApprovalMetricCard
          helper="Goals included across the current approval queue."
          icon={ClipboardCheck}
          label="Goals in review"
          tone="blue"
          value={`${totalPendingGoals}`}
        />
        <ApprovalMetricCard
          helper="Submissions meeting weightage and count rules."
          icon={CheckCircle2}
          label="Ready to approve"
          tone={readySubmissions === queueItems.length ? "emerald" : "amber"}
          value={`${readySubmissions}/${queueItems.length}`}
        />
        <ApprovalMetricCard
          helper="Average total planned weightage across pending submissions."
          icon={Scale}
          label="Avg. weightage"
          tone={averageWeightage === 100 ? "emerald" : "slate"}
          value={`${averageWeightage}%`}
        />
      </section>

      {successMessage && !selectedItem ? (
        <Card className="border-emerald-200 bg-emerald-50 shadow-subtle">
          <CardContent className="p-4 text-sm font-medium text-emerald-800">
            {successMessage}
          </CardContent>
        </Card>
      ) : null}

      <div className="grid min-w-0 gap-6 xl:grid-cols-[22rem_minmax(0,1fr)]">
        <ApprovalQueue
          items={queueItems}
          selectedSubmissionId={selectedSubmissionId}
          onSelectSubmission={selectSubmission}
        />

        <div className="min-w-0 space-y-4">
          <ApprovalDetailPanel
            item={selectedItem}
            onChangeGoal={handleChangeGoal}
          />

          {selectedItem ? (
            <ApprovalActions
              canApprove={canApprove}
              errorMessage={errorMessage}
              onApprove={handleApprove}
              onReturnForRework={() => setIsReturnDialogOpen(true)}
              successMessage={successMessage}
              validationMessages={validationMessages}
            />
          ) : null}
        </div>
      </div>

      <ReturnForReworkDialog
        employeeName={selectedItem?.employee.name ?? "this employee"}
        isOpen={isReturnDialogOpen}
        onClose={() => setIsReturnDialogOpen(false)}
        onSubmit={handleReturnForRework}
      />
    </div>
  );
}

function ManagerApprovalsContent() {
  const sessionState = useDemoSession();

  if (sessionState.status === "loading") {
    return (
      <Card>
        <CardContent className="p-5 text-sm text-muted-foreground">
          Loading manager approvals...
        </CardContent>
      </Card>
    );
  }

  if (sessionState.status !== "authenticated") {
    return null;
  }

  return (
    <ManagerApprovalsWorkspace
      key={sessionState.session.user.id}
      managerId={sessionState.session.user.id}
    />
  );
}

export default function ManagerApprovalsPage() {
  return (
    <AppShell contentClassName="mx-0 w-full max-w-none py-4">
      <ManagerApprovalsContent />
    </AppShell>
  );
}


