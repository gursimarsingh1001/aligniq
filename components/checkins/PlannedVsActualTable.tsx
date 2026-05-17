import { CheckinStatusBadge } from "@/components/checkins/CheckinStatusBadge";
import { ProgressScoreBadge } from "@/components/checkins/ProgressScoreBadge";
import { UOM_TYPES } from "@/lib/constants/uom-types";
import type { PlannedVsActualRow } from "@/lib/types/checkin";
import {
  formatDate,
  formatNumber,
  formatTargetDisplay,
  formatUomLabel
} from "@/lib/utils/formatters";

type PlannedVsActualTableProps = {
  rows: PlannedVsActualRow[];
};

function formatPlannedTarget(row: PlannedVsActualRow) {
  return formatTargetDisplay(row.goal);
}

function formatActual(row: PlannedVsActualRow) {
  if (!row.achievement) {
    return "-";
  }

  if (row.goal.uomType === UOM_TYPES.TIMELINE) {
    return row.achievement.completionDate
      ? formatDate(row.achievement.completionDate)
      : "-";
  }

  return formatNumber(row.achievement.actualValue);
}

export function PlannedVsActualTable({ rows }: PlannedVsActualTableProps) {
  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
        No approved goals found for this employee.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="hidden overflow-x-auto rounded-2xl border bg-card 2xl:block">
        <table className="min-w-[960px] w-full text-left text-sm">
          <thead className="border-b bg-secondary/60 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="w-[26%] px-4 py-3 font-medium">Goal</th>
              <th className="w-[14%] px-4 py-3 font-medium">Measurement</th>
              <th className="w-[12%] px-4 py-3 font-medium">Planned</th>
              <th className="w-[12%] px-4 py-3 font-medium">
                Actual achievement
              </th>
              <th className="w-[14%] px-4 py-3 font-medium">Status</th>
              <th className="w-[22%] px-4 py-3 font-medium">Progress</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((row) => (
              <tr key={row.goal.id}>
                <td className="break-words px-4 py-4 align-top font-medium">
                  {row.goal.title}
                </td>
                <td className="break-words px-4 py-4 align-top">
                  {formatUomLabel(row.goal.uomType)}
                </td>
                <td className="px-4 py-4 align-top">{formatPlannedTarget(row)}</td>
                <td className="px-4 py-4 align-top">{formatActual(row)}</td>
                <td className="px-4 py-4 align-top">
                  {row.achievement ? (
                    <CheckinStatusBadge status={row.achievement.progressStatus} />
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-4 py-4 align-top">
                  <ProgressScoreBadge score={row.achievement?.progressScore ?? 0} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 2xl:hidden">
        {rows.map((row) => (
          <div className="rounded-2xl border bg-card p-4" key={row.goal.id}>
            <p className="break-words font-medium">{row.goal.title}</p>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-xl border bg-background/60 px-3 py-2">
                <dt className="text-muted-foreground">Measurement</dt>
                <dd className="mt-1 break-words font-medium">
                  {formatUomLabel(row.goal.uomType)}
                </dd>
              </div>
              <div className="rounded-xl border bg-background/60 px-3 py-2">
                <dt className="text-muted-foreground">Planned</dt>
                <dd className="mt-1 font-medium">{formatPlannedTarget(row)}</dd>
              </div>
              <div className="rounded-xl border bg-background/60 px-3 py-2">
                <dt className="text-muted-foreground">Actual achievement</dt>
                <dd className="mt-1 font-medium">{formatActual(row)}</dd>
              </div>
              <div className="rounded-xl border bg-background/60 px-3 py-2">
                <dt className="text-muted-foreground">Status</dt>
                <dd className="mt-2">
                  {row.achievement ? (
                    <CheckinStatusBadge status={row.achievement.progressStatus} />
                  ) : (
                    "-"
                  )}
                </dd>
              </div>
            </dl>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t pt-3">
              <p className="text-sm font-medium text-muted-foreground">Progress</p>
              <ProgressScoreBadge score={row.achievement?.progressScore ?? 0} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



