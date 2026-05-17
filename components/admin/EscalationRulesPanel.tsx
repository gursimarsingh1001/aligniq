import { Clock3, Route, Workflow } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import type { EscalationRule } from "@/lib/types/escalation";

type EscalationRulesPanelProps = {
  rules: EscalationRule[];
};

export function EscalationRulesPanel({ rules }: EscalationRulesPanelProps) {
  return (
    <Card className="overflow-hidden border-slate-200 bg-white shadow-subtle">
      <CardHeader className="border-b border-slate-200 bg-slate-50/70 p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100">
              <Workflow className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <CardTitle className="text-xl text-slate-950">
                Rule Configuration
              </CardTitle>
              <CardDescription className="mt-1">
                Read-only escalation rules for workflow governance.
              </CardDescription>
            </div>
          </div>
          <Badge className="w-fit border-transparent bg-blue-50 text-blue-700">
            {rules.length} rules
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 p-5 sm:p-6 lg:grid-cols-3">
        {rules.map((rule) => (
          <article
            className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
            key={rule.id}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="break-words font-semibold text-slate-950">
                {rule.name}
              </p>
              <Badge
                className={
                  rule.isActive
                    ? "border-transparent bg-emerald-50 text-emerald-700"
                    : "border-transparent bg-slate-100 text-slate-700"
                }
              >
                {rule.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {rule.description}
            </p>
            <dl className="mt-4 grid gap-3 text-sm">
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                  Threshold
                </dt>
                <dd className="mt-1 break-words font-medium text-slate-950">
                  {rule.thresholdLabel}
                </dd>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <Route className="h-3.5 w-3.5" aria-hidden="true" />
                  Escalation chain
                </dt>
                <dd className="mt-1 break-words font-medium text-slate-950">
                  {rule.escalationChain}
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
