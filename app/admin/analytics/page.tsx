import { Activity, ArrowRight, BarChart3, TrendingUp } from "lucide-react";

import { AnalyticsMetricCard } from "@/components/admin/AnalyticsMetricCard";
import { AtRiskGoalsTable } from "@/components/admin/AtRiskGoalsTable";
import { CompletionHeatmap } from "@/components/admin/CompletionHeatmap";
import { GoalDistributionChart } from "@/components/admin/GoalDistributionChart";
import { GoalTrendChart } from "@/components/admin/GoalTrendChart";
import { ManagerEffectivenessTable } from "@/components/admin/ManagerEffectivenessTable";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { ROUTES } from "@/lib/constants/routes";
import { getAnalyticsDashboard } from "@/lib/services/analytics-service";

export default function AdminAnalyticsPage() {
  const analytics = getAnalyticsDashboard();
  const departmentDistribution = analytics.departmentCompletion.map((item) => ({
    label: item.departmentName,
    value: item.completed,
    percent: item.completionRate
  }));
  const atRiskCount = analytics.atRiskGoals.length;
  const managerCount = analytics.managerEffectiveness.length;

  return (
    <AppShell>
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
                  <Badge className="border-transparent bg-emerald-50 text-emerald-700">
                    Analytics workspace
                  </Badge>
                </div>
                <h1 className="mt-5 text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
                  Performance Analytics
                </h1>
                <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                  Review goal achievement trends, departmental completion health,
                  manager effectiveness, and at-risk goal visibility.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button asChild>
                    <a href="#completion-heatmap">
                      View heatmap
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </Button>
                  <Button asChild variant="outline">
                    <a href={ROUTES.ADMIN_REPORTS}>Open reports</a>
                  </Button>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 bg-slate-50/70 p-5 sm:p-7 xl:border-l xl:border-t-0">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-subtle">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Analytics coverage
                    </p>
                    <h2 className="mt-1 text-lg font-semibold text-slate-950">
                      FY26 Q2 visibility
                    </h2>
                  </div>
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                    <Activity className="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>
                <dl className="mt-5 grid gap-3 text-sm">
                  <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-3 py-2">
                    <dt className="text-slate-500">Departments</dt>
                    <dd className="font-semibold text-slate-950">
                      {analytics.departmentCompletion.length}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-3 py-2">
                    <dt className="text-slate-500">Managers reviewed</dt>
                    <dd className="font-semibold text-slate-950">{managerCount}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-3 py-2">
                    <dt className="text-slate-500">At-risk goals</dt>
                    <dd className="font-semibold text-slate-950">{atRiskCount}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {analytics.metrics.map((metric, index) => (
            <AnalyticsMetricCard key={metric.label} metric={metric} index={index} />
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_26rem]">
          <GoalTrendChart data={analytics.goalTrends} />
          <GoalDistributionChart
            title="Department Completion"
            description="Completed quarterly updates by department."
            items={departmentDistribution}
          />
        </section>

        <section id="completion-heatmap" className="scroll-mt-24">
          <CompletionHeatmap rows={analytics.completionHeatmap} />
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <GoalDistributionChart
            title="Thrust Area Distribution"
            description="Goal mix by strategic thrust area."
            items={analytics.thrustAreaDistribution}
          />
          <GoalDistributionChart
            title="Measurement Distribution"
            description="Goal mix by measurement type."
            items={analytics.uomTypeDistribution}
          />
        </section>

        <Card className="overflow-hidden border-slate-200 bg-white shadow-subtle">
          <CardHeader className="border-b border-slate-200 bg-slate-50/70 p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100">
                <TrendingUp className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <CardTitle className="text-xl text-slate-950">
                  Manager Effectiveness
                </CardTitle>
                <CardDescription className="mt-1">
                  Based on manager check-in completion, pending approvals, and
                  average team progress score.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5 sm:p-6">
            <ManagerEffectivenessTable rows={analytics.managerEffectiveness} />
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-slate-200 bg-white shadow-subtle">
          <CardHeader className="border-b border-slate-200 bg-slate-50/70 p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 ring-1 ring-amber-100">
                <BarChart3 className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <CardTitle className="text-xl text-slate-950">
                  At-risk Goals and Employees
                </CardTitle>
                <CardDescription className="mt-1">
                  Goals with pending updates, pending approvals, returned status,
                  or low tracking progress.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5 sm:p-6">
            <AtRiskGoalsTable rows={analytics.atRiskGoals} />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
