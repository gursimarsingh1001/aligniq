import { BarChart3 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import type { AnalyticsDistributionItem } from "@/lib/types/analytics";
import { formatPercent } from "@/lib/utils/formatters";

type GoalDistributionChartProps = {
  title: string;
  description: string;
  items: AnalyticsDistributionItem[];
};

export function GoalDistributionChart({
  description,
  items,
  title
}: GoalDistributionChartProps) {
  return (
    <Card className="overflow-hidden border-slate-200 bg-white shadow-subtle">
      <CardHeader className="border-b border-slate-200 bg-slate-50/70 p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100">
            <BarChart3 className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <CardTitle className="text-lg text-slate-950">{title}</CardTitle>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-5">
        {items.length > 0 ? (
          items.map((item, index) => (
            <div
              className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3"
              key={item.label}
            >
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="break-words font-semibold text-slate-950">
                  {item.label}
                </span>
                <span className="shrink-0 font-medium text-slate-600">
                  {item.value} - {formatPercent(item.percent, 0)}
                </span>
              </div>
              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white ring-1 ring-slate-200">
                <div
                  className={index === 0 ? "h-full rounded-full bg-blue-600" : "h-full rounded-full bg-emerald-500"}
                  style={{ width: `${Math.min(item.percent, 100)}%` }}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="rounded-2xl border border-dashed border-slate-300 p-5 text-center text-sm text-slate-500">
            No distribution data found.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
