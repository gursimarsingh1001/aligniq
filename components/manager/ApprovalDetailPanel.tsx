"use client";

import { ClipboardCheck, FileText, Scale } from "lucide-react";

import { GoalStatusBadge } from "@/components/goals/GoalStatusBadge";
import { WeightageSummary } from "@/components/goals/WeightageSummary";
import { ApprovalGoalEditor } from "@/components/manager/ApprovalGoalEditor";
import { UserAvatar } from "@/components/ui/UserAvatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import type { ApprovalQueueItem } from "@/lib/services/approval-service";
import type { Goal } from "@/lib/types/goal";
import { formatDate } from "@/lib/utils/formatters";

type ApprovalDetailPanelProps = {
  item: ApprovalQueueItem | null;
  onChangeGoal: (
    goalId: string,
    updates: Partial<Pick<Goal, "targetDate" | "targetValue" | "weightage">>
  ) => void;
};

export function ApprovalDetailPanel({
  item,
  onChangeGoal
}: ApprovalDetailPanelProps) {
  if (!item) {
    return (
      <Card className="border-slate-200 bg-white shadow-subtle">
        <CardContent className="p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
            <FileText className="h-6 w-6" aria-hidden="true" />
          </div>
          <p className="mt-4 text-sm font-semibold text-slate-950">
            Select a submission
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Choose a pending employee submission to review goals, adjust target
            values, and approve or return for rework.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden border-slate-200 bg-white shadow-subtle">
        <CardHeader className="border-b border-slate-200 bg-slate-50/70 p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 gap-3">
              <UserAvatar
                name={item.employee.name}
                role={item.employee.role}
                size={44}
                userId={item.employee.id}
                className="h-11 w-11"
              />
              <div className="min-w-0">
                <CardTitle className="break-words text-xl text-slate-950">
                  {item.employee.name}
                </CardTitle>
                <CardDescription className="mt-1">
                  {item.employee.title} -{" "}
                  {item.department?.name ?? "Unassigned department"}
                </CardDescription>
              </div>
            </div>
            <GoalStatusBadge status={item.submission.status} />
          </div>
        </CardHeader>

        <CardContent className="grid gap-3 p-5 text-sm sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-2 text-slate-500">
              <FileText className="h-4 w-4" aria-hidden="true" />
              <p className="text-xs font-semibold uppercase tracking-wide">
                Submitted
              </p>
            </div>
            <p className="mt-2 font-semibold text-slate-950">
              {formatDate(item.submission.submittedAt)}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-2 text-slate-500">
              <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
              <p className="text-xs font-semibold uppercase tracking-wide">
                Goals
              </p>
            </div>
            <p className="mt-2 font-semibold text-slate-950">
              {item.submission.goals.length}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-2 text-slate-500">
              <Scale className="h-4 w-4" aria-hidden="true" />
              <p className="text-xs font-semibold uppercase tracking-wide">
                Review guidance
              </p>
            </div>
            <p className="mt-2 font-semibold text-slate-950">
              Target and weightage editable
            </p>
          </div>
        </CardContent>
      </Card>

      <WeightageSummary goals={item.submission.goals} />

      <Card className="border-slate-200 bg-white shadow-subtle">
        <CardHeader className="p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="text-xl text-slate-950">
                Submitted goals
              </CardTitle>
              <CardDescription>
                Manager can adjust target and weightage before approval.
              </CardDescription>
            </div>
            <div className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
              {item.submission.goals.length} goals
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 p-5 pt-0">
          {item.submission.goals.map((goal) => (
            <ApprovalGoalEditor
              goal={goal}
              key={goal.id}
              onChangeGoal={onChangeGoal}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
