"use client";

import {
  CheckCircle2,
  FileText,
  MessageSquareText,
  TrendingUp,
  UserRound
} from "lucide-react";

import { ManagerCommentBox } from "@/components/checkins/ManagerCommentBox";
import { PlannedVsActualTable } from "@/components/checkins/PlannedVsActualTable";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/UserAvatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import type { PlannedVsActualRow, TeamCheckinSummary } from "@/lib/types/checkin";
import { cn } from "@/lib/utils";
import { formatPercent } from "@/lib/utils/formatters";
import { getDisplayProgressScore } from "@/lib/utils/progress";

type ManagerCheckinDetailProps = {
  comment: string;
  commentError: string | null;
  isEditable: boolean;
  rows: PlannedVsActualRow[];
  selectedSummary: TeamCheckinSummary | null;
  successMessage: string | null;
  onChangeComment: (comment: string) => void;
  onSaveComment: () => void;
};

function getAverageProgress(rows: PlannedVsActualRow[]) {
  const progressScores = rows
    .filter((row) => row.achievement)
    .map((row) => getDisplayProgressScore(row.achievement?.progressScore ?? 0));

  if (progressScores.length === 0) {
    return 0;
  }

  return (
    progressScores.reduce((total, score) => total + score, 0) /
    progressScores.length
  );
}

function DetailMetric({
  icon: Icon,
  label,
  value,
  tone
}: {
  icon: typeof FileText;
  label: string;
  value: string;
  tone: "blue" | "emerald" | "amber" | "slate";
}) {
  const toneStyles = {
    blue: "bg-blue-50 text-blue-700",
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    slate: "bg-slate-100 text-slate-700"
  } as const;

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="flex items-center gap-2 text-slate-500">
        <span
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-xl",
            toneStyles[tone]
          )}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <p className="text-xs font-semibold uppercase tracking-wide">{label}</p>
      </div>
      <p className="mt-3 text-lg font-semibold text-slate-950">{value}</p>
    </div>
  );
}

export function ManagerCheckinDetail({
  comment,
  commentError,
  isEditable,
  rows,
  selectedSummary,
  successMessage,
  onChangeComment,
  onSaveComment
}: ManagerCheckinDetailProps) {
  if (!selectedSummary) {
    return (
      <Card className="border-slate-200 bg-white shadow-subtle">
        <CardContent className="p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
            <UserRound className="h-6 w-6" aria-hidden="true" />
          </div>
          <p className="mt-4 text-sm font-semibold text-slate-950">
            Select a team member
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Planned vs actual achievement and manager comments will appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  const averageProgress = getAverageProgress(rows);
  const updatedRows = rows.filter((row) => row.achievement).length;
  const isComplete = Boolean(selectedSummary.managerCheckin);

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden border-slate-200 bg-white shadow-subtle">
        <CardHeader className="border-b border-slate-200 bg-slate-50/70 p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 gap-3">
              <UserAvatar
                name={selectedSummary.employeeName}
                size={44}
                userId={selectedSummary.employeeId}
                className="h-11 w-11"
              />
              <div className="min-w-0">
                <CardTitle className="break-words text-xl text-slate-950">
                  {selectedSummary.employeeName}
                </CardTitle>
                <CardDescription className="mt-1">
                  {selectedSummary.departmentName} -{" "}
                  {isComplete ? "Check-in completed" : "Check-in pending"}
                </CardDescription>
              </div>
            </div>
            <Badge
              className={cn(
                "border-transparent",
                isComplete
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              )}
            >
              {isComplete ? "Completed" : "Pending"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="grid gap-3 p-5 sm:grid-cols-3">
          <DetailMetric
            icon={FileText}
            label="Approved goals"
            tone="blue"
            value={`${selectedSummary.approvedGoalCount}`}
          />
          <DetailMetric
            icon={CheckCircle2}
            label="Updated"
            tone={updatedRows === rows.length ? "emerald" : "amber"}
            value={`${updatedRows}/${rows.length}`}
          />
          <DetailMetric
            icon={TrendingUp}
            label="Progress health"
            tone={averageProgress >= 85 ? "emerald" : averageProgress >= 50 ? "blue" : "amber"}
            value={formatPercent(averageProgress, 1)}
          />
        </CardContent>
      </Card>

      <Card className="border-slate-200 bg-white shadow-subtle">
        <CardHeader className="p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="text-xl text-slate-950">
                Planned vs actual
              </CardTitle>
              <CardDescription>
                Review target, achievement, employee status, and tracking score.
              </CardDescription>
            </div>
            <Badge className="border-transparent bg-blue-50 text-blue-700">
              {rows.length} goals
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-5 pt-0">
          <PlannedVsActualTable rows={rows} />
        </CardContent>
      </Card>

      <Card className="border-slate-200 bg-white shadow-subtle">
        <CardHeader className="p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <MessageSquareText className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <CardTitle className="text-xl text-slate-950">
                Manager check-in
              </CardTitle>
              <CardDescription>
                Add a structured quarterly comment for the discussion record.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-5 pt-0">
          {successMessage ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-800">
              {successMessage}
            </div>
          ) : null}
          <ManagerCommentBox
            comment={comment}
            disabled={!isEditable}
            error={commentError}
            onChange={onChangeComment}
            onSave={onSaveComment}
          />
        </CardContent>
      </Card>
    </div>
  );
}
