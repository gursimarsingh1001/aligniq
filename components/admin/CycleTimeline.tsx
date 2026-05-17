"use client";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  LockKeyhole,
  ShieldCheck,
  Settings2
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import type { GoalCycle } from "@/lib/types/goal";
import type { CycleTimelineItem } from "@/lib/types/report";
import {
  CYCLE_WINDOW_DETAILS,
  CYCLE_WINDOW_ORDER,
  type CycleWindow
} from "@/lib/utils/cycle-windows";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils/formatters";

type CycleTimelineProps = {
  activeCycle: GoalCycle | null;
  activeWindow: CycleWindow;
  items: CycleTimelineItem[];
  onActiveWindowChange: (activeWindow: CycleWindow) => void;
};

function getStatusLabel(status: CycleTimelineItem["status"]) {
  if (status === "active") {
    return "Active";
  }

  if (status === "closed") {
    return "Closed";
  }

  return "Upcoming";
}

function getStatusStyles(status: CycleTimelineItem["status"]) {
  if (status === "active") {
    return {
      badge: "bg-emerald-50 text-emerald-700",
      icon: "bg-emerald-50 text-emerald-700 ring-emerald-100",
      line: "bg-emerald-500",
      Icon: CheckCircle2
    };
  }

  if (status === "closed") {
    return {
      badge: "bg-slate-100 text-slate-700",
      icon: "bg-slate-100 text-slate-600 ring-slate-200",
      line: "bg-slate-300",
      Icon: LockKeyhole
    };
  }

  return {
    badge: "bg-blue-50 text-blue-700",
    icon: "bg-blue-50 text-blue-700 ring-blue-100",
    line: "bg-blue-200",
    Icon: Clock3
  };
}

function getStatusHelper(status: CycleTimelineItem["status"]) {
  if (status === "active") {
    return "Editable window";
  }

  if (status === "closed") {
    return "Read-only";
  }

  return "Scheduled";
}

export function CycleTimeline({
  activeCycle,
  activeWindow,
  items,
  onActiveWindowChange
}: CycleTimelineProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_26rem]">
      <Card className="overflow-hidden border-slate-200 bg-white shadow-subtle">
        <CardHeader className="border-b border-slate-200 bg-slate-50/70 p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100">
              <CalendarDays className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <CardTitle className="text-xl text-slate-950">
                Cycle Roadmap
              </CardTitle>
              <CardDescription className="mt-1">
                Goal setting and quarterly check-in windows for the active
                performance cycle.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5 sm:p-6">
          <div className="relative grid gap-4">
            <div className="absolute left-5 top-6 hidden h-[calc(100%-3rem)] w-px bg-slate-200 sm:block" />
            {items.map((item) => {
              const styles = getStatusStyles(item.status);
              const Icon = styles.Icon;

              return (
                <article
                  className={cn(
                    "relative rounded-2xl border p-4 sm:ml-12",
                    item.status === "active"
                      ? "border-blue-200 bg-blue-50/50"
                      : "border-slate-200 bg-slate-50/70"
                  )}
                  key={item.id}
                >
                  <span
                    className={cn(
                      "absolute -left-[3.25rem] top-4 hidden h-10 w-10 items-center justify-center rounded-2xl ring-1 sm:flex",
                      styles.icon
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div
                    className={cn(
                      "absolute -left-[1px] top-0 h-full w-1 rounded-l-2xl sm:hidden",
                      styles.line
                    )}
                  />
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-950">{item.title}</p>
                      <p className="mt-1 text-sm font-medium text-slate-600">
                        {item.windowLabel}
                      </p>
                    </div>
                    <Badge className={cn("border-transparent", styles.badge)}>
                      {getStatusLabel(item.status)}
                    </Badge>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
                    <span className="text-slate-500">Window access</span>
                    <span className="font-semibold text-slate-950">
                      {getStatusHelper(item.status)}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="h-fit border-slate-200 bg-white shadow-subtle xl:sticky xl:top-20">
        <CardHeader className="border-b border-slate-200 bg-slate-50/70 p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100">
              <Settings2 className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <CardTitle className="text-xl text-slate-950">
                Cycle Controls
              </CardTitle>
              <CardDescription className="mt-1">
                Select the quarter that should remain editable for check-ins.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <div className="mb-5 rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-950">
                Active window
              </span>
              <select
                value={activeWindow}
                onChange={(event) =>
                  onActiveWindowChange(event.target.value as CycleWindow)
                }
                className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
              >
                {CYCLE_WINDOW_ORDER.map((window) => (
                  <option key={window} value={window}>
                    {CYCLE_WINDOW_DETAILS[window].label}
                  </option>
                ))}
              </select>
            </label>
            <p className="mt-2 text-xs leading-5 text-slate-600">
              The selected window controls which quarterly workspace is editable.
            </p>
          </div>

          {activeCycle ? (
            <dl className="grid gap-3 text-sm">
              <div className="rounded-xl bg-slate-50 px-3 py-2">
                <dt className="text-slate-500">Cycle</dt>
                <dd className="mt-1 font-semibold text-slate-950">
                  {activeCycle.name}
                </dd>
              </div>
              <div className="rounded-xl bg-slate-50 px-3 py-2">
                <dt className="text-slate-500">Goal period</dt>
                <dd className="mt-1 font-medium text-slate-950">
                  {formatDate(activeCycle.startsOn)} to{" "}
                  {formatDate(activeCycle.endsOn)}
                </dd>
              </div>
              <div className="rounded-xl bg-slate-50 px-3 py-2">
                <dt className="text-slate-500">Submission deadline</dt>
                <dd className="mt-1 font-medium text-slate-950">
                  {formatDate(activeCycle.submissionDeadline)}
                </dd>
              </div>
              <div className="rounded-xl bg-slate-50 px-3 py-2">
                <dt className="text-slate-500">Check-in window</dt>
                <dd className="mt-1 font-medium text-slate-950">
                  {formatDate(activeCycle.checkinStartsOn)} to{" "}
                  {formatDate(activeCycle.checkinEndsOn)}
                </dd>
              </div>
              <div className="rounded-xl bg-slate-50 px-3 py-2">
                <dt className="text-slate-500">Status</dt>
                <dd className="mt-2">
                  <Badge className="border-transparent bg-emerald-50 text-emerald-700">
                    {activeCycle.status}
                  </Badge>
                </dd>
              </div>
            </dl>
          ) : (
            <p className="rounded-2xl border border-dashed border-slate-300 p-5 text-sm text-slate-500">
              No active goal cycle is configured.
            </p>
          )}

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="font-semibold text-slate-950">
                  Governance guardrail
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Reports remain visible across every quarter while editing is
                  limited to the active check-in window.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
