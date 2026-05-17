import { BarChart3, ClipboardCheck, Target } from "lucide-react";

import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { ProgressScoreBadge } from "@/components/checkins/ProgressScoreBadge";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/UserAvatar";
import {
  CHECKIN_PROGRESS_STATUS_LABELS,
  type CheckinProgressStatus
} from "@/lib/constants/checkin-windows";
import { GOAL_STATUS_LABELS } from "@/lib/constants/goal-status";
import { ROLES } from "@/lib/constants/roles";
import type { AchievementReportRow } from "@/lib/types/report";
import { cn } from "@/lib/utils";
import { formatUomLabel } from "@/lib/utils/formatters";

type AchievementReportTableProps = {
  rows: AchievementReportRow[];
  highlightedId?: string | null;
};

function formatEmployeeStatus(status: AchievementReportRow["employeeStatus"]) {
  if (status === "pending") {
    return "Pending";
  }

  return CHECKIN_PROGRESS_STATUS_LABELS[status as CheckinProgressStatus];
}

function formatCompletionStatus(
  status: AchievementReportRow["checkinCompletionStatus"]
) {
  if (status === "completed") {
    return "Completed";
  }

  if (status === "not_applicable") {
    return "Not Applicable";
  }

  return "Pending";
}

function getReportHighlightId(row: AchievementReportRow) {
  return `employee-${row.employeeName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;
}

function getStatusBadgeClass(row: AchievementReportRow) {
  if (row.checkinCompletionStatus === "completed") {
    return "border-transparent bg-emerald-50 text-emerald-700";
  }

  if (row.employeeStatus === "pending") {
    return "border-transparent bg-slate-100 text-slate-700";
  }

  return "border-transparent bg-amber-50 text-amber-700";
}

function ReportStatus({ row }: { row: AchievementReportRow }) {
  return (
    <div className="space-y-2">
      <Badge className={getStatusBadgeClass(row)}>
        {formatEmployeeStatus(row.employeeStatus)}
      </Badge>
      <p className="text-xs font-medium text-slate-500">
        {formatCompletionStatus(row.checkinCompletionStatus)}
      </p>
      <p className="text-xs text-slate-500">{row.quarterLabel}</p>
    </div>
  );
}

function TargetBlock({
  icon: Icon,
  label,
  value
}: {
  icon: typeof Target;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {label}
      </div>
      <p className="mt-1 break-words text-sm font-semibold text-slate-950">
        {value}
      </p>
    </div>
  );
}

export function AchievementReportTable({
  highlightedId,
  rows
}: AchievementReportTableProps) {
  if (rows.length === 0) {
    return (
      <AdminEmptyState
        title="No report rows found"
        description="Try a different quarter, department, or status filter."
      />
    );
  }

  return (
    <div className="min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-subtle">
      <div className="border-b border-slate-200 bg-slate-50/70 p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-normal text-slate-950">
              Report Results
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Planned target, actual achievement, check-in status, and progress
              score by goal.
            </p>
          </div>
          <Badge className="w-fit border-transparent bg-blue-50 text-blue-700">
            {rows.length} rows
          </Badge>
        </div>
      </div>

      <div className="hidden overflow-x-auto xl:block">
        <table className="w-full min-w-[1280px] table-fixed text-left text-sm">
          <thead className="border-b border-slate-200 bg-white text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="w-[18%] px-5 py-3 font-semibold">Employee</th>
              <th className="w-[27%] px-5 py-3 font-semibold">Goal Details</th>
              <th className="w-[14%] px-5 py-3 font-semibold">Planned</th>
              <th className="w-[14%] px-5 py-3 font-semibold">
                Actual Achievement
              </th>
              <th className="w-[12%] px-5 py-3 font-semibold">Status</th>
              <th className="w-[15%] px-5 py-3 font-semibold">Progress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {rows.map((row) => {
              const rowHighlightId = getReportHighlightId(row);
              const isHighlighted = rowHighlightId === highlightedId;

              return (
                <tr
                  className={cn(
                    "align-top transition-colors duration-300 hover:bg-slate-50",
                    isHighlighted && "bg-blue-50/80"
                  )}
                  data-report-highlight-id={rowHighlightId}
                  key={`${row.employeeId}-${row.goalId}`}
                >
                  <td className="px-5 py-4">
                    <div className="flex min-w-0 gap-3">
                      <UserAvatar
                        name={row.employeeName}
                        role={ROLES.EMPLOYEE}
                        size={40}
                        userId={row.employeeId}
                        className="h-10 w-10"
                      />
                      <div className="min-w-0">
                        <p className="break-words font-semibold text-slate-950">
                          {row.employeeName}
                        </p>
                        <p className="mt-1 break-words text-slate-600">
                          {row.departmentName}
                        </p>
                        <div className="mt-3 flex min-w-0 items-center gap-2">
                          <UserAvatar
                            name={row.managerName}
                            role={ROLES.MANAGER}
                            size={24}
                            userId={row.managerId}
                            className="h-6 w-6"
                          />
                          <span className="break-words text-xs text-slate-500">
                            {row.managerName}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="break-words font-semibold text-slate-950">
                          {row.goalTitle}
                        </p>
                        {row.goalType === "Shared" ? (
                          <Badge className="border-transparent bg-blue-50 text-blue-700">
                            Shared
                          </Badge>
                        ) : null}
                      </div>
                      <p className="mt-2 break-words text-sm text-slate-600">
                        {row.thrustArea}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-white text-slate-700">
                          {formatUomLabel(row.uomType)}
                        </Badge>
                        <Badge variant="outline" className="bg-white text-slate-700">
                          {GOAL_STATUS_LABELS[row.goalStatus]}
                        </Badge>
                      </div>
                    </div>
                  </td>
                  <td className="break-words px-5 py-4 font-medium text-slate-950">
                    {row.plannedTarget}
                  </td>
                  <td className="break-words px-5 py-4 font-medium text-slate-950">
                    {row.actualAchievement}
                  </td>
                  <td className="px-5 py-4">
                    <ReportStatus row={row} />
                  </td>
                  <td className="px-5 py-4">
                    <ProgressScoreBadge score={row.progressScore} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 p-4 xl:hidden">
        {rows.map((row) => {
          const rowHighlightId = getReportHighlightId(row);
          const isHighlighted = rowHighlightId === highlightedId;

          return (
            <article
              className={cn(
                "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors duration-300",
                isHighlighted && "border-blue-300 bg-blue-50/70 ring-2 ring-blue-100"
              )}
              data-report-highlight-id={rowHighlightId}
              key={`${row.employeeId}-${row.goalId}`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <UserAvatar
                    name={row.employeeName}
                    role={ROLES.EMPLOYEE}
                    size={42}
                    userId={row.employeeId}
                    className="h-[42px] w-[42px]"
                  />
                  <div className="min-w-0">
                    <p className="break-words font-semibold text-slate-950">
                      {row.employeeName}
                    </p>
                    <p className="mt-1 break-words text-sm text-slate-600">
                      {row.departmentName} - {row.managerName}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{row.quarterLabel}</Badge>
                  {row.goalType === "Shared" ? (
                    <Badge className="border-transparent bg-blue-50 text-blue-700">
                      Shared
                    </Badge>
                  ) : null}
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="break-words font-semibold text-slate-950">
                  {row.goalTitle}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-white">
                    {row.thrustArea}
                  </Badge>
                  <Badge variant="outline" className="bg-white">
                    {formatUomLabel(row.uomType)}
                  </Badge>
                  <Badge variant="outline" className="bg-white">
                    {GOAL_STATUS_LABELS[row.goalStatus]}
                  </Badge>
                </div>
              </div>

              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <TargetBlock
                  icon={Target}
                  label="Planned target"
                  value={row.plannedTarget}
                />
                <TargetBlock
                  icon={ClipboardCheck}
                  label="Actual achievement"
                  value={row.actualAchievement}
                />
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Employee status
                  </dt>
                  <dd className="mt-2">
                    <ReportStatus row={row} />
                  </dd>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <BarChart3 className="h-3.5 w-3.5" aria-hidden="true" />
                    Progress
                  </dt>
                  <dd className="mt-2">
                    <ProgressScoreBadge score={row.progressScore} />
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
