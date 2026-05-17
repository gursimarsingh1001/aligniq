import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  Inbox,
  TrendingUp,
  UsersRound
} from "lucide-react";

import { ProgressScoreBadge } from "@/components/checkins/ProgressScoreBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/UserAvatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import type { AppRoute } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";

type Accent = "blue" | "emerald" | "amber" | "red" | "slate";

type ManagerMetric = {
  label: string;
  value: string;
  helper: string;
  accent: Accent;
  progress: number;
};

type ApprovalPreview = {
  id: string;
  employeeId: string;
  employeeName: string;
  departmentName: string;
  submittedAt: string;
  goalCount: number;
  totalWeightage: number;
};

type TeamMemberHealth = {
  id: string;
  name: string;
  title: string;
  departmentName: string;
  approvedGoals: number;
  updatedGoals: number;
  averageProgress: number;
  checkinCompleted: boolean;
};

type CoachingSignal = {
  id: string;
  employeeId: string;
  employeeName: string;
  title: string;
  description: string;
  tone: Exclude<Accent, "slate">;
  href: AppRoute;
};

type SharedGoalPreview = {
  id: string;
  title: string;
  assignmentCount: number;
  syncedCount: number;
  status: string;
};

type ManagerDashboardData = {
  managerName: string;
  managerTitle: string;
  departmentName: string;
  cycleName: string;
  cycleWindow: string;
  metrics: ManagerMetric[];
  approvals: ApprovalPreview[];
  teamHealth: TeamMemberHealth[];
  coachingSignals: CoachingSignal[];
  sharedGoals: SharedGoalPreview[];
  primaryActions: {
    title: string;
    href: AppRoute;
  }[];
};

type ManagerDashboardProps = {
  data: ManagerDashboardData;
};

const accentStyles: Record<
  Accent,
  {
    icon: string;
    bar: string;
    text: string;
    subtle: string;
  }
> = {
  blue: {
    icon: "bg-blue-50 text-blue-700",
    bar: "bg-blue-600",
    text: "text-blue-700",
    subtle: "bg-blue-50"
  },
  emerald: {
    icon: "bg-emerald-50 text-emerald-700",
    bar: "bg-emerald-500",
    text: "text-emerald-700",
    subtle: "bg-emerald-50"
  },
  amber: {
    icon: "bg-amber-50 text-amber-700",
    bar: "bg-amber-500",
    text: "text-amber-700",
    subtle: "bg-amber-50"
  },
  red: {
    icon: "bg-red-50 text-red-700",
    bar: "bg-red-500",
    text: "text-red-700",
    subtle: "bg-red-50"
  },
  slate: {
    icon: "bg-slate-100 text-slate-700",
    bar: "bg-slate-500",
    text: "text-slate-700",
    subtle: "bg-slate-50"
  }
};

const metricIcons = [UsersRound, Inbox, ClipboardCheck, AlertTriangle];

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
  metric: ManagerMetric;
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
        <p className="mt-3 text-xs font-medium text-slate-500">
          {metric.helper}
        </p>
      </CardContent>
    </Card>
  );
}

