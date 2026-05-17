import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  MessageSquareText,
  Sparkles,
  Target,
  TrendingUp
} from "lucide-react";

import { GoalStatusBadge } from "@/components/goals/GoalStatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import type { GoalStatus } from "@/lib/constants/goal-status";
import type { AppRoute } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";
import { formatPercent } from "@/lib/utils/formatters";

type Accent = "blue" | "emerald" | "amber";

type DashboardMetric = {
  label: string;
  value: string;
  helper: string;
  accent: Accent;
  progress: number;
};

type DashboardGoal = {
  id: string;
  title: string;
  description: string;
  thrustArea: string;
  weightage: number;
  target: string;
  status: GoalStatus;
  progressScore: number;
};

type NextAction = {
  title: string;
  description: string;
  href: AppRoute;
};

type EmployeeDashboardData = {
  employeeName: string;
  employeeTitle: string;
  departmentName: string;
  managerName: string;
  cycleName: string;
  cycleWindow: string;
  submissionStatus: GoalStatus;
  metrics: DashboardMetric[];
  goalRows: DashboardGoal[];
  nextActions: NextAction[];
  managerFeedback: string;
  managerFeedbackDate: string | null;
};

type EmployeeDashboardProps = {
  data: EmployeeDashboardData;
};

const accentStyles: Record<
  Accent,
  {
    icon: string;
    bg: string;
    bar: string;
    text: string;
  }
> = {
  blue: {
    icon: "bg-blue-50 text-blue-700",
    bg: "bg-blue-50",
    bar: "bg-blue-600",
    text: "text-blue-700"
  },
  emerald: {
    icon: "bg-emerald-50 text-emerald-700",
    bg: "bg-emerald-50",
    bar: "bg-emerald-500",
    text: "text-emerald-700"
  },
  amber: {
    icon: "bg-amber-50 text-amber-700",
    bg: "bg-amber-50",
    bar: "bg-amber-500",
    text: "text-amber-700"
  }
};

const metricIcons = [TrendingUp, Target, ClipboardCheck, MessageSquareText];

function getFirstName(name: string) {
  return name.split(" ")[0] ?? name;
}

function getSafeProgress(progress: number) {
  return Math.min(Math.max(progress, 0), 100);
}

function MetricCard({
  metric,
  index
}: {
  metric: DashboardMetric;
  index: number;
}) {
  const Icon = metricIcons[index] ?? TrendingUp;
  const styles = accentStyles[metric.accent];
  const progress = getSafeProgress(metric.progress);

  return (
    <Card className="overflow-hidden border-slate-200 bg-white shadow-subtle">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-500">{metric.label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-normal text-slate-950">
              {metric.value}
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
        <div className="mt-4 h-2 rounded-full bg-slate-100">
          <div
            className={cn("h-2 rounded-full", styles.bar)}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-3 text-xs font-medium text-slate-500">{metric.helper}</p>
      </CardContent>
    </Card>
  );
}

