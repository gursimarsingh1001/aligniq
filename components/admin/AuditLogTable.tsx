import {
  CheckCircle2,
  Clock3,
  Database,
  FileText,
  RotateCcw,
  Send,
  ShieldCheck,
  UserRound
} from "lucide-react";

import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { ROLES } from "@/lib/constants/roles";
import type { AuditAction, AuditLogRow } from "@/lib/types/audit";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils/formatters";

type AuditLogTableProps = {
  logs: AuditLogRow[];
};

const actionStyles: Record<
  AuditAction,
  {
    badge: string;
    icon: string;
    Icon: typeof FileText;
  }
> = {
  approved: {
    badge: "bg-emerald-50 text-emerald-700",
    icon: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    Icon: ShieldCheck
  },
  checkin_added: {
    badge: "bg-emerald-50 text-emerald-700",
    icon: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    Icon: CheckCircle2
  },
  created: {
    badge: "bg-blue-50 text-blue-700",
    icon: "bg-blue-50 text-blue-700 ring-blue-100",
    Icon: FileText
  },
  cycle_opened: {
    badge: "bg-blue-50 text-blue-700",
    icon: "bg-blue-50 text-blue-700 ring-blue-100",
    Icon: Clock3
  },
  assigned: {
    badge: "bg-blue-50 text-blue-700",
    icon: "bg-blue-50 text-blue-700 ring-blue-100",
    Icon: Send
  },
  pushed: {
    badge: "bg-blue-50 text-blue-700",
    icon: "bg-blue-50 text-blue-700 ring-blue-100",
    Icon: Send
  },
  returned: {
    badge: "bg-amber-50 text-amber-700",
    icon: "bg-amber-50 text-amber-700 ring-amber-100",
    Icon: RotateCcw
  },
  synced: {
    badge: "bg-emerald-50 text-emerald-700",
    icon: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    Icon: CheckCircle2
  },
  submitted: {
    badge: "bg-blue-50 text-blue-700",
    icon: "bg-blue-50 text-blue-700 ring-blue-100",
    Icon: Send
  },
  updated: {
    badge: "bg-slate-100 text-slate-700",
    icon: "bg-slate-100 text-slate-700 ring-slate-200",
    Icon: FileText
  }
};

function getLogDetails(log: AuditLogRow) {
  return log.details !== "-" ? log.details : log.summary;
}

function ValueBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm font-medium text-slate-950">
        {value}
      </dd>
    </div>
  );
}

function ActorCell({ log }: { log: AuditLogRow }) {
  if (!log.actorId) {
    return (
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 ring-1 ring-slate-200">
          <UserRound className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="break-words font-medium text-slate-950">
          {log.actorName}
        </span>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 items-center gap-3">
      <UserAvatar
        name={log.actorName}
        role={ROLES.EMPLOYEE}
        size={36}
        userId={log.actorId}
        className="h-9 w-9"
      />
      <span className="break-words font-medium text-slate-950">
        {log.actorName}
      </span>
    </div>
  );
}

export function AuditLogTable({ logs }: AuditLogTableProps) {
  if (logs.length === 0) {
    return (
      <AdminEmptyState
        title="No audit logs found"
        description="Try adjusting the filters or review again after user activity is recorded."
      />
    );
  }

  return (
    <div className="min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-subtle">
      <div className="border-b border-slate-200 bg-slate-50/70 p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-normal text-slate-950">
              Governance Activity
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Newest events appear first with actor, action, entity, and value
              changes.
            </p>
          </div>
          <Badge className="w-fit border-transparent bg-blue-50 text-blue-700">
            {logs.length} records
          </Badge>
        </div>
      </div>

      <div className="hidden overflow-x-auto xl:block">
        <table className="w-full min-w-[1160px] table-fixed text-left text-sm">
          <thead className="border-b border-slate-200 bg-white text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="w-[12%] px-5 py-3 font-semibold">Timestamp</th>
              <th className="w-[15%] px-5 py-3 font-semibold">Actor</th>
              <th className="w-[12%] px-5 py-3 font-semibold">Action</th>
              <th className="w-[18%] px-5 py-3 font-semibold">Entity</th>
              <th className="w-[12%] px-5 py-3 font-semibold">Old value</th>
              <th className="w-[12%] px-5 py-3 font-semibold">New value</th>
              <th className="w-[19%] px-5 py-3 font-semibold">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {logs.map((log) => {
              const actionStyle = actionStyles[log.action];

              return (
                <tr className="align-top transition hover:bg-slate-50" key={log.id}>
                  <td className="px-5 py-4 text-slate-600">
                    {formatDate(log.createdAt)}
                  </td>
                  <td className="px-5 py-4">
                    <ActorCell log={log} />
                  </td>
                  <td className="px-5 py-4">
                    <Badge
                      className={cn("border-transparent", actionStyle.badge)}
                    >
                      {log.actionLabel}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex min-w-0 gap-3">
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                        <Database className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="break-words font-medium text-slate-950">
                          {log.entityTypeLabel}
                        </p>
                        <p className="mt-1 break-words text-slate-500">
                          {log.entityName}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="break-words px-5 py-4 text-slate-700">
                    {log.oldValue}
                  </td>
                  <td className="break-words px-5 py-4 text-slate-700">
                    {log.newValue}
                  </td>
                  <td className="break-words px-5 py-4 leading-6 text-slate-600">
                    {getLogDetails(log)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 p-4 xl:hidden">
        {logs.map((log) => {
          const actionStyle = actionStyles[log.action];
          const Icon = actionStyle.Icon;

          return (
            <article
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              key={log.id}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 gap-3">
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ring-1",
                      actionStyle.icon
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        className={cn("border-transparent", actionStyle.badge)}
                      >
                        {log.actionLabel}
                      </Badge>
                      <span className="text-xs text-slate-500">
                        {formatDate(log.createdAt)}
                      </span>
                    </div>
                    <p className="mt-2 break-words font-semibold text-slate-950">
                      {log.summary}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <ActorCell log={log} />
              </div>

              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <ValueBlock label="Entity" value={`${log.entityTypeLabel} - ${log.entityName}`} />
                <ValueBlock label="Old value" value={log.oldValue} />
                <ValueBlock label="New value" value={log.newValue} />
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 sm:col-span-2">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Details
                  </dt>
                  <dd className="mt-1 break-words text-sm leading-6 text-slate-700">
                    {getLogDetails(log)}
                  </dd>
                </div>
              </dl>
            </article>
          );
        })}
      </div>
    </div>
  );
}
