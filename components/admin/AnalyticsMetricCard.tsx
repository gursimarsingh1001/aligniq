import { AlertTriangle, CheckCircle2, MessageSquareText, TrendingUp } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { AnalyticsMetric } from "@/lib/types/analytics";
import { cn } from "@/lib/utils";

type AnalyticsMetricCardProps = {
  metric: AnalyticsMetric;
  index?: number;
};

const metricVisuals = [
  {
    icon: TrendingUp,
    iconClass: "bg-blue-50 text-blue-700 ring-blue-100",
    barClass: "bg-blue-600"
  },
  {
    icon: CheckCircle2,
    iconClass: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    barClass: "bg-emerald-500"
  },
  {
    icon: AlertTriangle,
    iconClass: "bg-amber-50 text-amber-700 ring-amber-100",
    barClass: "bg-amber-500"
  },
  {
    icon: MessageSquareText,
    iconClass: "bg-slate-100 text-slate-700 ring-slate-200",
    barClass: "bg-slate-500"
  }
];

function getMetricProgress(value: string) {
  const numericValue = Number.parseFloat(value.replace("%", ""));

  if (Number.isNaN(numericValue)) {
    return 70;
  }

  return Math.min(Math.max(numericValue, 12), 100);
}

export function AnalyticsMetricCard({
  index = 0,
  metric
}: AnalyticsMetricCardProps) {
  const visual = metricVisuals[index] ?? metricVisuals[0];
  const Icon = visual.icon;

  return (
    <Card className="overflow-hidden border-slate-200 bg-white shadow-subtle">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {metric.label}
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-normal text-slate-950">
              {metric.value}
            </p>
          </div>
          <span
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ring-1",
              visual.iconClass
            )}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
        </div>
        <div className="mt-4 h-2 rounded-full bg-slate-100">
          <div
            className={cn("h-2 rounded-full", visual.barClass)}
            style={{ width: `${getMetricProgress(metric.value)}%` }}
          />
        </div>
        <p className="mt-3 text-sm leading-5 text-slate-600">
          {metric.helperText}
        </p>
      </CardContent>
    </Card>
  );
}
