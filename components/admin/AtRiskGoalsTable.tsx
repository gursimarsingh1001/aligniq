import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { ROLES } from "@/lib/constants/roles";
import type { AtRiskGoalRow } from "@/lib/types/analytics";
import { formatPercent, formatUomLabel } from "@/lib/utils/formatters";
import { getDisplayProgressScore } from "@/lib/utils/progress";

type AtRiskGoalsTableProps = {
  rows: AtRiskGoalRow[];
};

function getSeverityVariant(severity: AtRiskGoalRow["severity"]) {
  if (severity === "high") {
    return "default";
  }

  if (severity === "medium") {
    return "secondary";
  }

  return "outline";
}

export function AtRiskGoalsTable({ rows }: AtRiskGoalsTableProps) {
  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
        No at-risk goals found in the current workspace.
      </div>
    );
  }

  return (
    <div className="min-w-0">
      <div className="hidden overflow-x-auto rounded-2xl border bg-card md:block">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="border-b bg-secondary/60 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Employee</th>
              <th className="px-4 py-3 font-medium">Goal</th>
              <th className="px-4 py-3 font-medium">Measurement</th>
              <th className="px-4 py-3 font-medium">Progress</th>
              <th className="px-4 py-3 font-medium">Severity</th>
              <th className="px-4 py-3 font-medium">Reason</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="px-4 py-4 align-top">
                  <div className="flex min-w-0 gap-3">
                    <UserAvatar
                      name={row.employeeName}
                      role={ROLES.EMPLOYEE}
                      size={36}
                      className="h-9 w-9"
                    />
                    <div className="min-w-0">
                      <p className="break-words font-medium">
                        {row.employeeName}
                      </p>
                      <p className="mt-1 text-muted-foreground">
                        {row.managerName}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 align-top font-medium">
                  {row.goalTitle}
                </td>
                <td className="px-4 py-4 align-top">{formatUomLabel(row.uomType)}</td>
                <td className="px-4 py-4 align-top">
                  {formatPercent(getDisplayProgressScore(row.progressScore), 1)}
                </td>
                <td className="px-4 py-4 align-top">
                  <Badge variant={getSeverityVariant(row.severity)}>
                    {row.severity}
                  </Badge>
                </td>
                <td className="px-4 py-4 align-top text-muted-foreground">
                  {row.reason}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {rows.map((row) => (
          <article className="rounded-2xl border bg-card p-4" key={row.id}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <UserAvatar
                  name={row.employeeName}
                  role={ROLES.EMPLOYEE}
                  size={40}
                  className="h-10 w-10"
                />
                <p className="break-words font-medium">{row.employeeName}</p>
              </div>
              <Badge variant={getSeverityVariant(row.severity)}>
                {row.severity}
              </Badge>
            </div>
            <p className="mt-3 text-sm font-medium">{row.goalTitle}</p>
            <dl className="mt-4 grid gap-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Manager</dt>
                <dd>{row.managerName}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Measurement</dt>
                <dd>{formatUomLabel(row.uomType)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Progress</dt>
                <dd>
                  {formatPercent(getDisplayProgressScore(row.progressScore), 1)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Reason</dt>
                <dd className="mt-1 break-words">{row.reason}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </div>
  );
}



