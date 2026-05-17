import Link from "next/link";
import { AlertTriangle, ArrowRight, Clock3 } from "lucide-react";

import { EscalationStatusBadge } from "@/components/admin/EscalationStatusBadge";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { ROLES } from "@/lib/constants/roles";
import { ESCALATION_TYPE_LABELS } from "@/lib/services/escalation-service";
import type { EscalationLog } from "@/lib/types/escalation";
import { formatDate } from "@/lib/utils/formatters";

type EscalationLogTableProps = {
  logs: EscalationLog[];
};

function getEscalationTargetHref(log: EscalationLog) {
  return {
    pathname: log.targetRoute,
    query: {
      highlight: log.highlightId
    }
  };
}

function PeopleCell({ log }: { log: EscalationLog }) {
  return (
    <div className="grid gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <UserAvatar
          name={log.affectedEmployeeName}
          role={ROLES.EMPLOYEE}
          size={36}
          className="h-9 w-9"
        />
        <div className="min-w-0">
          <p className="break-words font-semibold text-slate-950">
            {log.affectedEmployeeName}
          </p>
          <p className="text-xs text-slate-500">Employee</p>
        </div>
      </div>
      <div className="flex min-w-0 items-center gap-3">
        <UserAvatar
          name={log.affectedManagerName}
          role={ROLES.MANAGER}
          size={30}
          className="h-[30px] w-[30px]"
        />
        <div className="min-w-0">
          <p className="break-words text-sm font-medium text-slate-700">
            {log.affectedManagerName}
          </p>
          <p className="text-xs text-slate-500">Manager</p>
        </div>
      </div>
    </div>
  );
}

export function EscalationLogTable({ logs }: EscalationLogTableProps) {
  if (logs.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
        No escalations found.
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-subtle">
      <div className="border-b border-slate-200 bg-slate-50/70 p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 ring-1 ring-amber-100">
              <AlertTriangle className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xl font-semibold tracking-normal text-slate-950">
                Escalation Log
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Escalation events showing affected people, trigger reason,
                severity, status, created date, and next action.
              </p>
            </div>
          </div>
          <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            {logs.length} events
          </span>
        </div>
      </div>

      <div className="hidden overflow-x-auto xl:block">
        <table className="w-full min-w-[1160px] table-fixed text-left text-sm">
          <thead className="border-b border-slate-200 bg-white text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="w-[17%] px-5 py-3 font-semibold">Type</th>
              <th className="w-[19%] px-5 py-3 font-semibold">Affected People</th>
              <th className="w-[25%] px-5 py-3 font-semibold">Reason</th>
              <th className="w-[10%] px-5 py-3 font-semibold">Severity</th>
              <th className="w-[10%] px-5 py-3 font-semibold">Status</th>
              <th className="w-[9%] px-5 py-3 font-semibold">Created</th>
              <th className="w-[10%] px-5 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {logs.map((log) => (
              <tr className="align-top transition hover:bg-slate-50" key={log.id}>
                <td className="px-5 py-4">
                  <div className="flex min-w-0 gap-3">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                      <Clock3 className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <p className="break-words font-semibold text-slate-950">
                      {ESCALATION_TYPE_LABELS[log.type]}
                    </p>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <PeopleCell log={log} />
                </td>
                <td className="break-words px-5 py-4 leading-6 text-slate-600">
                  {log.triggerReason}
                  <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200">
                    {log.nextAction}
                  </p>
                </td>
                <td className="px-5 py-4">
                  <EscalationStatusBadge severity={log.severity} />
                </td>
                <td className="px-5 py-4">
                  <EscalationStatusBadge status={log.status} />
                </td>
                <td className="px-5 py-4 text-slate-600">
                  {formatDate(log.createdAt)}
                </td>
                <td className="px-5 py-4">
                  <Button asChild variant="outline" size="sm">
                    <Link href={getEscalationTargetHref(log)}>
                      View details
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 p-4 xl:hidden">
        {logs.map((log) => (
          <article
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            key={log.id}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                  <AlertTriangle className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="break-words font-semibold text-slate-950">
                    {ESCALATION_TYPE_LABELS[log.type]}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {formatDate(log.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <EscalationStatusBadge severity={log.severity} />
                <EscalationStatusBadge status={log.status} />
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <PeopleCell log={log} />
            </div>

            <dl className="mt-4 grid gap-3 text-sm">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Trigger reason
                </dt>
                <dd className="mt-1 break-words leading-6 text-slate-700">
                  {log.triggerReason}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Next action
                </dt>
                <dd className="mt-1 break-words leading-6 text-slate-700">
                  {log.nextAction}
                </dd>
              </div>
            </dl>
            <Button asChild variant="outline" className="mt-4">
              <Link href={getEscalationTargetHref(log)}>
                View details
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </article>
        ))}
      </div>
    </section>
  );
}
