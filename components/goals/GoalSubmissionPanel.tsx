"use client";

import { Send } from "lucide-react";

import { GoalStatusBadge } from "@/components/goals/GoalStatusBadge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { type GoalStatus } from "@/lib/constants/goal-status";

type GoalSubmissionPanelProps = {
  canEdit: boolean;
  canSubmit: boolean;
  errorMessage: string | null;
  onSubmit: () => void;
  status: GoalStatus;
  successMessage: string | null;
  validationMessages: string[];
};

export function GoalSubmissionPanel({
  canEdit,
  canSubmit,
  errorMessage,
  onSubmit,
  status,
  successMessage,
  validationMessages
}: GoalSubmissionPanelProps) {
  return (
    <Card className="border-slate-200 bg-white shadow-subtle">
      <CardHeader className="p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-base text-slate-950">Submission</CardTitle>
            <CardDescription>
              Approved goals are locked after manager approval.
            </CardDescription>
          </div>
          <GoalStatusBadge status={status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-5 pt-0">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
          Submit your goals when the total weightage is exactly 100%. Your manager
          can approve them or return them for rework.
        </div>

        {successMessage ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
            {successMessage}
          </div>
        ) : null}

        {errorMessage ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {errorMessage}
          </div>
        ) : null}

        {validationMessages.length > 0 ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            <p className="font-medium">Before submitting:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {validationMessages.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <Button
          className="w-full"
          disabled={!canEdit || !canSubmit}
          onClick={onSubmit}
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          Submit goals
        </Button>
      </CardContent>
    </Card>
  );
}
