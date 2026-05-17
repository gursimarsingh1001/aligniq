"use client";

import { CheckCircle2, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type ApprovalActionsProps = {
  canApprove: boolean;
  errorMessage: string | null;
  onApprove: () => void;
  onReturnForRework: () => void;
  successMessage: string | null;
  validationMessages: string[];
};

export function ApprovalActions({
  canApprove,
  errorMessage,
  onApprove,
  onReturnForRework,
  successMessage,
  validationMessages
}: ApprovalActionsProps) {
  return (
    <Card className="sticky bottom-4 z-10 border-slate-200 bg-white/95 shadow-elevated backdrop-blur">
      <CardContent className="space-y-3 p-4">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
          Once approved, goals are locked for the employee. Returned submissions
          can be edited again by the employee.
        </div>

        {successMessage ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-800">
            {successMessage}
          </div>
        ) : null}

        {errorMessage ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-sm font-medium text-destructive">
            {errorMessage}
          </div>
        ) : null}

        {validationMessages.length > 0 ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            <p className="font-semibold">Resolve before approving:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {validationMessages.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onReturnForRework}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Return for rework
          </Button>
          <Button disabled={!canApprove} onClick={onApprove}>
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            Approve goals
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
