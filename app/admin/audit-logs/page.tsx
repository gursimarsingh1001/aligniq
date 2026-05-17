"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  FileClock,
  Filter,
  RotateCcw,
  ShieldCheck,
  Users
} from "lucide-react";

import { AuditLogTable } from "@/components/admin/AuditLogTable";
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
import { getAuditLogRows } from "@/lib/services/audit-service";
import type { AuditAction, AuditEntityType } from "@/lib/types/audit";
import { formatDate } from "@/lib/utils/formatters";

const ALL_FILTER_VALUE = "all";

type FilterOption<T extends string> = {
  label: string;
  value: T;
};

function getUniqueValues<T extends string>(values: T[]) {
  return Array.from(new Set(values)).sort((first, second) =>
    first.localeCompare(second)
  );
}

function MetricTile({
  helper,
  icon: Icon,
  label,
  value
}: {
  helper: string;
  icon: typeof Activity;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {label}
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-normal text-slate-950">
            {value}
          </p>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 text-sm leading-5 text-slate-600">{helper}</p>
    </div>
  );
}

function AdminAuditLogsContent() {
  const logs = useMemo(() => getAuditLogRows(), []);
  const [action, setAction] = useState<string>(ALL_FILTER_VALUE);
  const [entityType, setEntityType] = useState<string>(ALL_FILTER_VALUE);
  const [actor, setActor] = useState(ALL_FILTER_VALUE);
  const actionOptions = useMemo<FilterOption<AuditAction>[]>(
    () =>
      getUniqueValues(logs.map((log) => log.action)).map((value) => ({
        label: logs.find((log) => log.action === value)?.actionLabel ?? value,
        value
      })),
    [logs]
  );
  const entityTypeOptions = useMemo<FilterOption<AuditEntityType>[]>(
    () =>
      getUniqueValues(logs.map((log) => log.entityType)).map((value) => ({
        label:
          logs.find((log) => log.entityType === value)?.entityTypeLabel ?? value,
        value
      })),
    [logs]
  );
  const actorOptions = useMemo(
    () => getUniqueValues(logs.map((log) => log.actorName)),
    [logs]
  );
  const filteredLogs = useMemo(
    () =>
      logs
        .filter((log) => action === ALL_FILTER_VALUE || log.action === action)
        .filter(
          (log) =>
            entityType === ALL_FILTER_VALUE || log.entityType === entityType
        )
        .filter((log) => actor === ALL_FILTER_VALUE || log.actorName === actor),
    [action, actor, entityType, logs]
  );
  const latestLog = logs[0] ?? null;
  const uniqueActors = getUniqueValues(logs.map((log) => log.actorName)).length;
  const selectedFilterCount = [action, entityType, actor].filter(
    (value) => value !== ALL_FILTER_VALUE
  ).length;

  function resetFilters() {
    setAction(ALL_FILTER_VALUE);
    setEntityType(ALL_FILTER_VALUE);
    setActor(ALL_FILTER_VALUE);
  }

  return (
    <div className="w-full space-y-6">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-subtle">
        <div className="grid xl:grid-cols-[minmax(0,1.25fr)_minmax(340px,0.75fr)]">
          <div className="relative overflow-hidden p-5 sm:p-7">
            <div className="absolute right-8 top-6 h-48 w-48 rounded-full bg-blue-100/70 blur-3xl" />
            <div className="absolute -bottom-12 left-8 h-36 w-80 rounded-full bg-slate-100 blur-2xl" />
            <div className="relative max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border-transparent bg-blue-50 text-blue-700">
                  Admin / HR
                </Badge>
                <Badge className="border-transparent bg-emerald-50 text-emerald-700">
                  Governance trail
                </Badge>
              </div>
              <h1 className="mt-5 text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
                Audit Logs
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                Review goal, approval, quarterly update, shared goal, and
                manager check-in changes with actor and timestamp visibility.
              </p>
            </div>
          </div>

          <div className="border-t border-slate-200 bg-slate-50/70 p-5 sm:p-7 xl:border-l xl:border-t-0">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-subtle">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Latest activity
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-slate-950">
                    {latestLog ? latestLog.actionLabel : "No activity"}
                  </h2>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                {latestLog
                  ? latestLog.summary
                  : "Audit events will appear once workflow activity is recorded."}
              </p>
              {latestLog ? (
                <p className="mt-3 text-xs font-medium text-slate-500">
                  {formatDate(latestLog.createdAt)}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricTile
          helper="Total governance events captured."
          icon={FileClock}
          label="Audit events"
          value={logs.length}
        />
        <MetricTile
          helper="People and system actors with recorded actions."
          icon={Users}
          label="Actors"
          value={uniqueActors}
        />
        <MetricTile
          helper="Events matching the selected filters."
          icon={Filter}
          label="Filtered results"
          value={filteredLogs.length}
        />
        <MetricTile
          helper="Action, entity, and actor filters currently applied."
          icon={Activity}
          label="Active filters"
          value={selectedFilterCount}
        />
      </section>

      <Card className="border-slate-200 bg-white shadow-subtle">
        <CardHeader className="border-b border-slate-200 bg-slate-50/70 p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="text-xl text-slate-950">
                Audit Filters
              </CardTitle>
              <CardDescription className="mt-1">
                Narrow governance activity by action type, entity type, or actor.
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={resetFilters}
              disabled={selectedFilterCount === 0}
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reset
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-5 sm:p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="grid gap-2 text-sm">
              <span className="font-semibold text-slate-950">Action</span>
              <select
                className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition focus:border-blue-300 focus:bg-white focus-visible:ring-2 focus-visible:ring-blue-100"
                value={action}
                onChange={(event) => setAction(event.target.value)}
              >
                <option value={ALL_FILTER_VALUE}>All actions</option>
                {actionOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm">
              <span className="font-semibold text-slate-950">Entity Type</span>
              <select
                className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition focus:border-blue-300 focus:bg-white focus-visible:ring-2 focus-visible:ring-blue-100"
                value={entityType}
                onChange={(event) => setEntityType(event.target.value)}
              >
                <option value={ALL_FILTER_VALUE}>All entities</option>
                {entityTypeOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm">
              <span className="font-semibold text-slate-950">Actor</span>
              <select
                className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition focus:border-blue-300 focus:bg-white focus-visible:ring-2 focus-visible:ring-blue-100"
                value={actor}
                onChange={(event) => setActor(event.target.value)}
              >
                <option value={ALL_FILTER_VALUE}>All actors</option>
                {actorOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </CardContent>
      </Card>

      <AuditLogTable logs={filteredLogs} />
    </div>
  );
}

export default function AdminAuditLogsPage() {
  return (
    <AppShell>
      <AdminAuditLogsContent />
    </AppShell>
  );
}
