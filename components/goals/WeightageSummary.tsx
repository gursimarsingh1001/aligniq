import { AlertTriangle, CheckCircle2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { validateGoalWeightage } from "@/lib/services/goal-service";
import { REQUIRED_TOTAL_WEIGHTAGE } from "@/lib/validations/goal";
import { cn } from "@/lib/utils";

type WeightageSummaryProps = {
  goals: { weightage: number }[];
};

export function WeightageSummary({ goals }: WeightageSummaryProps) {
  const validation = validateGoalWeightage(goals);
  const remainingWeightage = REQUIRED_TOTAL_WEIGHTAGE - validation.totalWeightage;
  const progressWidth = Math.min(Math.max(validation.totalWeightage, 0), 100);
  const isComplete = validation.totalWeightage === REQUIRED_TOTAL_WEIGHTAGE;

  return (
    <Card className="border-slate-200 bg-white shadow-subtle">
      <CardContent className="space-y-4 p-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <p className="text-base font-semibold text-slate-950">
              Weightage summary
            </p>
            <div
              className={cn(
                "inline-flex w-fit shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-3 py-1 text-sm font-semibold",
                isComplete
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              )}
            >
              {isComplete ? (
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              ) : (
                <AlertTriangle className="h-4 w-4" aria-hidden="true" />
              )}
              {validation.totalWeightage}% used
            </div>
          </div>
          <p className="text-sm leading-5 text-slate-500">
            Total weightage must be exactly 100% before submission.
          </p>
        </div>

        <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className={cn(
              "h-2.5 rounded-full transition-all",
              isComplete ? "bg-emerald-500" : "bg-amber-500"
            )}
            style={{ width: `${progressWidth}%` }}
          />
        </div>

        <div className="grid gap-2 text-sm sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <p className="text-xs font-medium text-slate-500">Goal count</p>
            <p className="mt-1 font-semibold text-slate-950">
              {validation.goalCount} / 8
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <p className="text-xs font-medium text-slate-500">Remaining</p>
            <p className="mt-1 font-semibold text-slate-950">
              {remainingWeightage >= 0
                ? `${remainingWeightage}%`
                : `${Math.abs(remainingWeightage)}% over`}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <p className="text-xs font-medium text-slate-500">Submission state</p>
            <p className="mt-1 font-semibold text-slate-950">
              {isComplete ? "Ready" : "Needs adjustment"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
