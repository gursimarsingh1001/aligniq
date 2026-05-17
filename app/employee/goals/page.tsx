"use client";

import { useMemo, useState } from "react";
import {
  CalendarRange,
  CheckCircle2,
  ClipboardCheck,
  Info,
  Plus,
  Scale,
  Target
} from "lucide-react";

import { GoalEmptyState } from "@/components/goals/GoalEmptyState";
import { GoalForm } from "@/components/goals/GoalForm";
import { GoalSubmissionPanel } from "@/components/goals/GoalSubmissionPanel";
import { GoalTable } from "@/components/goals/GoalTable";
import { GoalStatusBadge } from "@/components/goals/GoalStatusBadge";
import { WeightageSummary } from "@/components/goals/WeightageSummary";
import { AppShell } from "@/components/layout/AppShell";
import { SharedGoalWeightageEditor } from "@/components/shared-goals/SharedGoalWeightageEditor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  EDITABLE_GOAL_STATUSES,
  GOAL_STATUSES,
  type GoalStatus
} from "@/lib/constants/goal-status";
import { useDemoSession } from "@/lib/auth/session";
import {
  getActiveGoalCycle,
  getGoalSubmissionByEmployeeId,
  getManagerIdForEmployee,
  submitEmployeeGoals
} from "@/lib/services/goal-service";
import { getSharedGoalSheetGoalsForEmployee } from "@/lib/services/shared-goal-service";
import type { Goal, GoalSubmissionWithGoals } from "@/lib/types/goal";
import {
  formatDate,
  formatDirectionLabel,
  formatTargetDisplay,
  formatUomLabel
} from "@/lib/utils/formatters";
import {
  goalSubmissionInputSchema,
  MAX_GOALS_PER_EMPLOYEE,
  REQUIRED_TOTAL_WEIGHTAGE,
  type GoalInput
} from "@/lib/validations/goal";
import { cn } from "@/lib/utils";

type FormMode =
  | {
      type: "add";
    }
  | {
      type: "edit";
      goalId: string;
    }
  | null;

type GoalsWorkspaceState = {
  submission: GoalSubmissionWithGoals | null;
  goals: Goal[];
};

function getNow() {
  return new Date().toISOString();
}

function toGoalInput(goal: Goal): GoalInput {
  return {
    id: goal.id,
    sourceType: goal.sourceType,
    sharedGoalId: goal.sharedGoalId,
    sharedGoalAssignmentId: goal.sharedGoalAssignmentId,
    isSharedGoalPrimaryOwner: goal.isSharedGoalPrimaryOwner,
    sharedGoalSyncStatus: goal.sharedGoalSyncStatus,
    title: goal.title,
    description: goal.description ?? undefined,
    thrustArea: goal.thrustArea,
    uomType: goal.uomType,
    targetValue: goal.targetValue,
    targetDate: goal.targetDate,
    weightage: goal.weightage
  };
}

function buildLocalGoal({
  cycleId,
  employeeId,
  goal,
  status,
  submissionId,
  sortOrder
}: {
  cycleId: string;
  employeeId: string;
  goal: GoalInput;
  status: GoalStatus;
  submissionId: string;
  sortOrder: number;
}): Goal {
  const now = getNow();

  return {
    id: goal.id ?? `local-goal-${crypto.randomUUID()}`,
    submissionId,
    employeeId,
    cycleId,
    title: goal.title,
    description: goal.description ?? null,
    thrustArea: goal.thrustArea,
    uomType: goal.uomType,
    targetValue: goal.targetValue ?? null,
    targetDate: goal.targetDate ?? null,
    weightage: goal.weightage,
    status,
    lockedAt: null,
    sortOrder,
    createdAt: now,
    updatedAt: now,
    sourceType: goal.sourceType ?? (goal.sharedGoalId ? "shared" : "individual"),
    sharedGoalId: goal.sharedGoalId ?? null,
    sharedGoalAssignmentId: goal.sharedGoalAssignmentId ?? null,
    isSharedGoalPrimaryOwner: goal.isSharedGoalPrimaryOwner,
    sharedGoalSyncStatus: goal.sharedGoalSyncStatus ?? null
  };
}

