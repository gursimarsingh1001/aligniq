"use client";

import { Inbox } from "lucide-react";

import { GoalStatusBadge } from "@/components/goals/GoalStatusBadge";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/UserAvatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import type { ApprovalQueueItem } from "@/lib/services/approval-service";
import { cn } from "@/lib/utils";
import { formatDate, formatWeightage } from "@/lib/utils/formatters";

type ApprovalQueueProps = {
  items: ApprovalQueueItem[];
  selectedSubmissionId: string | null;
  onSelectSubmission: (submissionId: string) => void;
};

export function ApprovalQueue({
  items,
  selectedSubmissionId,
  onSelectSubmission
}: ApprovalQueueProps) {
  return (
    <Card className="h-fit border-slate-200 bg-white shadow-subtle xl:sticky xl:top-20">
      <CardHeader className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-xl text-slate-950">
              Pending approvals
            </CardTitle>
            <CardDescription>
              Select a submitted goal plan for review.
            </CardDescription>
          </div>
          <Badge className="border-transparent bg-blue-50 text-blue-700">
            {items.length}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-0">
        {items.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
              <Inbox className="h-6 w-6 text-emerald-600" aria-hidden="true" />
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-950">
              No pending approvals
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Submitted goal plans will appear here for manager review.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => {
              const isSelected = item.submission.id === selectedSubmissionId;

              return (
                <button
                  type="button"
                  key={item.submission.id}
                  onClick={() => onSelectSubmission(item.submission.id)}
                  className={cn(
                    "w-full rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30",
                    isSelected
                      ? "border-blue-500 bg-blue-50/70 shadow-subtle"
                      : "border-slate-200 bg-slate-50/70 hover:border-blue-200 hover:bg-blue-50/50"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 gap-3">
                      <UserAvatar
                        name={item.employee.name}
                        role={item.employee.role}
                        size={40}
                        userId={item.employee.id}
                        className="h-10 w-10"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-950">
                          {item.employee.name}
                        </p>
                        <p className="mt-1 truncate text-xs font-medium text-slate-500">
                          {item.employee.title}
                        </p>
                        <p className="mt-1 truncate text-xs text-slate-500">
                          {item.department?.name ?? "Unassigned department"}
                        </p>
                      </div>
                    </div>
                    <GoalStatusBadge status={item.submission.status} />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200">
                      <p className="text-slate-500">Goals</p>
                      <p className="mt-1 font-semibold text-slate-950">
                        {item.goalCount}
                      </p>
                    </div>
                    <div className="rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200">
                      <p className="text-slate-500">Weightage</p>
                      <p className="mt-1 font-semibold text-slate-950">
                        {formatWeightage(item.totalWeightage)}
                      </p>
                    </div>
                    <div className="col-span-2 rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200">
                      <p className="text-slate-500">Submitted</p>
                      <p className="mt-1 font-semibold text-slate-950">
                        {formatDate(item.submission.submittedAt)}
                      </p>
                    </div>
                  </div>

                  {isSelected ? (
                    <Badge className="mt-3 border-transparent bg-white text-blue-700">
                      Selected
                    </Badge>
                  ) : null}
                </button>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
