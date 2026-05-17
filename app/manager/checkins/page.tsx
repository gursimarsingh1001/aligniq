"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import {
  CalendarCheck,
  ClipboardCheck,
  MessageSquareText,
  TrendingUp,
  UsersRound
} from "lucide-react";

import { ManagerCheckinDetail } from "@/components/checkins/ManagerCheckinDetail";
import { ManagerCheckinQueue } from "@/components/checkins/ManagerCheckinQueue";
import { QuarterSelector } from "@/components/checkins/QuarterSelector";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useDemoSession } from "@/lib/auth/session";
import {
  CHECKIN_WINDOW_LABELS,
  CHECKIN_WINDOWS,
  type CheckinWindow
} from "@/lib/constants/checkin-windows";
import {
  getPlannedVsActualRows,
  getTeamCheckinSummaries,
  saveManagerCheckin
} from "@/lib/services/checkin-service";
import { getActiveGoalCycle } from "@/lib/services/goal-service";
import type { ManagerCheckin } from "@/lib/types/checkin";
import {
  getActiveCycleWindowServerSnapshot,
  getActiveCycleWindowSnapshot,
  isQuarterEditable,
  subscribeToActiveCycleWindow
} from "@/lib/utils/cycle-windows";
import { cn } from "@/lib/utils";
import { formatPercent } from "@/lib/utils/formatters";
import { getDisplayProgressScore } from "@/lib/utils/progress";

type SavedManagerCheckins = Record<string, ManagerCheckin>;

function getSavedKey(employeeId: string, quarter: CheckinWindow) {
  return `${employeeId}:${quarter}`;
}

type CheckinMetricCardProps = {
  icon: typeof UsersRound;
  label: string;
  value: string;
  helper: string;
  tone: "blue" | "emerald" | "amber" | "slate";
};

const checkinMetricToneStyles: Record<CheckinMetricCardProps["tone"], string> = {
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
            checkinMetricToneStyles[tone]
          )}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 text-sm leading-5 text-slate-600">{helper}</p>
    </div>
  );
}

function getAverageTeamProgress(
  summaries: ReturnType<typeof getTeamCheckinSummaries>,
  quarter: CheckinWindow
) {
  const progressScores = summaries.flatMap((summary) =>
    getPlannedVsActualRows(summary.employeeId, quarter)
      .filter((row) => row.achievement)
      .map((row) => getDisplayProgressScore(row.achievement?.progressScore ?? 0))
  );

  if (progressScores.length === 0) {
    return 0;
  }

  return (
    progressScores.reduce((total, score) => total + score, 0) /
    progressScores.length
  );
}

