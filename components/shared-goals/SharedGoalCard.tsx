"use client";

import { RefreshCw, Rocket, Share2, UsersRound } from "lucide-react";

import { SharedGoalStatusBadge } from "@/components/shared-goals/SharedGoalStatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SharedGoalWithAssignments } from "@/lib/types/shared-goal";
import {
  formatDirectionLabel,
  formatTargetDisplay,
  formatUomLabel
} from "@/lib/utils/formatters";

type SharedGoalCardProps = {
  goal: SharedGoalWithAssignments;
  onActivate?: (goalId: string) => void;
};

export function SharedGoalCard({ goal, onActivate }: SharedGoalCardProps) {
  const syncedAssignments = goal.assignments.filter(
    (assignment) => assignment.syncStatus === "synced"
  ).length;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-subtle">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-3">
          <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 sm:flex">
            <Share2 className="h-5 w-5" aria-hidden="true" />
          </span>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <SharedGoalStatusBadge status={goal.status} />
              <Badge className="border-transparent bg-blue-50 text-blue-700">
                Shared
              </Badge>
              <Badge className="gap-1.5 border-transparent bg-slate-100 text-slate-700">
                <UsersRound className="h-3.5 w-3.5" aria-hidden="true" />
                {goal.assignments.length} linked
              </Badge>
              <Badge className="gap-1.5 border-transparent bg-emerald-50 text-emerald-700">
                <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                {syncedAssignments}/{goal.assignments.length} synced
              </Badge>
            </div>

            <h3 className="mt-3 break-words text-lg font-semibold tracking-normal text-slate-950">
              {goal.title}
            </h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {goal.description}
            </p>
          </div>
        </div>

        {goal.status === "draft" && onActivate ? (
          <Button
            type="button"
            className="w-full bg-blue-600 text-white hover:bg-blue-700 sm:w-auto"
            onClick={() => onActivate(goal.id)}
          >
            <Rocket className="h-4 w-4" aria-hidden="true" />
            Push goal
          </Button>
        ) : null}
      </div>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Thrust Area
          </dt>
          <dd className="mt-1 break-words font-medium text-slate-950">
            {goal.thrustArea}
          </dd>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Measurement
          </dt>
          <dd className="mt-1 break-words font-medium text-slate-950">
            {formatUomLabel(goal.uomType)}
          </dd>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Target
          </dt>
          <dd className="mt-1 break-words font-medium text-slate-950">
            {formatTargetDisplay(goal)}
          </dd>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Scoring rule
          </dt>
          <dd className="mt-1 break-words font-medium text-slate-950">
            {formatDirectionLabel(goal.uomType)}
          </dd>
        </div>
      </dl>
    </article>
  );
}
