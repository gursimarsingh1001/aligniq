import { Grid3X3 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import type {
  DepartmentQuarterHeatmapCell,
  DepartmentQuarterHeatmapRow,
  HeatmapQuarter,
  HeatmapStatus
} from "@/lib/types/analytics";
import { cn } from "@/lib/utils";
import { formatPercent } from "@/lib/utils/formatters";

type CompletionHeatmapProps = {
  rows: DepartmentQuarterHeatmapRow[];
};

const quarterLabels: Record<HeatmapQuarter, string> = {
  q1: "Q1",
  q2: "Q2",
  q3: "Q3",
  q4: "Q4 / Annual"
};

const quarterOrder = ["q1", "q2", "q3", "q4"] as const satisfies readonly HeatmapQuarter[];

const statusLabels: Record<HeatmapStatus, string> = {
  at_risk: "At risk",
  healthy: "Healthy",
  no_data: "No data",
  watch: "Watch"
};

function getCellClassName(status: HeatmapStatus) {
  if (status === "healthy") {
    return "border-emerald-200 bg-emerald-50 text-emerald-900";
  }

  if (status === "watch") {
    return "border-amber-200 bg-amber-50 text-amber-900";
  }

  if (status === "at_risk") {
    return "border-red-200 bg-red-50 text-red-900";
  }

  return "border-slate-200 bg-slate-50 text-slate-500";
}

function formatCellValue(cell: DepartmentQuarterHeatmapCell) {
  return cell.completionRate === null
    ? "-"
    : formatPercent(cell.completionRate, 0);
}

function getCellAccessibleLabel(cell: DepartmentQuarterHeatmapCell) {
  return `${cell.department} ${quarterLabels[cell.quarter]} completion health: ${formatCellValue(cell)}, ${statusLabels[cell.status]}`;
}

function LegendItem({
  className,
  label
}: {
  className: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn("h-3 w-3 rounded-sm border", className)} />
      <span>{label}</span>
    </div>
  );
}

export function CompletionHeatmap({ rows }: CompletionHeatmapProps) {
  return (
    <Card className="overflow-hidden border-slate-200 bg-white shadow-subtle">
      <CardHeader className="border-b border-slate-200 bg-slate-50/70 p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100">
              <Grid3X3 className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <CardTitle className="text-xl text-slate-950">
                Department Completion Heatmap
              </CardTitle>
              <CardDescription className="mt-1">
                Heatmap shows quarterly completion health across departments.
              </CardDescription>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
            <LegendItem
              className="border-emerald-200 bg-emerald-50"
              label="Healthy"
            />
            <LegendItem className="border-amber-200 bg-amber-50" label="Watch" />
            <LegendItem className="border-red-200 bg-red-50" label="At risk" />
            <LegendItem className="border-slate-200 bg-slate-50" label="No data" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5 sm:p-6">
        <div className="overflow-x-auto">
          <div className="min-w-[760px] rounded-2xl border border-slate-200 bg-white">
            <div className="grid grid-cols-[minmax(190px,1.2fr)_repeat(4,minmax(130px,1fr))] border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <div className="px-4 py-3">Department</div>
              {quarterOrder.map((quarter) => (
                <div className="px-4 py-3 text-center" key={quarter}>
                  {quarterLabels[quarter]}
                </div>
              ))}
            </div>

            <div className="divide-y divide-slate-200">
              {rows.map((row) => (
                <div
                  className="grid grid-cols-[minmax(190px,1.2fr)_repeat(4,minmax(130px,1fr))]"
                  key={row.department}
                >
                  <div className="flex items-center px-4 py-3 text-sm font-semibold text-slate-950">
                    {row.department}
                  </div>
                  {quarterOrder.map((quarter) => {
                    const cell = row.quarters[quarter];

                    return (
                      <div className="p-2" key={`${row.department}-${quarter}`}>
                        <div
                          aria-label={getCellAccessibleLabel(cell)}
                          className={cn(
                            "flex min-h-16 flex-col items-center justify-center rounded-2xl border px-3 py-2 text-center",
                            getCellClassName(cell.status)
                          )}
                          role="img"
                          title={getCellAccessibleLabel(cell)}
                        >
                          <span className="text-sm font-semibold">
                            {formatCellValue(cell)}
                          </span>
                          <span className="mt-1 text-[11px] font-medium">
                            {statusLabels[cell.status]}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
