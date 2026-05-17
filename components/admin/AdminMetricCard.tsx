import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";
import type { AdminMetric } from "@/lib/types/report";
import { cn } from "@/lib/utils";

type AdminMetricCardProps = {
  metric: AdminMetric;
  icon?: ReactNode;
  tone?: "blue" | "emerald" | "amber" | "red" | "slate";
};

const toneStyles = {
  blue: {
    icon: "bg-blue-50 text-blue-700",
    bar: "bg-blue-600",
    ring: "ring-blue-100"
  },
  emerald: {
    icon: "bg-emerald-50 text-emerald-700",
    bar: "bg-emerald-500",
    ring: "ring-emerald-100"
  },
  amber: {
    icon: "bg-amber-50 text-amber-700",
    bar: "bg-amber-500",
    ring: "ring-amber-100"
  },
  red: {
    icon: "bg-red-50 text-red-700",
    bar: "bg-red-500",
    ring: "ring-red-100"
  },
  slate: {
    icon: "bg-slate-100 text-slate-700",
    bar: "bg-slate-500",
    ring: "ring-slate-100"
  }
} as const;

function getProgressValue(value: number) {
  return Math.min(Math.max(value * 12, 18), 100);
}

export function AdminMetricCard({
  icon,
  metric,
  tone = "blue"
}: AdminMetricCardProps) {
  const styles = toneStyles[tone];

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
          {icon ? (
            <div
              className={cn(
                "rounded-2xl p-2.5 ring-1",
                styles.icon,
                styles.ring
              )}
            >
              {icon}
            </div>
          ) : null}
        </div>
        <div className="mt-4 h-2 rounded-full bg-slate-100">
          <div
            className={cn("h-2 rounded-full", styles.bar)}
            style={{ width: `${getProgressValue(metric.value)}%` }}
          />
        </div>
        <p className="mt-3 text-sm leading-5 text-slate-600">
          {metric.helperText}
        </p>
      </CardContent>
    </Card>
  );
}

