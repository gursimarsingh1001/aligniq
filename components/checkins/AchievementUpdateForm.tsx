"use client";

import { useState } from "react";

import {
  ALL_CHECKIN_PROGRESS_STATUSES,
  CHECKIN_PROGRESS_STATUSES,
  CHECKIN_PROGRESS_STATUS_LABELS,
  type CheckinProgressStatus
} from "@/lib/constants/checkin-windows";
import { ProgressScoreBadge } from "@/components/checkins/ProgressScoreBadge";
import { Badge } from "@/components/ui/badge";
import { UOM_TYPES } from "@/lib/constants/uom-types";
import type { EmployeeQuarterlyAchievement } from "@/lib/types/checkin";
import type { Goal } from "@/lib/types/goal";
import {
  formatDate,
  formatTargetDisplay,
  formatUomLabel
} from "@/lib/utils/formatters";
import { getDisplayProgressScore } from "@/lib/utils/progress";

export type AchievementDraft = {
  actualValue: number | null;
  completionDate: string | null;
  isProgressStatusManual?: boolean;
  progressStatus: CheckinProgressStatus;
};

type AchievementUpdateFormProps = {
  draft: AchievementDraft;
  goal: Goal;
  isReadOnly?: boolean;
  progressScore: number;
  savedAchievement: EmployeeQuarterlyAchievement | null;
  onChange: (goalId: string, draft: AchievementDraft) => void;
};

function getPlannedTarget(goal: Goal) {
  return formatTargetDisplay(goal);
}

function ReadonlyField({
  label,
  value,
  helper
}: {
  label: string;
  value: string;
  helper?: string;
}) {
  return (
    <div className="flex min-h-[64px] flex-col justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 break-words font-semibold text-slate-950">{value}</p>
      {helper ? (
        <p className="mt-1 text-xs leading-5 text-slate-500">{helper}</p>
      ) : null}
    </div>
  );
}

function getSuggestedProgressStatus(displayProgressScore: number) {
  if (displayProgressScore >= 100) {
    return CHECKIN_PROGRESS_STATUSES.COMPLETED;
  }

  if (displayProgressScore >= 50) {
    return CHECKIN_PROGRESS_STATUSES.ON_TRACK;
  }

  return CHECKIN_PROGRESS_STATUSES.NOT_STARTED;
}

export function AchievementUpdateForm({
  draft,
  goal,
  isReadOnly = false,
  progressScore,
  savedAchievement,
  onChange
}: AchievementUpdateFormProps) {
  const isTimeline = goal.uomType === UOM_TYPES.TIMELINE;
  const isSyncedSharedGoal =
    Boolean(goal.sharedGoalId) && !goal.isSharedGoalPrimaryOwner;
  const actualValue = draft.actualValue ?? "";
  const displayProgressScore = getDisplayProgressScore(progressScore);
  const [isStatusEditable, setIsStatusEditable] = useState(false);
  const suggestedProgressStatus = getSuggestedProgressStatus(displayProgressScore);
  const isCompletedByScore =
    suggestedProgressStatus === CHECKIN_PROGRESS_STATUSES.COMPLETED;
  const displayedProgressStatus =
    draft.isProgressStatusManual && !isCompletedByScore
      ? draft.progressStatus
      : suggestedProgressStatus;
  const canEditStatus =
    !isReadOnly && !isSyncedSharedGoal && !isCompletedByScore;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70">
      <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_440px]">
        <div className="min-w-0 space-y-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="border-transparent bg-blue-50 text-blue-700">
                {goal.weightage}% weight
              </Badge>
              {isSyncedSharedGoal ? (
                <Badge className="border-transparent bg-slate-100 text-slate-700">
                  Synced
                </Badge>
              ) : null}
            </div>
            <p className="mt-3 break-words text-base font-semibold text-slate-950">
              {goal.title}
            </p>
            {goal.description ? (
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {goal.description}
              </p>
            ) : null}
            {isSyncedSharedGoal ? (
              <p className="mt-3 rounded-xl bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">
                Achievement is synced from the primary owner.
              </p>
            ) : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <ReadonlyField label="Planned target" value={getPlannedTarget(goal)} />
            <ReadonlyField
              label="Measurement"
              value={formatUomLabel(goal.uomType)}
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {isTimeline ? (
            <ReadonlyField
              helper="Actual achievement is based on completion date."
              label="Actual achievement"
              value={
                draft.completionDate
                  ? formatDate(draft.completionDate)
                  : "Not recorded"
              }
            />
          ) : (
            <label className="flex min-h-[64px] flex-col justify-center gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Actual achievement
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={actualValue}
                disabled={isReadOnly || isSyncedSharedGoal}
                placeholder="Enter actual achievement"
                onChange={(event) =>
                  onChange(goal.id, {
                    ...draft,
                    actualValue: event.target.value
                      ? Number(event.target.value)
                      : null,
                    isProgressStatusManual: false
                  })
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-100"
              />
            </label>
          )}

          <label className="flex min-h-[64px] flex-col justify-center gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Completion date
            </span>
            <input
              type="date"
              value={draft.completionDate ?? ""}
              disabled={isReadOnly || isSyncedSharedGoal}
              onChange={(event) =>
                onChange(goal.id, {
                  ...draft,
                  completionDate: event.target.value || null,
                  isProgressStatusManual: false
                })
              }
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-100"
            />
          </label>

          <label className="flex min-h-[64px] flex-col justify-center gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Status
            </span>
            <div className="flex gap-2">
              {canEditStatus ? (
                <button
                  type="button"
                  className="h-11 shrink-0 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
                  onClick={() =>
                    setIsStatusEditable((currentValue) => !currentValue)
                  }
                >
                  {isStatusEditable ? "Lock" : "Edit"}
                </button>
              ) : null}
              <select
                value={displayedProgressStatus}
                disabled={!canEditStatus || !isStatusEditable}
                onChange={(event) =>
                  onChange(goal.id, {
                    ...draft,
                    isProgressStatusManual: true,
                    progressStatus: event.target.value as CheckinProgressStatus
                  })
                }
                className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-100"
              >
                {ALL_CHECKIN_PROGRESS_STATUSES.map((status) => (
                  <option value={status} key={status}>
                    {CHECKIN_PROGRESS_STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </div>
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-200 bg-white px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-medium text-slate-500">
          {savedAchievement
            ? `Last saved ${formatDate(savedAchievement.updatedAt)}`
            : "Not saved yet"}
        </p>
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <p className="font-semibold text-slate-950">
            Current score: {displayProgressScore.toFixed(1)}%
          </p>
          <ProgressScoreBadge score={progressScore} />
        </div>
      </div>
    </div>
  );
}

