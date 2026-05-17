"use client";

import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Network,
  RefreshCw,
  Share2
} from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { SharedGoalAssignmentTable } from "@/components/shared-goals/SharedGoalAssignmentTable";
import { SharedGoalCard } from "@/components/shared-goals/SharedGoalCard";
import { SharedGoalEmptyState } from "@/components/shared-goals/SharedGoalEmptyState";
import { SharedGoalForm } from "@/components/shared-goals/SharedGoalForm";
import { SharedGoalMetricCard } from "@/components/shared-goals/SharedGoalMetricCard";
import { SharedGoalSyncPanel } from "@/components/shared-goals/SharedGoalSyncPanel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useDemoSession } from "@/lib/auth/session";
import { ROLES } from "@/lib/constants/roles";
import { mockDepartments, mockUsers } from "@/lib/data/mock-users";
import {
  activateSharedGoal,
  createSharedGoal,
  getSharedGoalsForManager,
  updateSharedGoalWeightage
} from "@/lib/services/shared-goal-service";
import type {
  SharedGoalCreateInput,
  SharedGoalWithAssignments
} from "@/lib/types/shared-goal";

function ManagerSharedGoalsWorkspace({ managerId }: { managerId: string }) {
  const [sharedGoals, setSharedGoals] = useState<SharedGoalWithAssignments[]>(() =>
    getSharedGoalsForManager(managerId)
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const employees = mockUsers.filter(
    (user) => user.role === ROLES.EMPLOYEE && user.managerId === managerId
  );
  const activeGoals = sharedGoals.filter((goal) => goal.status === "active").length;
  const draftGoals = sharedGoals.filter((goal) => goal.status === "draft").length;
  const assignmentCount = sharedGoals.reduce(
    (total, goal) => total + goal.assignments.length,
    0
  );
  const syncedAssignments = sharedGoals.reduce(
    (total, goal) =>
      total +
      goal.assignments.filter((assignment) => assignment.syncStatus === "synced")
        .length,
    0
  );

  function replaceSharedGoal(nextGoal: SharedGoalWithAssignments) {
    setSharedGoals((currentGoals) =>
      currentGoals.map((goal) => (goal.id === nextGoal.id ? nextGoal : goal))
    );
  }

  function handleCreateSharedGoal(input: SharedGoalCreateInput) {
    const result = createSharedGoal(input, managerId);

    if (!result.ok) {
      setSuccessMessage(null);
      setErrorMessage(result.details?.length ? result.details.join(" ") : result.error);
      return;
    }

    setSharedGoals((currentGoals) => [result.data.sharedGoal, ...currentGoals]);
    setErrorMessage(null);
    setSuccessMessage(result.data.auditLog.summary);
  }

  function handleActivateSharedGoal(goalId: string) {
    const goal = sharedGoals.find((item) => item.id === goalId);

    if (!goal) {
      return;
    }

    const result = activateSharedGoal(goal, managerId);

    if (!result.ok) {
      setSuccessMessage(null);
      setErrorMessage(result.details?.length ? result.details.join(" ") : result.error);
      return;
    }

    replaceSharedGoal(result.data.sharedGoal);
    setErrorMessage(null);
    setSuccessMessage(result.data.auditLog.summary);
  }

  function handleChangeWeightage(
    goalId: string,
    employeeId: string,
    weightage: number
  ) {
    const goal = sharedGoals.find((item) => item.id === goalId);

    if (!goal) {
      return;
    }

    const result = updateSharedGoalWeightage(
      goal,
      employeeId,
      weightage,
      managerId
    );

    if (!result.ok) {
      setSuccessMessage(null);
      setErrorMessage(result.details?.length ? result.details.join(" ") : result.error);
      return;
    }

    replaceSharedGoal(result.data.sharedGoal);
    setErrorMessage(null);
    setSuccessMessage(result.data.auditLog.summary);
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
                  Shared goal orchestration
                </Badge>
              </div>
              <h1 className="mt-5 text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
                Shared Goals
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                Create departmental KPIs, assign linked ownership, and keep
                achievement updates synchronized from the primary owner.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:w-80">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Team coverage
              </p>
              <div className="mt-3 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <Network className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-semibold text-slate-950">
                    {assignmentCount} linked assignments
                  </p>
                  <p className="text-sm text-slate-500">
                    {employees.length} employees available for assignment
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SharedGoalMetricCard
          helper="Departmental KPIs configured for this team."
          icon={Share2}
          label="Shared goals"
          tone="blue"
          value={`${sharedGoals.length}`}
        />
        <SharedGoalMetricCard
          helper="Goals already pushed to linked employee sheets."
          icon={CheckCircle2}
          label="Active goals"
          tone={activeGoals > 0 ? "emerald" : "slate"}
          value={`${activeGoals}`}
        />
        <SharedGoalMetricCard
          helper="Goals still being prepared before push."
          icon={AlertCircle}
          label="Draft goals"
          tone={draftGoals > 0 ? "amber" : "slate"}
          value={`${draftGoals}`}
        />
        <SharedGoalMetricCard
          helper="Assignments currently reflecting primary owner achievement."
          icon={RefreshCw}
          label="Synced links"
          tone={syncedAssignments === assignmentCount ? "emerald" : "amber"}
          value={`${syncedAssignments}/${assignmentCount}`}
        />
      </section>

      {successMessage ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
          {successMessage}
        </div>
      ) : null}

      {errorMessage ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <div className="grid min-w-0 gap-6 xl:grid-cols-[25rem_minmax(0,1fr)]">
        <SharedGoalForm
          departments={mockDepartments}
          employees={employees}
          onCreate={handleCreateSharedGoal}
        />

        <Card className="min-w-0 border-slate-200 bg-white shadow-subtle">
          <CardContent className="space-y-5 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-normal text-slate-950">
                  Team shared goals
                </h2>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
                  Recipients can adjust weightage only. Title, target,
                  measurement, and thrust area remain read-only on employee goal
                  sheets.
                </p>
              </div>
              <Badge className="w-fit border-transparent bg-blue-50 text-blue-700">
                {sharedGoals.length} configured
              </Badge>
            </div>

            {sharedGoals.length > 0 ? (
              sharedGoals.map((goal) => (
                <section
                  className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50/70 p-3 sm:p-4"
                  key={goal.id}
                >
                  <SharedGoalCard
                    goal={goal}
                    onActivate={handleActivateSharedGoal}
                  />
                  <div className="grid min-w-0 gap-4 2xl:grid-cols-[minmax(0,1fr)_24rem]">
                    <SharedGoalAssignmentTable
                      departments={mockDepartments}
                      employees={mockUsers}
                      goal={goal}
                      onChangeWeightage={(employeeId, weightage) =>
                        handleChangeWeightage(goal.id, employeeId, weightage)
                      }
                    />
                    <SharedGoalSyncPanel employees={mockUsers} goal={goal} />
                  </div>
                </section>
              ))
            ) : (
              <SharedGoalEmptyState
                title="No shared goals yet"
                description="Create a shared departmental KPI to push common goals to linked employee sheets."
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ManagerSharedGoalsContent() {
  const sessionState = useDemoSession();

  if (sessionState.status === "loading") {
    return (
      <Card>
        <CardContent className="p-5 text-sm text-muted-foreground">
          Loading shared goals...
        </CardContent>
      </Card>
    );
  }

  if (sessionState.status !== "authenticated") {
    return null;
  }

  return (
    <ManagerSharedGoalsWorkspace
      key={sessionState.session.user.id}
      managerId={sessionState.session.user.id}
    />
  );
}

export default function ManagerSharedGoalsPage() {
  return (
    <AppShell contentClassName="mx-0 w-full max-w-none py-4">
      <ManagerSharedGoalsContent />
    </AppShell>
  );
}
