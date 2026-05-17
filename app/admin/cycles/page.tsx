"use client";

import { useSyncExternalStore } from "react";
import {
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Settings2
} from "lucide-react";

import { CycleTimeline } from "@/components/admin/CycleTimeline";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { getActiveGoalCycle } from "@/lib/services/goal-service";
import { getCycleTimelineItems } from "@/lib/services/report-service";
import {
  CYCLE_WINDOW_DETAILS,
  getActiveCycleWindowServerSnapshot,
  getActiveCycleWindowSnapshot,
  setStoredActiveCycleWindow,
  subscribeToActiveCycleWindow,
  type CycleWindow
} from "@/lib/utils/cycle-windows";
import { formatDate } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils";

type WindowSummaryCardProps = {
  description: string;
  icon: typeof CalendarCheck;
  status: "active" | "closed" | "upcoming";
  title: string;
  windowLabel: string;
};

function getWindowStatusLabel(status: WindowSummaryCardProps["status"]) {
  if (status === "active") {
    return "Active";
  }

  if (status === "closed") {
    return "Closed";
  }

  return "Upcoming";
}

function getWindowStatusStyles(status: WindowSummaryCardProps["status"]) {
  if (status === "active") {
    return {
      card: "border-blue-200 bg-blue-50/50",
      icon: "bg-blue-600 text-white shadow-sm",
      badge: "bg-emerald-50 text-emerald-700",
      bar: "bg-blue-600"
    };
  }

  if (status === "closed") {
    return {
      card: "border-slate-200 bg-white",
      icon: "bg-slate-100 text-slate-600",
      badge: "bg-slate-100 text-slate-700",
      bar: "bg-slate-300"
    };
  }

  return {
    card: "border-slate-200 bg-white",
    icon: "bg-blue-50 text-blue-700",
    badge: "bg-blue-50 text-blue-700",
    bar: "bg-blue-200"
  };
}

function WindowSummaryCard({
  description,
  icon: Icon,
  status,
  title,
  windowLabel
}: WindowSummaryCardProps) {
  const styles = getWindowStatusStyles(status);

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-2xl border p-4 shadow-subtle transition",
        styles.card
      )}
    >
      <div className={cn("absolute inset-x-0 top-0 h-1", styles.bar)} />
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {title}
          </p>
          <p className="mt-2 text-xl font-semibold tracking-normal text-slate-950">
            {windowLabel}
          </p>
        </div>
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
            styles.icon
          )}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge className={cn("border-transparent", styles.badge)}>
          {getWindowStatusLabel(status)}
        </Badge>
      </div>
      <p className="mt-3 line-clamp-2 text-sm leading-5 text-slate-600">
        {description}
      </p>
    </article>
  );
}

export default function AdminCyclesPage() {
  const activeCycle = getActiveGoalCycle();
  const activeWindow = useSyncExternalStore(
    subscribeToActiveCycleWindow,
    getActiveCycleWindowSnapshot,
    getActiveCycleWindowServerSnapshot
  );
  const timelineItems = getCycleTimelineItems(activeWindow);

  function handleActiveWindowChange(nextWindow: CycleWindow) {
    setStoredActiveCycleWindow(nextWindow);
  }

  return (
    <AppShell contentClassName="mx-0 w-full max-w-none py-4">
      <div className="w-full space-y-6">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-subtle">
          <div className="grid xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
            <div className="relative overflow-hidden p-5 sm:p-7">
              <div className="absolute right-8 top-6 h-48 w-48 rounded-full bg-blue-100/70 blur-3xl" />
              <div className="absolute -bottom-12 left-8 h-36 w-80 rounded-full bg-slate-100 blur-2xl" />
              <div className="relative max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="border-transparent bg-blue-50 text-blue-700">
                    Admin / HR
                  </Badge>
                  {activeCycle ? (
                    <Badge className="border-transparent bg-slate-100 text-slate-700">
                      {activeCycle.name}
                    </Badge>
                  ) : null}
                  <Badge className="border-transparent bg-emerald-50 text-emerald-700">
                    Active: {CYCLE_WINDOW_DETAILS[activeWindow].label}
                  </Badge>
                </div>
                <h1 className="mt-5 text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
                  Goal Cycles
                </h1>
                <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                  Govern goal-setting readiness, quarterly update access, and
                  cycle visibility from one controlled workspace.
                </p>
                <div className="mt-6 grid max-w-2xl gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Windows
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-slate-950">
                      {timelineItems.length}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Closed
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-slate-950">
                      {
                        timelineItems.filter((item) => item.status === "closed")
                          .length
                      }
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Upcoming
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-slate-950">
                      {
                        timelineItems.filter(
                          (item) => item.status === "upcoming"
                        ).length
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 bg-slate-50/70 p-5 sm:p-7 xl:border-l xl:border-t-0">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-subtle">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Active window
                    </p>
                    <h2 className="mt-1 text-lg font-semibold text-slate-950">
                      {CYCLE_WINDOW_DETAILS[activeWindow].label}
                    </h2>
                  </div>
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                    <Settings2 className="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  {CYCLE_WINDOW_DETAILS[activeWindow].description}
                </p>
                <dl className="mt-5 grid gap-3 text-sm">
                  <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-3 py-2">
                    <dt className="text-slate-500">Window</dt>
                    <dd className="font-semibold text-slate-950">
                      {CYCLE_WINDOW_DETAILS[activeWindow].windowLabel}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-3 py-2">
                    <dt className="text-slate-500">Cycle</dt>
                    <dd className="font-semibold text-slate-950">
                      {activeCycle?.name ?? "Not configured"}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-3 py-2">
                    <dt className="text-slate-500">Goal period</dt>
                    <dd className="text-right font-semibold text-slate-950">
                      {activeCycle
                        ? `${formatDate(activeCycle.startsOn)} to ${formatDate(
                            activeCycle.endsOn
                          )}`
                        : "-"}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {timelineItems.map((item, index) => {
            const icon =
              index === 0
                ? CalendarCheck
                : item.status === "active"
                  ? CheckCircle2
                  : item.status === "closed"
                    ? CalendarDays
                    : Clock3;

            return (
              <WindowSummaryCard
                key={item.id}
                description={item.description}
                icon={icon}
                status={item.status}
                title={item.title}
                windowLabel={item.windowLabel}
              />
            );
          })}
        </section>

        <CycleTimeline
          activeCycle={activeCycle}
          activeWindow={activeWindow}
          items={timelineItems}
          onActiveWindowChange={handleActiveWindowChange}
        />
      </div>
    </AppShell>
  );
}
