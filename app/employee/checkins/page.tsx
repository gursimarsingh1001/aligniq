"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import {
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  Lock,
  TrendingUp
} from "lucide-react";

import { AchievementDraft } from "@/components/checkins/AchievementUpdateForm";
import { EmployeeCheckinPanel } from "@/components/checkins/EmployeeCheckinPanel";
import { QuarterSelector } from "@/components/checkins/QuarterSelector";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useDemoSession } from "@/lib/auth/session";
import {
  CHECKIN_PROGRESS_STATUSES,
  CHECKIN_WINDOWS,
  type CheckinWindow
} from "@/lib/constants/checkin-windows";
import { UOM_TYPES } from "@/lib/constants/uom-types";
import {
  getApprovedGoalsForEmployeeCheckin,
  getEmployeeQuarterlyAchievements,
  saveEmployeeQuarterlyAchievements
} from "@/lib/services/checkin-service";
import { getActiveGoalCycle } from "@/lib/services/goal-service";
import type { EmployeeQuarterlyAchievement } from "@/lib/types/checkin";
import type { Goal } from "@/lib/types/goal";
import { cn } from "@/lib/utils";
import {
  getActiveCycleWindowServerSnapshot,
  getActiveCycleWindowSnapshot,
  isQuarterEditable,
  subscribeToActiveCycleWindow
} from "@/lib/utils/cycle-windows";
import { calculateProgressScore } from "@/lib/utils/progress";
import { getDisplayProgressScore } from "@/lib/utils/progress";

type DraftsByWindow = Partial<Record<CheckinWindow, Record<string, AchievementDraft>>>;
type AchievementsByWindow = Partial<
  Record<CheckinWindow, EmployeeQuarterlyAchievement[]>
>;

function buildDrafts(
  goals: Goal[],
  achievements: EmployeeQuarterlyAchievement[]
) {
  return goals.reduce<Record<string, AchievementDraft>>((drafts, goal) => {
    const achievement = achievements.find((item) => item.goalId === goal.id);

    drafts[goal.id] = {
      actualValue: achievement?.actualValue ?? null,
      completionDate: achievement?.completionDate ?? null,
      isProgressStatusManual: false,
      progressStatus:
        achievement?.progressStatus ?? CHECKIN_PROGRESS_STATUSES.NOT_STARTED
    };

    return drafts;
  }, {});
}

function getSuggestedProgressStatus(progressScore: number) {
  const displayProgressScore = getDisplayProgressScore(progressScore);

  if (displayProgressScore >= 100) {
    return CHECKIN_PROGRESS_STATUSES.COMPLETED;
  }

  if (displayProgressScore >= 50) {
    return CHECKIN_PROGRESS_STATUSES.ON_TRACK;
  }

  return CHECKIN_PROGRESS_STATUSES.NOT_STARTED;
}

function getEffectiveProgressStatus(
  draft: AchievementDraft | undefined,
  progressScore: number
) {
  const suggestedProgressStatus = getSuggestedProgressStatus(progressScore);

  if (suggestedProgressStatus === CHECKIN_PROGRESS_STATUSES.COMPLETED) {
    return CHECKIN_PROGRESS_STATUSES.COMPLETED;
  }

  return draft?.isProgressStatusManual
    ? draft.progressStatus
    : suggestedProgressStatus;
}

type CheckinMetricCardProps = {
  icon: typeof ClipboardCheck;
  label: string;
  value: string;
  helper: string;
  tone: "blue" | "emerald" | "amber" | "slate";
};

const metricToneStyles: Record<CheckinMetricCardProps["tone"], string> = {
  blue: "bg-blue-50 text-blue-700",
  emerald: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  slate: "bg-slate-100 text-slate-700"
};