function isSharedGoal(goal: Goal) {
  return goal.sourceType === "shared" || Boolean(goal.sharedGoalId);
}

function formatGoalTarget(goal: Goal) {
  return formatTargetDisplay(goal);
}

type GoalMetricCardProps = {
  icon: typeof Target;
  label: string;
  value: string;
  helper: string;
  tone: "blue" | "emerald" | "amber" | "slate";
};

const metricToneStyles: Record<GoalMetricCardProps["tone"], string> = {
  blue: "bg-blue-50 text-blue-700",
  emerald: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  slate: "bg-slate-100 text-slate-700"
};

function GoalMetricCard({
  helper,
  icon: Icon,
  label,
  tone,
  value
}: GoalMetricCardProps) {
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
            metricToneStyles[tone]
          )}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 text-sm leading-5 text-slate-600">{helper}</p>
    </div>
  );
}

function getSubmissionValidationMessages({
  cycleId,
  employeeId,
  goals,
  managerId
}: {
  cycleId: string | null;
  employeeId: string | null;
  goals: Goal[];
  managerId: string | null;
}) {
  if (!employeeId || !managerId || !cycleId) {
    return ["Employee, manager, and active cycle are required before submission."];
  }

  const parsedSubmission = goalSubmissionInputSchema.safeParse({
    employeeId,
    managerId,
    cycleId,
    goals: goals.map(toGoalInput)
  });

  if (parsedSubmission.success) {
    return [];
  }

  return Array.from(
    new Set(parsedSubmission.error.issues.map((issue) => issue.message))
  );
}

