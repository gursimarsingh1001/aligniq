import { AlertCircle, CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import type { CompletionDashboardItem } from "@/lib/types/report";
import { cn } from "@/lib/utils";
import { formatPercent } from "@/lib/utils/formatters";

type CompletionDashboardProps = {
  items: CompletionDashboardItem[];
  exceptions: string[];
};

function getCompletionPercent(item: CompletionDashboardItem) {
  if (item.total === 0) {
    return 0;
  }

  return Math.round((item.completed / item.total) * 100);
}

function getCompletionTone(percent: number) {
  if (percent >= 85) {
    return {
      badge: "bg-emerald-50 text-emerald-700",
      bar: "bg-emerald-500",
      icon: "bg-emerald-50 text-emerald-700"
    };
  }

  if (percent >= 60) {
    return {
      badge: "bg-amber-50 text-amber-700",
      bar: "bg-amber-500",
      icon: "bg-amber-50 text-amber-700"
    };
  }

  return {
    badge: "bg-red-50 text-red-700",
    bar: "bg-red-500",
    icon: "bg-red-50 text-red-700"
  };
}

export function CompletionDashboard({
  exceptions,
  items
}: CompletionDashboardProps) {
  return (
    <Card className="overflow-hidden border-slate-200 bg-white shadow-subtle">
      <CardHeader className="border-b border-slate-200 bg-slate-50/70 p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-xl text-slate-950">
              Completion Dashboard
            </CardTitle>
            <CardDescription className="mt-1">
              Real-time program visibility for submissions, approvals, updates,
              and manager check-ins.
            </CardDescription>
          </div>
          <Badge className="w-fit border-transparent bg-blue-50 text-blue-700">
            Governance view
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 p-5 sm:p-6">
        <div className="grid gap-4 xl:grid-cols-4">
          {items.map((item) => {
            const percent = getCompletionPercent(item);
            const tone = getCompletionTone(percent);

            return (
              <div
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                key={item.label}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-950">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm leading-5 text-slate-600">
                      {item.helperText}
                    </p>
                  </div>
                  <Badge className={cn("border-transparent", tone.badge)}>
                    {formatPercent(percent, 0)}
                  </Badge>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={cn("h-full rounded-full", tone.bar)}
                    style={{ width: `${Math.min(percent, 100)}%` }}
                  />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-xl bg-slate-50 px-2 py-2">
                    <p className="font-semibold text-slate-950">{item.completed}</p>
                    <p className="text-slate-500">Done</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 px-2 py-2">
                    <p className="font-semibold text-slate-950">{item.pending}</p>
                    <p className="text-slate-500">Pending</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 px-2 py-2">
                    <p className="font-semibold text-slate-950">{item.total}</p>
                    <p className="text-slate-500">Total</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-amber-700 ring-1 ring-amber-100">
                {exceptions.length > 0 ? (
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                )}
              </span>
              <p className="text-sm font-semibold text-slate-950">
                Pending items / exceptions
              </p>
            </div>
            <Badge variant="outline" className="bg-white">
              {exceptions.length}
            </Badge>
          </div>
          <ul className="mt-4 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
            {exceptions.map((exception) => (
              <li
                className="break-words rounded-xl bg-white/80 px-3 py-2 ring-1 ring-amber-100"
                key={exception}
              >
                {exception}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

