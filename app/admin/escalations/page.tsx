import {
  AlertTriangle,
  BellRing,
  CheckCircle2,
  ShieldAlert,
  Workflow
} from "lucide-react";

import { EscalationLogTable } from "@/components/admin/EscalationLogTable";
import { EscalationRulesPanel } from "@/components/admin/EscalationRulesPanel";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import {
  getEscalationLogs,
  getEscalationRules,
  getEscalationSummary
} from "@/lib/services/escalation-service";
import { cn } from "@/lib/utils";

type EscalationMetricProps = {
  helper: string;
  icon: typeof AlertTriangle;
  label: string;
  tone: "amber" | "blue" | "emerald" | "red";
  value: number;
};

const metricToneStyles = {
  amber: {
    icon: "bg-amber-50 text-amber-700 ring-amber-100",
    bar: "bg-amber-500"
  },
  blue: {
    icon: "bg-blue-50 text-blue-700 ring-blue-100",
    bar: "bg-blue-600"
  },
  emerald: {
    icon: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    bar: "bg-emerald-500"
  },
  red: {
    icon: "bg-red-50 text-red-700 ring-red-100",
    bar: "bg-red-500"
  }
} as const;

function EscalationMetric({
  helper,
  icon: Icon,
  label,
  tone,
  value
}: EscalationMetricProps) {
  const styles = metricToneStyles[tone];

  return (
    <Card className="overflow-hidden border-slate-200 bg-white shadow-subtle">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {label}
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-normal text-slate-950">
              {value}
            </p>
          </div>
          <span
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ring-1",
              styles.icon
            )}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
        </div>
        <div className="mt-4 h-2 rounded-full bg-slate-100">
          <div
            className={cn("h-2 rounded-full", styles.bar)}
            style={{ width: `${Math.min(Math.max(value * 28, 18), 100)}%` }}
          />
        </div>
        <p className="mt-3 text-sm leading-5 text-slate-600">{helper}</p>
      </CardContent>
    </Card>
  );
}

export default function AdminEscalationsPage() {
  const rules = getEscalationRules();
  const logs = getEscalationLogs();
  const summary = getEscalationSummary();

  return (
    <AppShell contentClassName="mx-0 w-full max-w-none py-4">
      <div className="w-full space-y-6">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-subtle">
          <div className="grid xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
            <div className="relative overflow-hidden p-5 sm:p-7">
              <div className="absolute right-8 top-6 h-48 w-48 rounded-full bg-amber-100/70 blur-3xl" />
              <div className="absolute -bottom-12 left-8 h-36 w-80 rounded-full bg-slate-100 blur-2xl" />
              <div className="relative max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="border-transparent bg-blue-50 text-blue-700">
                    Admin / HR
                  </Badge>
                  <Badge className="border-transparent bg-amber-50 text-amber-700">
                    Rule-based escalations
                  </Badge>
                </div>
                <h1 className="mt-5 text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
                  Escalations
                </h1>
                <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                  Monitor missed goal submissions, delayed approvals, and
                  incomplete quarterly check-ins with clear follow-up ownership.
                </p>
              </div>
            </div>

            <div className="border-t border-slate-200 bg-slate-50/70 p-5 sm:p-7 xl:border-l xl:border-t-0">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-subtle">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Evaluation model
                    </p>
                    <h2 className="mt-1 text-lg font-semibold text-slate-950">
                      Scheduled governance rules
                    </h2>
                  </div>
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                    <Workflow className="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  Rule-based escalations can be evaluated by scheduled jobs in
                  production.
                </p>
                <div className="mt-5 flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-3 py-2">
                  <span className="text-sm text-slate-500">Configured rules</span>
                  <span className="font-semibold text-slate-950">
                    {rules.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <EscalationMetric
            helper="Items waiting for action."
            icon={AlertTriangle}
            label="Open"
            tone="amber"
            value={summary.open}
          />
          <EscalationMetric
            helper="Items where stakeholders were notified."
            icon={BellRing}
            label="Notified"
            tone="blue"
            value={summary.notified}
          />
          <EscalationMetric
            helper="Items closed after follow-up."
            icon={CheckCircle2}
            label="Resolved"
            tone="emerald"
            value={summary.resolved}
          />
          <EscalationMetric
            helper="Critical workflows needing HR attention."
            icon={ShieldAlert}
            label="High severity"
            tone="red"
            value={summary.highSeverity}
          />
        </section>

        <EscalationRulesPanel rules={rules} />

        <EscalationLogTable logs={logs} />
      </div>
    </AppShell>
  );
}