function EmptyCard({
  description,
  title
}: {
  description: string;
  title: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
      <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500" aria-hidden="true" />
      <h3 className="mt-3 text-sm font-semibold text-slate-950">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}

function ApprovalInbox({ approvals }: { approvals: ApprovalPreview[] }) {
  return (
    <Card className="border-slate-200 bg-white shadow-subtle">
      <CardHeader className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
        <div>
          <CardTitle className="text-xl text-slate-950">Approval inbox</CardTitle>
          <CardDescription>
            Submitted goal plans waiting for manager review.
          </CardDescription>
        </div>
        <Button asChild size="sm" variant="outline">
          <Link href="/manager/approvals">Open approvals</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3 p-5 pt-0 sm:p-6 sm:pt-0">
        {approvals.length > 0 ? (
          approvals.map((approval) => (
            <Link
              className="group block rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition hover:border-blue-200 hover:bg-blue-50/60"
              href="/manager/approvals"
              key={approval.id}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 gap-3">
                  <UserAvatar
                    name={approval.employeeName}
                    size={42}
                    userId={approval.employeeId}
                    className="h-[42px] w-[42px]"
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-slate-950">
                        {approval.employeeName}
                        </h3>
                        <Badge className="border-transparent bg-blue-50 text-blue-700">
                        Submitted
                        </Badge>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">
                      {approval.departmentName}
                    </p>
                  </div>
                </div>
                <ArrowRight
                  className="hidden h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-blue-700 sm:block"
                  aria-hidden="true"
                />
              </div>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                <div className="rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200">
                  <dt className="text-slate-500">Goals</dt>
                  <dd className="mt-1 font-semibold text-slate-950">
                    {approval.goalCount}
                  </dd>
                </div>
                <div className="rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200">
                  <dt className="text-slate-500">Weightage</dt>
                  <dd className="mt-1 font-semibold text-slate-950">
                    {approval.totalWeightage}%
                  </dd>
                </div>
                <div className="rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200">
                  <dt className="text-slate-500">Submitted</dt>
                  <dd className="mt-1 font-semibold text-slate-950">
                    {approval.submittedAt}
                  </dd>
                </div>
              </dl>
            </Link>
          ))
        ) : (
          <EmptyCard
            description="All submitted goal plans have been reviewed."
            title="No pending approvals"
          />
        )}
      </CardContent>
    </Card>
  );
}

function TeamHealthList({ members }: { members: TeamMemberHealth[] }) {
  return (
    <Card className="border-slate-200 bg-white shadow-subtle">
      <CardHeader className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
        <div>
          <CardTitle className="text-xl text-slate-950">
            Team check-in health
          </CardTitle>
          <CardDescription>
            Goal coverage, update activity, and discussion status by employee.
          </CardDescription>
        </div>
        <Button asChild size="sm" variant="outline">
          <Link href="/manager/checkins">Open check-ins</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3 p-5 pt-0 sm:p-6 sm:pt-0">
        {members.map((member) => {
          const progress = getSafeProgress(member.averageProgress);

          return (
            <div
              className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
              key={member.id}
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex min-w-0 gap-3">
                  <UserAvatar
                    name={member.name}
                    size={42}
                    userId={member.id}
                    className="h-[42px] w-[42px]"
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-slate-950">
                        {member.name}
                      </h3>
                      <Badge
                        className={cn(
                          "border-transparent",
                          member.checkinCompleted
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        )}
                      >
                        {member.checkinCompleted
                          ? "Check-in completed"
                          : "Check-in pending"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">
                      {member.title} - {member.departmentName}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge className="border-transparent bg-blue-50 text-blue-700">
                    {member.updatedGoals}/{member.approvedGoals} updated
                  </Badge>
                  <ProgressScoreBadge score={progress} />
                </div>
              </div>
              <div className="mt-4 h-2.5 rounded-full bg-white ring-1 ring-slate-200">
                <div
                  className={cn(
                    "h-2.5 rounded-full",
                    progress >= 85
                      ? "bg-emerald-500"
                      : progress >= 50
                        ? "bg-blue-600"
                        : "bg-amber-500"
                  )}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function CoachingSignals({ signals }: { signals: CoachingSignal[] }) {
  return (
    <Card className="border-slate-200 bg-white shadow-subtle">
      <CardHeader className="p-5 sm:p-6">
        <CardTitle className="text-xl text-slate-950">Coaching focus</CardTitle>
        <CardDescription>
          Follow-ups that may need manager attention this quarter.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 p-5 pt-0 sm:p-6 sm:pt-0">
        {signals.length > 0 ? (
          signals.map((signal) => {
            return (
              <Link
                className="group block rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition hover:border-blue-200 hover:bg-blue-50/60"
                href={signal.href}
                key={signal.id}
              >
                <div className="flex items-start gap-3">
                  <UserAvatar
                    name={signal.employeeName}
                    size={40}
                    userId={signal.employeeId}
                    className="h-10 w-10"
                  />
                  <span className="min-w-0">
                    <span className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                      {signal.employeeName}
                      <ArrowRight
                        className="h-3.5 w-3.5 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-blue-700"
                        aria-hidden="true"
                      />
                    </span>
                    <span
                      className={cn(
                        "mt-1 block text-xs font-semibold",
                        accentStyles[signal.tone].text
                      )}
                    >
                      {signal.title}
                    </span>
                    <span className="mt-1 block text-sm leading-5 text-slate-600">
                      {signal.description}
                    </span>
                  </span>
                </div>
              </Link>
            );
          })
        ) : (
          <EmptyCard
            description="No urgent coaching signals are visible for the selected cycle."
            title="Team is on track"
          />
        )}
      </CardContent>
    </Card>
  );
}

function SharedGoalPanel({ sharedGoals }: { sharedGoals: SharedGoalPreview[] }) {
  return (
    <Card className="border-slate-200 bg-white shadow-subtle">
      <CardHeader className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
        <div>
          <CardTitle className="text-xl text-slate-950">Shared goals</CardTitle>
          <CardDescription>
            Department KPIs pushed to linked employee goal sheets.
          </CardDescription>
        </div>
        <Button asChild size="sm" variant="outline">
          <Link href="/manager/shared-goals">Manage shared goals</Link>
        </Button>
      </CardHeader>
      <CardContent className="grid gap-3 p-5 pt-0 sm:p-6 sm:pt-0 lg:grid-cols-2">
        {sharedGoals.length > 0 ? (
          sharedGoals.map((goal) => (
            <div
              className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
              key={goal.id}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="break-words text-sm font-semibold text-slate-950">
                    {goal.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {goal.assignmentCount} linked employees
                  </p>
                </div>
                <Badge className="border-transparent bg-emerald-50 text-emerald-700">
                  {goal.status}
                </Badge>
              </div>
              <div className="mt-4 h-2 rounded-full bg-white ring-1 ring-slate-200">
                <div
                  className="h-2 rounded-full bg-emerald-500"
                  style={{
                    width: `${
                      goal.assignmentCount > 0
                        ? (goal.syncedCount / goal.assignmentCount) * 100
                        : 0
                    }%`
                  }}
                />
              </div>
              <p className="mt-2 text-xs font-medium text-slate-500">
                {goal.syncedCount}/{goal.assignmentCount} assignments synced
              </p>
            </div>
          ))
        ) : (
          <div className="lg:col-span-2">
            <EmptyCard
              description="Create a shared goal to push department KPIs to multiple employees."
              title="No shared goals yet"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function ManagerDashboard({ data }: ManagerDashboardProps) {
  return (
    <div className="w-full space-y-6">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-subtle">
        <div className="grid gap-0 xl:grid-cols-[1.35fr_0.85fr]">
          <div className="relative min-h-[260px] overflow-hidden p-5 sm:p-7">
            <div className="absolute right-10 top-8 h-52 w-52 rounded-full bg-blue-100/70 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-28 w-80 rounded-full bg-slate-100 blur-2xl" />
            <div className="relative max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border-transparent bg-blue-50 text-blue-700">
                  {data.cycleName}
                </Badge>
                <Badge className="border-transparent bg-slate-100 text-slate-700">
                  Manager workspace
                </Badge>
              </div>
              <h1 className="mt-5 text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
                Good morning, {getFirstName(data.managerName)}
              </h1>
              <p className="mt-3 max-w-xl text-base leading-7 text-slate-600">
                Review submitted goals, guide quarterly check-ins, and keep team
                alignment moving with clear coaching signals.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                {data.primaryActions.map((action, index) => (
                  <Button
                    asChild
                    key={action.href}
                    variant={index === 0 ? "default" : "outline"}
                  >
                    <Link href={action.href}>
                      {action.title}
                      {index === 0 ? (
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      ) : null}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 bg-slate-50/70 p-5 sm:p-7 xl:border-l xl:border-t-0">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-subtle">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Team cycle
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

      <section className="grid gap-6 xl:grid-cols-[minmax(340px,0.6fr)_minmax(0,1.4fr)]">
        <ApprovalInbox approvals={data.approvals} />
        <TeamHealthList members={data.teamHealth} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <CoachingSignals signals={data.coachingSignals} />
        <SharedGoalPanel sharedGoals={data.sharedGoals} />
      </section>
    </div>
  );
}
