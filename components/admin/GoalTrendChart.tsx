import { TrendingUp } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import type { GoalTrendPoint } from "@/lib/types/analytics";
import { cn } from "@/lib/utils";
import { formatPercent } from "@/lib/utils/formatters";
import { getDisplayProgressScore } from "@/lib/utils/progress";

type GoalTrendChartProps = {
  data: GoalTrendPoint[];
};

export function GoalTrendChart({ data }: GoalTrendChartProps) {
  return (
    <Card className="overflow-hidden border-slate-200 bg-white shadow-subtle">
      <CardHeader className="border-b border-slate-200 bg-slate-50/70 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100">
            <TrendingUp className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <CardTitle className="text-xl text-slate-950">
              Quarter-on-Quarter Goal Achievement
            </CardTitle>
            <CardDescription className="mt-1">
              Average progress and completion rate by quarter.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 p-5 sm:p-6">
        {data.map((point) => {
          const displayAverageProgressScore = getDisplayProgressScore(
            point.averageProgressScore
          );
          const isFuture = point.completionRate === 0 && point.averageProgressScore === 0;

          return (
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4" key={point.quarter}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-950">{point.quarter}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Completion rate {formatPercent(point.completionRate, 0)}
                  </p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold",
                    isFuture
                      ? "bg-slate-100 text-slate-600"
                      : displayAverageProgressScore >= 85
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-blue-50 text-blue-700"
                  )}
                >
                  Avg {formatPercent(displayAverageProgressScore, 1)}
                </span>
              </div>
              <div className="mt-4 grid gap-2">
                <div className="h-2.5 overflow-hidden rounded-full bg-white ring-1 ring-slate-200">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      isFuture
                        ? "bg-slate-300"
                        : displayAverageProgressScore >= 85
                          ? "bg-emerald-500"
                          : "bg-blue-600"
                    )}
                    style={{
                      width: `${displayAverageProgressScore}%`
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