function GoalProgressRow({ goal }: { goal: DashboardGoal }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-950">{goal.title}</h3>
            <GoalStatusBadge status={goal.status} />
          </div>
          <p className="text-sm text-slate-600">{goal.description}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Badge className="border-transparent bg-blue-50 text-blue-700">
            {goal.weightage}% weight
          </Badge>
          <Badge className="border-transparent bg-slate-100 text-slate-700">
            {goal.target}
          </Badge>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between gap-3 text-xs">
          <span className="font-medium text-slate-500">{goal.thrustArea}</span>
          <span className="font-semibold text-slate-950">
            {formatPercent(goal.progressScore, 1)}
          </span>
        </div>
        <div className="mt-2 h-2.5 rounded-full bg-white ring-1 ring-slate-200">
          <div
            className={cn(
              "h-2.5 rounded-full",
              goal.progressScore >= 100
                ? "bg-emerald-500"
                : goal.progressScore >= 50
                  ? "bg-blue-600"
                  : "bg-amber-500"
            )}
            style={{ width: `${getSafeProgress(goal.progressScore)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function EmptyGoalState() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
      <Target className="mx-auto h-8 w-8 text-slate-400" aria-hidden="true" />
      <h3 className="mt-3 text-sm font-semibold text-slate-950">
        No active goals yet
      </h3>
      <p className="mt-1 text-sm text-slate-600">
        Create goals and submit them for review to start quarterly tracking.
      </p>
    </div>
  );
}

export function EmployeeDashboard({ data }: EmployeeDashboardProps) {
  return (
    <div className="w-full space-y-6">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-subtle">
        <div className="grid gap-0 lg:grid-cols-[1.35fr_0.85fr]">
          <div className="relative min-h-[260px] overflow-hidden p-5 sm:p-7">
            <div className="absolute right-8 top-8 h-48 w-48 rounded-full bg-blue-100/70 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-28 w-72 rounded-full bg-slate-100 blur-2xl" />
            <div className="relative max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border-transparent bg-blue-50 text-blue-700">
                  {data.cycleName}
                </Badge>
              </div>
              <h1 className="mt-5 text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
                Good morning, {getFirstName(data.employeeName)}
              </h1>
              <p className="mt-3 max-w-xl text-base leading-7 text-slate-600">
                Track your quarterly commitments, keep achievement updates current,
                and stay aligned with manager feedback.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button asChild>
                  <Link href="/employee/goals">
                    Manage goals
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/employee/checkins">
                    Update check-ins
                    <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 bg-slate-50/70 p-5 sm:p-7 lg:border-l lg:border-t-0">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-subtle">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Current cycle
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-slate-950">
                    {data.cycleName}
                  </h2>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <CalendarCheck className="h-5 w-5" aria-hidden="true" />
                </span>
              </div>
              <dl className="mt-5 grid gap-3 text-sm">
                <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-3 py-2">
                  <dt className="text-slate-500">Window</dt>
                  <dd className="text-right font-medium text-slate-950">
                    {data.cycleWindow}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-3 py-2">
                  <dt className="text-slate-500">Manager</dt>
                  <dd className="text-right font-medium text-slate-950">
                    {data.managerName}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-3 py-2">
                  <dt className="text-slate-500">Department</dt>
                  <dd className="text-right font-medium text-slate-950">
                    {data.departmentName}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.metrics.map((metric, index) => (
          <MetricCard key={metric.label} metric={metric} index={index} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.55fr)]">
        <Card className="border-slate-200 bg-white shadow-subtle">
          <CardHeader className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
            <div>
              <CardTitle className="text-xl text-slate-950">
                Goal progress
              </CardTitle>
              <CardDescription>
                Planned targets, current achievement health, and weightage by goal.
              </CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/employee/checkins">Open check-ins</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3 p-5 pt-0 sm:p-6 sm:pt-0">
            {data.goalRows.length > 0 ? (
              data.goalRows.map((goal) => (
                <GoalProgressRow key={goal.id} goal={goal} />
              ))
            ) : (
              <EmptyGoalState />
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-slate-200 bg-white shadow-subtle">
            <CardHeader className="p-5 sm:p-6">
              <CardTitle className="text-xl text-slate-950">Next actions</CardTitle>
              <CardDescription>
                Focus items to keep this quarter moving.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 p-5 pt-0 sm:p-6 sm:pt-0">
              {data.nextActions.map((action, index) => (
                <Link
                  key={action.title}
                  href={action.href}
                  className="group block rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition hover:border-blue-200 hover:bg-blue-50/60"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-blue-700 shadow-subtle">
                      {index === 0 ? (
                        <Target className="h-4 w-4" aria-hidden="true" />
                      ) : index === 1 ? (
                        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Sparkles className="h-4 w-4" aria-hidden="true" />
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                        {action.title}
                        <ArrowRight
                          className="h-3.5 w-3.5 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-blue-700"
                          aria-hidden="true"
                        />
                      </span>
                      <span className="mt-1 block text-sm leading-5 text-slate-600">
                        {action.description}
                      </span>
                    </span>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-subtle">
            <CardHeader className="p-5 sm:p-6">
              <CardTitle className="text-xl text-slate-950">
                Manager feedback
              </CardTitle>
              <CardDescription>
                Latest quarterly check-in note from {data.managerName}.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <MessageSquareText
                  className="h-5 w-5 text-blue-700"
                  aria-hidden="true"
                />
                <p className="mt-3 text-sm leading-6 text-slate-700">
                  {data.managerFeedback}
                </p>
                {data.managerFeedbackDate ? (
                  <p className="mt-3 text-xs font-medium text-slate-500">
                    Updated {data.managerFeedbackDate}
                  </p>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