function ManagerCheckinsWorkspace({ managerId }: { managerId: string }) {
  const activeCycle = getActiveGoalCycle();
  const activeWindow = useSyncExternalStore(
    subscribeToActiveCycleWindow,
    getActiveCycleWindowSnapshot,
    getActiveCycleWindowServerSnapshot
  );
  const [selectedQuarter, setSelectedQuarter] = useState<CheckinWindow>(
    CHECKIN_WINDOWS.Q2
  );
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(
    () =>
      getTeamCheckinSummaries(managerId, CHECKIN_WINDOWS.Q2)[0]?.employeeId ??
      null
  );
  const [savedCheckins, setSavedCheckins] = useState<SavedManagerCheckins>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [commentError, setCommentError] = useState<string | null>(null);

  const teamSummaries = useMemo(() => {
    return getTeamCheckinSummaries(managerId, selectedQuarter).map((summary) => {
      const savedCheckin =
        savedCheckins[getSavedKey(summary.employeeId, selectedQuarter)];

      return savedCheckin
        ? {
            ...summary,
            managerCheckin: savedCheckin
          }
        : summary;
    });
  }, [managerId, savedCheckins, selectedQuarter]);
  const selectedSummary =
    teamSummaries.find((summary) => summary.employeeId === selectedEmployeeId) ??
    teamSummaries[0] ??
    null;
  const selectedKey = selectedSummary
    ? getSavedKey(selectedSummary.employeeId, selectedQuarter)
    : null;
  const plannedVsActualRows = selectedSummary
    ? getPlannedVsActualRows(selectedSummary.employeeId, selectedQuarter)
    : [];
  const completedCheckins = teamSummaries.filter((summary) =>
    Boolean(summary.managerCheckin)
  ).length;
  const totalApprovedGoals = teamSummaries.reduce(
    (total, summary) => total + summary.approvedGoalCount,
    0
  );
  const totalUpdatedGoals = teamSummaries.reduce(
    (total, summary) => total + summary.updatedGoalCount,
    0
  );
  const teamProgress = getAverageTeamProgress(teamSummaries, selectedQuarter);
  const commentValue =
    (selectedKey ? comments[selectedKey] : "") ??
    selectedSummary?.managerCheckin?.comment ??
    "";
  const isSelectedQuarterEditable = isQuarterEditable(
    selectedQuarter,
    activeWindow
  );

  function handleQuarterChange(nextQuarter: CheckinWindow) {
    setSelectedQuarter(nextQuarter);
    setSuccessMessage(null);
    setCommentError(null);
  }

  function handleSaveComment() {
    if (!isSelectedQuarterEditable) {
      setSuccessMessage(null);
      setCommentError(
        "This check-in window is not currently active. Updates are read-only."
      );
      return;
    }

    if (!selectedSummary || !selectedKey || !activeCycle) {
      return;
    }

    const result = saveManagerCheckin({
      employeeId: selectedSummary.employeeId,
      managerId,
      cycleId: activeCycle.id,
      quarterLabel: CHECKIN_WINDOW_LABELS[selectedQuarter],
      comment: commentValue
    });

    if (!result.ok) {
      setSuccessMessage(null);
      setCommentError(
        result.details?.length ? result.details.join(" ") : result.error
      );
      return;
    }

    setSavedCheckins((currentSaved) => ({
      ...currentSaved,
      [selectedKey]: result.data
    }));
    setCommentError(null);
    setSuccessMessage("Manager check-in saved successfully.");
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
                Team Check-ins
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                Review planned vs actual achievement, identify coaching needs,
                and document structured quarterly discussion notes.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:w-80">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Selected quarter
              </p>
              <div className="mt-3 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <CalendarCheck className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-semibold text-slate-950">
                    {CHECKIN_WINDOW_LABELS[selectedQuarter]}
                  </p>
                  <p className="text-sm text-slate-500">
                    {isSelectedQuarterEditable
                      ? "Comments can be saved"
                      : "Saved data remains viewable"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <CheckinMetricCard
          helper="Team members with approved goals or quarterly updates."
          icon={UsersRound}
          label="Team members"
          tone="blue"
          value={`${teamSummaries.length}`}
        />
        <CheckinMetricCard
          helper="Manager discussion comments completed this quarter."
          icon={MessageSquareText}
          label="Manager check-ins"
          tone={completedCheckins === teamSummaries.length ? "emerald" : "amber"}
          value={`${completedCheckins}/${teamSummaries.length}`}
        />
        <CheckinMetricCard
          helper="Approved goals with employee achievement updates."
          icon={ClipboardCheck}
          label="Goal updates"
          tone={totalUpdatedGoals === totalApprovedGoals ? "emerald" : "amber"}
          value={`${totalUpdatedGoals}/${totalApprovedGoals}`}
        />
        <CheckinMetricCard
          helper="Average displayed progress across updated team goals."
          icon={TrendingUp}
          label="Team progress"
          tone={teamProgress >= 85 ? "emerald" : teamProgress >= 50 ? "blue" : "amber"}
          value={formatPercent(teamProgress, 1)}
        />
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

      <div className="grid min-w-0 gap-6 xl:grid-cols-[22rem_minmax(0,1fr)]">
        <ManagerCheckinQueue
          items={teamSummaries}
          selectedEmployeeId={selectedSummary?.employeeId ?? null}
          onSelectEmployee={(employeeId) => {
            setSelectedEmployeeId(employeeId);
            setSuccessMessage(null);
            setCommentError(null);
          }}
        />

        <div className="min-w-0">
          <ManagerCheckinDetail
            comment={commentValue}
            commentError={commentError}
            isEditable={isSelectedQuarterEditable}
            rows={plannedVsActualRows}
            selectedSummary={selectedSummary}
            successMessage={successMessage}
            onChangeComment={(comment) => {
              if (!isSelectedQuarterEditable) {
                return;
              }

              if (!selectedKey) {
                return;
              }

              setComments((currentComments) => ({
                ...currentComments,
                [selectedKey]: comment
              }));
              setSuccessMessage(null);
              setCommentError(null);
            }}
            onSaveComment={handleSaveComment}
          />
        </div>
      </div>
    </div>
  );
}

function ManagerCheckinsContent() {
  const sessionState = useDemoSession();

  if (sessionState.status === "loading") {
    return (
      <Card>
        <CardContent className="p-5 text-sm text-muted-foreground">
          Loading manager check-ins...
        </CardContent>
      </Card>
    );
  }

  if (sessionState.status !== "authenticated") {
    return null;
  }

  return (
    <ManagerCheckinsWorkspace
      key={sessionState.session.user.id}
      managerId={sessionState.session.user.id}
    />
  );
}

export default function ManagerCheckinsPage() {
  return (
    <AppShell contentClassName="mx-0 w-full max-w-none py-4">
      <ManagerCheckinsContent />
    </AppShell>
  );
}