function EmployeeGoalsWorkspace({ employeeId }: { employeeId: string }) {
  const activeCycle = getActiveGoalCycle();
  const [workspaceState, setWorkspaceState] = useState<GoalsWorkspaceState>(() => {
    const loadedSubmission = activeCycle
      ? getGoalSubmissionByEmployeeId(employeeId, activeCycle.id)
      : null;

    return {
      submission: loadedSubmission,
      goals: [
        ...(loadedSubmission?.goals ?? []),
        ...getSharedGoalSheetGoalsForEmployee(employeeId)
      ].sort((firstGoal, secondGoal) => firstGoal.sortOrder - secondGoal.sortOrder)
    };
  });
  const [formMode, setFormMode] = useState<FormMode>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { goals, submission } = workspaceState;
  const personalGoals = goals.filter((goal) => !isSharedGoal(goal));
  const sharedGoals = goals.filter(isSharedGoal);
  const totalWeightage = goals.reduce((total, goal) => total + goal.weightage, 0);
  const remainingWeightage = REQUIRED_TOTAL_WEIGHTAGE - totalWeightage;
  const managerId = submission?.managerId ?? getManagerIdForEmployee(employeeId);
  const submissionStatus = submission?.status ?? GOAL_STATUSES.DRAFT;
  const canEdit = (EDITABLE_GOAL_STATUSES as readonly GoalStatus[]).includes(
    submissionStatus
  );
  const submissionId =
    submission?.id ??
    (activeCycle ? `local-submission-${employeeId}-${activeCycle.id}` : "local-submission");
  const editingGoal =
    formMode?.type === "edit"
      ? personalGoals.find((goal) => goal.id === formMode.goalId)
      : undefined;
  const validationMessages = useMemo(
    () =>
      getSubmissionValidationMessages({
        cycleId: activeCycle?.id ?? null,
        employeeId,
        goals,
        managerId
      }),
    [activeCycle?.id, employeeId, goals, managerId]
  );
  const canSubmit =
    canEdit &&
    goals.length > 0 &&
    goals.length <= MAX_GOALS_PER_EMPLOYEE &&
    validationMessages.length === 0;
  const readinessLabel = canSubmit
    ? "Ready"
    : canEdit
      ? "Needs work"
      : "Locked";

  function handleAddGoal() {
    setSuccessMessage(null);
    setErrorMessage(null);

    if (goals.length >= MAX_GOALS_PER_EMPLOYEE) {
      setErrorMessage("An employee can create a maximum of 8 goals.");
      return;
    }

    setFormMode({ type: "add" });
  }

  function handleSaveGoal(goalInput: GoalInput) {
    if (!employeeId || !activeCycle) {
      setErrorMessage("Unable to save goal without an active employee and cycle.");
      return;
    }

    const nextStatus =
      submissionStatus === GOAL_STATUSES.RETURNED
        ? GOAL_STATUSES.RETURNED
        : GOAL_STATUSES.DRAFT;

    if (formMode?.type === "edit") {
      setWorkspaceState((currentState) => ({
        ...currentState,
        goals: currentState.goals.map((goal) =>
          goal.id === formMode.goalId
            ? {
                ...buildLocalGoal({
                  cycleId: activeCycle.id,
                  employeeId,
                  goal: {
                    ...goalInput,
                    id: goal.id
                  },
                  status: nextStatus,
                  submissionId,
                  sortOrder: goal.sortOrder
                }),
                createdAt: goal.createdAt
              }
            : goal
        )
      })
      );
    } else {
      setWorkspaceState((currentState) => ({
        ...currentState,
        goals: [
          ...currentState.goals,
          buildLocalGoal({
            cycleId: activeCycle.id,
            employeeId,
            goal: goalInput,
            status: nextStatus,
            submissionId,
            sortOrder: currentState.goals.length + 1
          })
        ]
      }));
    }

    setSuccessMessage(null);
    setErrorMessage(null);
    setFormMode(null);
  }

  function handleDeleteGoal(goalId: string) {
    setWorkspaceState((currentState) => ({
      ...currentState,
      goals: currentState.goals
        .filter((goal) => goal.id !== goalId)
        .map((goal, index) => ({
          ...goal,
          sortOrder: index + 1
        }))
    }));
    setSuccessMessage(null);
    setErrorMessage(null);
  }

  function handleSharedGoalWeightageChange(goalId: string, weightage: number) {
    setWorkspaceState((currentState) => ({
      ...currentState,
      goals: currentState.goals.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              weightage,
              updatedAt: getNow()
            }
          : goal
      )
    }));
    setSuccessMessage(null);
    setErrorMessage(null);
  }

  function handleSubmitGoals() {
    if (!employeeId || !managerId || !activeCycle) {
      setErrorMessage("Unable to submit without an active employee, manager, and cycle.");
      return;
    }

    const result = submitEmployeeGoals({
      employeeId,
      managerId,
      cycleId: activeCycle.id,
      goals: goals.map(toGoalInput)
    });

    if (!result.ok) {
      setSuccessMessage(null);
      setErrorMessage(
        result.details?.length
          ? result.details.join(" ")
          : result.error
      );
      return;
    }

    setWorkspaceState({
      submission: result.data,
      goals: result.data.goals
    });
    setFormMode(null);
    setErrorMessage(null);
    setSuccessMessage("Goals submitted successfully for manager review.");
  }

  return (
    <div className="w-full space-y-6">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-subtle">
        <div className="relative p-5 sm:p-7">
          <div className="absolute right-8 top-8 h-44 w-44 rounded-full bg-blue-100/70 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-24 w-72 rounded-full bg-slate-100 blur-2xl" />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border-transparent bg-blue-50 text-blue-700">
                  {activeCycle?.name ?? "Current cycle"}
                </Badge>
              </div>
              <h1 className="mt-5 text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
                My Goals
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                Build a clear quarterly goal plan, balance weightage, and submit
                measurable outcomes for manager review.
              </p>
            </div>

            {canEdit ? (
              <Button
                className="w-full shrink-0 lg:w-auto"
                onClick={handleAddGoal}
                disabled={goals.length >= MAX_GOALS_PER_EMPLOYEE}
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add goal
              </Button>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 border-t border-slate-200 bg-slate-50/70 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-4">
          <GoalMetricCard
            icon={Target}
            label="Total goals"
            value={`${goals.length}/8`}
            helper={`${personalGoals.length} individual, ${sharedGoals.length} shared`}
            tone="blue"
          />
          <GoalMetricCard
            icon={Scale}
            label="Weightage"
            value={`${totalWeightage}%`}
            helper={
              remainingWeightage === 0
                ? "Balanced for submission"
                : remainingWeightage > 0
                  ? `${remainingWeightage}% still available`
                  : `${Math.abs(remainingWeightage)}% over limit`
            }
            tone={remainingWeightage === 0 ? "emerald" : "amber"}
          />
          <GoalMetricCard
            icon={ClipboardCheck}
            label="Submission"
            value={readinessLabel}
            helper={
              canSubmit
                ? "All validation rules are satisfied"
                : canEdit
                  ? "Resolve validation items before submitting"
                  : "Goals are not editable in this state"
            }
            tone={canSubmit ? "emerald" : canEdit ? "amber" : "slate"}
          />
          <GoalMetricCard
            icon={CalendarRange}
            label="Cycle"
            value={activeCycle?.name ?? "Active"}
            helper={
              activeCycle
                ? `Ends ${formatDate(activeCycle.endsOn)}`
                : "Active planning cycle"
            }
            tone="slate"
          />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-6">
          {formMode ? (
            <GoalForm
              key={formMode.type === "edit" ? formMode.goalId : "add-goal"}
              initialGoal={editingGoal ? toGoalInput(editingGoal) : undefined}
              onCancel={() => setFormMode(null)}
              onSave={handleSaveGoal}
            />
          ) : null}

          <Card className="border-slate-200 bg-white shadow-subtle">
            <CardHeader className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
              <div>
                <CardTitle className="text-xl text-slate-950">
                  Goal plan
                </CardTitle>
                <CardDescription>
                  Review goal details before submitting. Submitted or approved
                  goals cannot be edited by employees.
                </CardDescription>
              </div>
              <Badge className="w-fit border-transparent bg-slate-100 text-slate-700">
                {personalGoals.length} individual goals
              </Badge>
            </CardHeader>
            <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
              {personalGoals.length > 0 ? (
                <GoalTable
                  canEdit={canEdit}
                  goals={personalGoals}
                  onDeleteGoal={handleDeleteGoal}
                  onEditGoal={(goal) => {
                    setSuccessMessage(null);
                    setErrorMessage(null);
                    setFormMode({ type: "edit", goalId: goal.id });
                  }}
                />
              ) : (
                <GoalEmptyState canEdit={canEdit} onAddGoal={handleAddGoal} />
              )}
            </CardContent>
          </Card>

          {sharedGoals.length > 0 ? (
            <Card className="border-slate-200 bg-white shadow-subtle">
              <CardHeader className="p-5 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <CardTitle className="text-xl text-slate-950">
                      Shared goals
                    </CardTitle>
                    <CardDescription>
                      Assigned goals are read-only except for weightage while
                      your plan is draft or returned.
                    </CardDescription>
                  </div>
                  <Badge className="w-fit border-transparent bg-blue-50 text-blue-700">
                    {sharedGoals.length} shared
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-5 pt-0 sm:p-6 sm:pt-0">
                {sharedGoals.map((goal) => (
                  <article
                    className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
                    key={goal.id}
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge className="border-transparent bg-blue-50 text-blue-700">
                            Shared
                          </Badge>
                          <GoalStatusBadge status={goal.status} />
                        </div>
                        <h3 className="mt-3 break-words text-base font-semibold text-slate-950">
                          {goal.title}
                        </h3>
                        {goal.description ? (
                          <p className="mt-1 text-sm leading-6 text-slate-600">
                            {goal.description}
                          </p>
                        ) : null}
                        <p className="mt-3 rounded-xl bg-white px-3 py-2 text-sm text-slate-600 ring-1 ring-slate-200">
                          This shared goal was assigned by your manager/admin. You
                          can adjust weightage only.
                        </p>
                      </div>
                      <div className="w-full rounded-2xl border border-slate-200 bg-white p-3 lg:w-72">
                        <SharedGoalWeightageEditor
                          disabled={!canEdit}
                          value={goal.weightage}
                          onSave={(weightage) =>
                            handleSharedGoalWeightageChange(goal.id, weightage)
                          }
                        />
                      </div>
                    </div>

                    <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-4">
                      <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                        <dt className="text-xs font-medium text-slate-500">
                          Thrust Area
                        </dt>
                        <dd className="mt-1 break-words font-semibold text-slate-950">
                          {goal.thrustArea}
                        </dd>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                        <dt className="text-xs font-medium text-slate-500">
                          Measurement
                        </dt>
                        <dd className="mt-1 font-semibold text-slate-950">
                          {formatUomLabel(goal.uomType)}
                        </dd>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                        <dt className="text-xs font-medium text-slate-500">
                          Target
                        </dt>
                        <dd className="mt-1 font-semibold text-slate-950">
                          {formatGoalTarget(goal)}
                        </dd>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                        <dt className="text-xs font-medium text-slate-500">
                          Scoring rule
                        </dt>
                        <dd className="mt-1 break-words font-semibold text-slate-950">
                          {formatDirectionLabel(goal.uomType)}
                        </dd>
                      </div>
                    </dl>
                  </article>
                ))}
              </CardContent>
            </Card>
          ) : null}
        </div>

        <aside className="min-w-0 space-y-6 xl:sticky xl:top-24 xl:self-start">
          <WeightageSummary goals={goals} />

          <GoalSubmissionPanel
            canEdit={canEdit}
            canSubmit={canSubmit}
            errorMessage={errorMessage}
            onSubmit={handleSubmitGoals}
            status={submissionStatus}
            successMessage={successMessage}
            validationMessages={canEdit ? validationMessages : []}
          />

          <Card className="border-slate-200 bg-white shadow-subtle">
            <CardHeader className="p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <Info className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <CardTitle className="text-base text-slate-950">
                    Submission rules
                  </CardTitle>
                  <CardDescription>Requirements before review.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 p-5 pt-0 text-sm text-slate-600">
              <div className="flex gap-3 rounded-xl bg-slate-50 p-3">
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
                  aria-hidden="true"
                />
                <span>Total weightage must equal exactly 100%.</span>
              </div>
              <div className="flex gap-3 rounded-xl bg-slate-50 p-3">
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
                  aria-hidden="true"
                />
                <span>Each goal must carry at least 10% weightage.</span>
              </div>
              <div className="flex gap-3 rounded-xl bg-slate-50 p-3">
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
                  aria-hidden="true"
                />
                <span>Approved goals are locked after manager approval.</span>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function EmployeeGoalsContent() {
  const sessionState = useDemoSession();

  if (sessionState.status === "loading") {
    return (
      <Card>
        <CardContent className="p-5 text-sm text-muted-foreground">
          Loading employee goals...
        </CardContent>
      </Card>
    );
  }

  if (sessionState.status !== "authenticated") {
    return null;
  }

  return (
    <EmployeeGoalsWorkspace
      key={sessionState.session.user.id}
      employeeId={sessionState.session.user.id}
    />
  );
}

export default function EmployeeGoalsPage() {
  return (
    <AppShell>
      <EmployeeGoalsContent />
    </AppShell>
  );
}


