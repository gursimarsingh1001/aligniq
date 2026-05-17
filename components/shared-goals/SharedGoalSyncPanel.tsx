import { RefreshCw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/UserAvatar";
import type { AlignIQUser } from "@/lib/types/user";
import type { SharedGoalWithAssignments } from "@/lib/types/shared-goal";
import { formatDate, formatNumber } from "@/lib/utils/formatters";

type SharedGoalSyncPanelProps = {
  employees: AlignIQUser[];
  goal: SharedGoalWithAssignments;
};

function getEmployeeName(employees: AlignIQUser[], employeeId: string) {
  return employees.find((employee) => employee.id === employeeId)?.name ?? employeeId;
}

function getEmployee(employees: AlignIQUser[], employeeId: string) {
  return employees.find((employee) => employee.id === employeeId) ?? null;
}

export function SharedGoalSyncPanel({
  employees,
  goal
}: SharedGoalSyncPanelProps) {
  const primaryAssignment =
    goal.assignments.find((assignment) => assignment.isPrimaryOwner) ?? null;
  const primaryOwner = getEmployee(employees, goal.primaryOwnerId);
  const recipientCount = goal.assignments.filter(
    (assignment) => !assignment.isPrimaryOwner
  ).length;
  const syncStatusLabel =
    primaryAssignment?.syncStatus === "synced"
      ? "Synced"
      : primaryAssignment?.syncStatus === "conflict"
        ? "Conflict"
        : "Pending";

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-subtle">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-1 gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <RefreshCw className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h3 className="text-base font-semibold tracking-normal text-slate-950">
              Achievement sync
            </h3>
            <p className="mt-1 max-w-full break-words text-sm leading-5 text-slate-600">
              Primary owner achievement syncs to linked sheets.
            </p>
          </div>
        </div>
        <Badge className="w-fit shrink-0 whitespace-nowrap border-transparent bg-slate-100 text-slate-700">
          {recipientCount} recipients
        </Badge>
      </div>

      <dl className="mt-5 grid gap-3 text-sm md:grid-cols-2 2xl:grid-cols-1">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Primary owner
          </dt>
          <dd className="mt-2 break-words font-medium text-slate-950">
            <span className="flex min-w-0 items-center gap-2">
              <UserAvatar
                name={primaryOwner?.name ?? getEmployeeName(employees, goal.primaryOwnerId)}
                role={primaryOwner?.role}
                size={32}
                userId={primaryOwner?.id ?? goal.primaryOwnerId}
                className="h-8 w-8"
              />
              <span className="min-w-0 break-words leading-5">
                {getEmployeeName(employees, goal.primaryOwnerId)}
              </span>
            </span>
          </dd>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Last synced achievement
          </dt>
          <dd className="mt-1 font-medium text-slate-950">
            {formatNumber(primaryAssignment?.achievementValue)}
          </dd>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Completion date
          </dt>
          <dd className="mt-1 font-medium text-slate-950">
            {formatDate(primaryAssignment?.completionDate)}
          </dd>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Sync status
          </dt>
          <dd className="mt-1 font-medium text-slate-950">
            {syncStatusLabel}
          </dd>
        </div>
      </dl>
    </section>
  );
}
