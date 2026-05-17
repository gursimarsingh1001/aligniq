import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BarChart3,
  CalendarRange,
  ClipboardCheck,
  FileText,
  FileClock,
  Gauge,
  ListChecks,
  ShieldAlert,
  ShieldCheck,
  Users
} from "lucide-react";

import { AdminMetricCard } from "@/components/admin/AdminMetricCard";
import { CompletionDashboard } from "@/components/admin/CompletionDashboard";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { ROUTES } from "@/lib/constants/routes";
import { getAuditLogRows } from "@/lib/services/audit-service";
import { getAdminDashboardSummary } from "@/lib/services/report-service";
import type { AuditLogRow } from "@/lib/types/audit";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils/formatters";

const metricIcons = {
  totalEmployees: <Users className="h-5 w-5" aria-hidden="true" />,
  goalsSubmitted: <ListChecks className="h-5 w-5" aria-hidden="true" />,
  goalsApproved: <ShieldCheck className="h-5 w-5" aria-hidden="true" />,
  pendingManagerApprovals: <Gauge className="h-5 w-5" aria-hidden="true" />,
  quarterlyUpdatesCompleted: (
    <ClipboardCheck className="h-5 w-5" aria-hidden="true" />
  ),
  managerCheckinsCompleted: <FileClock className="h-5 w-5" aria-hidden="true" />
};

const metricTones = {
  totalEmployees: "blue",
  goalsSubmitted: "emerald",
  goalsApproved: "emerald",
  pendingManagerApprovals: "amber",
  quarterlyUpdatesCompleted: "blue",
  managerCheckinsCompleted: "slate"
} as const;

function getAuditTone(action: AuditLogRow["action"]) {
  if (action === "approved" || action === "checkin_added") {
    return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  }

  if (action === "returned") {
    return "bg-amber-50 text-amber-700 ring-amber-100";
  }

  if (action === "cycle_opened" || action === "submitted") {
    return "bg-blue-50 text-blue-700 ring-blue-100";
  }

  return "bg-slate-100 text-slate-700 ring-slate-200";
}

export default function AdminDashboardPage() {
  const summary = getAdminDashboardSummary();
  const recentAuditLogs = getAuditLogRows({ limit: 4 });
  const readinessItems = [
    {
      label: "Goal submissions",
      value: summary.metrics.goalsSubmitted.value,
      helper: "Employees moved beyond draft"
    },
    {
      label: "Approvals pending",
      value: summary.metrics.pendingManagerApprovals.value,
      helper: "Submitted sets awaiting review"
    },
    {
      label: "Manager check-ins",
      value: summary.metrics.managerCheckinsCompleted.value,
      helper: "Discussion records saved"
    }
  ];
  const shortcuts = [
    {
      title: "Reports",
      description: "Review planned target vs actual achievement.",
      href: ROUTES.ADMIN_REPORTS,
      icon: <BarChart3 className="h-4 w-4" aria-hidden="true" />
    },
    {
      title: "Audit Logs",
      description: "Trace approvals, check-ins, and cycle events.",
      href: ROUTES.ADMIN_AUDIT_LOGS,
      icon: <FileClock className="h-4 w-4" aria-hidden="true" />
    },
    {
      title: "Cycles",
      description: "Review quarterly windows and active state.",
      href: ROUTES.ADMIN_CYCLES,
      icon: <CalendarRange className="h-4 w-4" aria-hidden="true" />
    },
    {
      title: "Analytics",
      description: "Open trends, heatmaps, and at-risk visibility.",
      href: ROUTES.ADMIN_ANALYTICS,
      icon: <Activity className="h-4 w-4" aria-hidden="true" />
    }
  ];

  return (
    <AppShell>
      <div className="w-full space-y-6">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-subtle">
          <div className="grid xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
            <div className="relative overflow-hidden p-5 sm:p-7">
              <div className="absolute right-8 top-6 h-48 w-48 rounded-full bg-blue-100/70 blur-3xl" />
              <div className="absolute -bottom-10 left-8 h-36 w-72 rounded-full bg-slate-100 blur-2xl" />
              <div className="relative max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    Admin / HR workspace
                  </span>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Governance active
                  </span>
                </div>
                <h1 className="mt-5 text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
                  HR Control Center
                </h1>
                <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                  Monitor organization-wide goal completion, approval readiness,
                  quarterly updates, and audit activity from a single workspace.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button asChild>
                    <Link href={ROUTES.ADMIN_REPORTS}>
                      View reports
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href={ROUTES.ADMIN_AUDIT_LOGS}>Review audit logs</Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 bg-slate-50/70 p-5 sm:p-7 xl:border-l xl:border-t-0">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-subtle">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Program readiness
                    </p>
                    <h2 className="mt-1 text-lg font-semibold text-slate-950">
                      FY26 Q2 oversight
                    </h2>
                  </div>
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                    <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>

                <dl className="mt-5 grid gap-3">
                  {readinessItems.map((item) => (
                    <div
                      className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-3 py-2"
                      key={item.label}
                    >
                      <dt className="min-w-0">
                        <p className="text-sm font-medium text-slate-700">
                          {item.label}
                        </p>
                        <p className="text-xs text-slate-500">{item.helper}</p>
                      </dt>
                      <dd className="text-right text-lg font-semibold text-slate-950">
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {Object.entries(summary.metrics).map(([key, metric]) => (
            <AdminMetricCard
              icon={metricIcons[key as keyof typeof metricIcons]}
              key={key}
              metric={metric}
              tone={metricTones[key as keyof typeof metricTones]}
            />
          ))}
        </section>

        <CompletionDashboard
          exceptions={summary.exceptions}
          items={summary.completion}
        />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_25rem]">
          <Card className="overflow-hidden border-slate-200 bg-white shadow-subtle">
            <CardHeader className="border-b border-slate-200 bg-slate-50/70 p-5 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle className="text-xl text-slate-950">
                    Recent Audit Activity
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Latest governance events across submissions, updates, and
                    check-ins.
                  </CardDescription>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href={ROUTES.ADMIN_AUDIT_LOGS}>View all</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 p-5 sm:p-6">
              {recentAuditLogs.map((log) => (
                <div
                  className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
                  key={log.id}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1",
                        getAuditTone(log.action)
                      )}
                    >
                      <FileText className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="font-semibold text-slate-950">
                          {log.actionLabel}
                        </span>
                        <span className="text-slate-500">
                          {formatDate(log.createdAt)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {log.summary}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-subtle">
            <CardHeader className="p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <ShieldAlert className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <CardTitle className="text-xl text-slate-950">
                    Governance Shortcuts
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Jump to reporting, audit, cycle, and analytics workspaces.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 p-5 pt-0 sm:p-6 sm:pt-0">
              {shortcuts.map((shortcut) => (
                <Link
                  className="group rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition hover:border-blue-200 hover:bg-blue-50/60"
                  href={shortcut.href}
                  key={shortcut.href}
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-blue-700 ring-1 ring-slate-200">
                      {shortcut.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-slate-950">
                          {shortcut.title}
                        </p>
                        <ArrowRight
                          className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-blue-700"
                          aria-hidden="true"
                        />
                      </div>
                      <p className="mt-1 text-sm leading-5 text-slate-600">
                        {shortcut.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}


