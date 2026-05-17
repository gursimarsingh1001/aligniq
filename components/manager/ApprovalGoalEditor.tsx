"use client";

import {
  UOM_TYPES
} from "@/lib/constants/uom-types";
import type { Goal } from "@/lib/types/goal";
import {
  formatDirectionLabel,
  formatTargetDisplay,
  formatUomLabel
} from "@/lib/utils/formatters";
import { cn } from "@/lib/utils";

type ApprovalGoalEditorProps = {
  goal: Goal;
  onChangeGoal: (
    goalId: string,
    updates: Partial<Pick<Goal, "targetDate" | "targetValue" | "weightage">>
  ) => void;
};

function getTargetDisplay(goal: Goal) {
  return formatTargetDisplay(goal);
}

function ReadonlyField({
  label,
  value
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-h-[68px] min-w-0 flex-col justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 break-words font-medium text-slate-950">{value}</dd>
    </div>
  );
}

export function ApprovalGoalEditor({
  goal,
  onChangeGoal
}: ApprovalGoalEditorProps) {
  const usesDateTarget = goal.uomType === UOM_TYPES.TIMELINE;
  const canEditNumericTarget =
    goal.uomType === UOM_TYPES.NUMERIC_MIN ||
    goal.uomType === UOM_TYPES.NUMERIC_MAX ||
    goal.uomType === UOM_TYPES.PERCENTAGE_MIN ||
    goal.uomType === UOM_TYPES.PERCENTAGE_MAX;

  return (
    <div className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
        <div className="min-w-0 space-y-4">
          <div className="min-w-0">
            <p className="break-words text-base font-semibold text-slate-950">
              {goal.title}
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {goal.description}
            </p>
          </div>

          <dl className="grid gap-3 sm:grid-cols-3">
            <ReadonlyField label="Thrust Area" value={goal.thrustArea} />
            <ReadonlyField
              label="Measurement"
              value={formatUomLabel(goal.uomType)}
            />
            <ReadonlyField
              label="Scoring rule"
              value={formatDirectionLabel(goal.uomType)}
            />
          </dl>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <label className="flex min-h-[68px] min-w-0 flex-col justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Target
            </span>
            {usesDateTarget ? (
              <input
                type="date"
                value={goal.targetDate ?? ""}
                onChange={(event) =>
                  onChangeGoal(goal.id, {
                    targetDate: event.target.value || null,
                    targetValue: null
                  })
                }
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            ) : (
              <input
                type="number"
                min="0"
                step="0.01"
                value={goal.targetValue ?? ""}
                disabled={!canEditNumericTarget}
                onChange={(event) =>
                  onChangeGoal(goal.id, {
                    targetValue: event.target.value
                      ? Number(event.target.value)
                      : null,
                    targetDate: null
                  })
                }
                placeholder={getTargetDisplay(goal)}
                className={cn(
                  "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
                  !canEditNumericTarget && "cursor-not-allowed bg-slate-100"
                )}
              />
            )}
          </label>

          <label className="flex min-h-[68px] min-w-0 flex-col justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Weightage
            </span>
            <input
              type="number"
              min="10"
              max="100"
              step="1"
              value={goal.weightage}
              onChange={(event) =>
                onChangeGoal(goal.id, {
                  weightage: event.target.value ? Number(event.target.value) : 0
                })
              }
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </label>
        </div>
      </div>
    </div>
  );
}