function CheckinMetricCard({
  helper,
  icon: Icon,
  label,
  tone,
  value
}: CheckinMetricCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-subtle">
      <div className="flex items-start justify-between gap-4">
        <div>
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

function EmployeeCheckinsWorkspace({ employeeId }: { employeeId: string }) {
  const activeCycle = getActiveGoalCycle();
  const activeWindow = useSyncExternalStore(
    subscribeToActiveCycleWindow,
    getActiveCycleWindowSnapshot,
    getActiveCycleWindowServerSnapshot
  );
  const goals = useMemo(
    () => getApprovedGoalsForEmployeeCheckin(employeeId),
    [employeeId]
  );
  const [selectedQuarter, setSelectedQuarter] = useState<CheckinWindow>(
    CHECKIN_WINDOWS.Q2
  );
  const [draftsByWindow, setDraftsByWindow] = useState<DraftsByWindow>(() => ({
    [CHECKIN_WINDOWS.Q2]: buildDrafts(
      goals,
      getEmployeeQuarterlyAchievements(employeeId, CHECKIN_WINDOWS.Q2)
    )
  }));
  const [savedByWindow, setSavedByWindow] = useState<AchievementsByWindow>(() => ({
    [CHECKIN_WINDOWS.Q2]: getEmployeeQuarterlyAchievements(
      employeeId,
      CHECKIN_WINDOWS.Q2
    )
  }));
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isSelectedQuarterEditable = isQuarterEditable(
    selectedQuarter,
    activeWindow
  );

  const savedAchievements =
    savedByWindow[selectedQuarter] ??
    getEmployeeQuarterlyAchievements(employeeId, selectedQuarter);
  const drafts =
    draftsByWindow[selectedQuarter] ?? buildDrafts(goals, savedAchievements);
  const progressScores = goals.reduce<Record<string, number>>((scores, goal) => {
    const draft = drafts[goal.id];

    scores[goal.id] = calculateProgressScore(
      goal,
      draft?.actualValue,
      draft?.completionDate
    );

    return scores;
  }, {});
  const updatedGoalCount = goals.filter((goal) => {
    const draft = drafts[goal.id];

    return Boolean(draft?.actualValue !== null || draft?.completionDate);
  }).length;
  const averageProgress =
    goals.length > 0
      ? goals.reduce(
          (total, goal) =>
            total + getDisplayProgressScore(progressScores[goal.id] ?? 0),
          0
        ) / goals.length
      : 0;

  function handleQuarterChange(nextQuarter: CheckinWindow) {
    setSelectedQuarter(nextQuarter);
    setSuccessMessage(null);
    setErrorMessage(null);
  }

  function handleChangeDraft(goalId: string, draft: AchievementDraft) {
    if (!isSelectedQuarterEditable) {
      return;
    }

    setDraftsByWindow((currentDrafts) => ({
      ...currentDrafts,
      [selectedQuarter]: {
        ...(currentDrafts[selectedQuarter] ?? buildDrafts(goals, savedAchievements)),
        [goalId]: draft
      }
    }));
    setSuccessMessage(null);
    setErrorMessage(null);
  }

  function handleSave() {
    if (!isSelectedQuarterEditable) {
      setSuccessMessage(null);
      setErrorMessage(
        "This check-in window is not currently active. Updates are read-only."
      );
      return;
    }

    if (!activeCycle) {
      setErrorMessage("No active goal cycle is available.");
      return;
    }

    const inconsistentAchievement = goals.find((goal) => {
      const draft = drafts[goal.id];
      const effectiveStatus = getEffectiveProgressStatus(
        draft,
        progressScores[goal.id] ?? 0
      );

      if (effectiveStatus === CHECKIN_PROGRESS_STATUSES.NOT_STARTED) {
        return false;
      }

      if (goal.uomType === UOM_TYPES.TIMELINE) {
        return !draft?.completionDate;
      }

      return draft?.actualValue === null || draft?.actualValue === undefined;
    });

    if (inconsistentAchievement) {
      setSuccessMessage(null);
      setErrorMessage(
        inconsistentAchievement.uomType === UOM_TYPES.TIMELINE
          ? `${inconsistentAchievement.title}: completion date is required before saving progress.`
          : `${inconsistentAchievement.title}: actual achievement is required before saving progress.`
      );
      return;
    }

    const result = saveEmployeeQuarterlyAchievements({
      employeeId,
      cycleId: activeCycle.id,
      checkinWindow: selectedQuarter,
      achievements: goals.map((goal) => ({
        goalId: goal.id,
        actualValue: drafts[goal.id]?.actualValue ?? null,
        completionDate: drafts[goal.id]?.completionDate ?? null,
        progressStatus: getEffectiveProgressStatus(
          drafts[goal.id],
          progressScores[goal.id] ?? 0
        )
      }))
    });

    if (!result.ok) {
      setSuccessMessage(null);
      setErrorMessage(
        result.details?.length ? result.details.join(" ") : result.error
      );
      return;
    }

    setSavedByWindow((currentSaved) => ({
      ...currentSaved,
      [selectedQuarter]: result.data
    }));
    setErrorMessage(null);
    setSuccessMessage("Quarterly achievements saved successfully.");
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
                  FY26 Q2
                </Badge>
                <Badge
                  className={cn(
                    "border-transparent",
                    isSelectedQuarterEditable
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  )}
                >
                  {isSelectedQuarterEditable ? "Active window" : "Read-only window"}
                </Badge>
              </div>
              <h1 className="mt-5 text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
                My Check-ins
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                Log actual achievement against approved goals, track progress
                health, and prepare the quarterly discussion with your manager.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:w-72">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Current state
              </p>
              <div className="mt-3 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <CalendarCheck className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-semibold text-slate-950">
                    {updatedGoalCount}/{goals.length} goals updated
                  </p>
                  <p className="text-sm text-slate-500">
                    Selected quarter workspace
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 border-t border-slate-200 bg-slate-50/70 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-4">
          <CheckinMetricCard
            icon={ClipboardCheck}
            label="Approved goals"
            value={`${goals.length}`}
            helper="Goals available for quarterly updates"
            tone="blue"
          />
          <CheckinMetricCard
            icon={CheckCircle2}
            label="Updated"
            value={`${updatedGoalCount}/${goals.length}`}
            helper="Goals with actuals or completion dates"
            tone={updatedGoalCount === goals.length ? "emerald" : "amber"}
          />
          <CheckinMetricCard
            icon={TrendingUp}
            label="Progress health"
            value={`${averageProgress.toFixed(1)}%`}
            helper="Average displayed progress score"
            tone={averageProgress >= 85 ? "emerald" : averageProgress >= 50 ? "blue" : "amber"}
          />
          <CheckinMetricCard
            icon={isSelectedQuarterEditable ? CalendarCheck : Lock}
            label="Window"
            value={isSelectedQuarterEditable ? "Editable" : "Locked"}
            helper={
              isSelectedQuarterEditable
                ? "Updates can be saved"
                : "Saved data remains viewable"
            }
            tone={isSelectedQuarterEditable ? "emerald" : "slate"}
          />
        </div>
      </section>

      <Card className="border-slate-200 bg-white shadow-subtle">
        <CardContent className="p-4 sm:p-5">
          <QuarterSelector
            activeWindow={activeWindow}
            value={selectedQuarter}
            onChange={handleQuarterChange}
          />
        </CardContent>
      </Card>

      {!isSelectedQuarterEditable ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-800">
          This check-in window is not currently active. Updates are read-only.
        </div>
      ) : null}

      {successMessage ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
          {successMessage}
        </div>
      ) : null}

      {errorMessage ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm font-medium text-destructive">
          {errorMessage}
        </div>
      ) : null}

      <EmployeeCheckinPanel
        drafts={drafts}
        goals={goals}
        isEditable={isSelectedQuarterEditable}
        onChangeDraft={handleChangeDraft}
        onSave={handleSave}
        progressScores={progressScores}
        savedAchievements={savedAchievements}
      />
    </div>
  );
}

function EmployeeCheckinsContent() {
  const sessionState = useDemoSession();

  if (sessionState.status === "loading") {
    return (
      <Card>
        <CardContent className="p-5 text-sm text-muted-foreground">
          Loading employee check-ins...
        </CardContent>
      </Card>
    );
  }

  if (sessionState.status !== "authenticated") {
    return null;
  }

  return (
    <EmployeeCheckinsWorkspace
      key={sessionState.session.user.id}
      employeeId={sessionState.session.user.id}
    />
  );
}

export default function EmployeeCheckinsPage() {
  return (
    <AppShell
      contentClassName="mx-0 w-full max-w-none py-4"
      topbarContentClassName="mx-0 max-w-none"
    >
      <EmployeeCheckinsContent />
    </AppShell>
  );
}


