import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { ROLES } from "@/lib/constants/roles";
import type { ManagerEffectivenessRow } from "@/lib/types/analytics";
import { formatPercent } from "@/lib/utils/formatters";
import { getDisplayProgressScore } from "@/lib/utils/progress";

type ManagerEffectivenessTableProps = {
  rows: ManagerEffectivenessRow[];
};

function getScoreVariant(score: number) {
  if (score >= 80) {
    return "default";
  }

  if (score >= 60) {
    return "secondary";
  }

  return "outline";
}

export function ManagerEffectivenessTable({
  rows
}: ManagerEffectivenessTableProps) {
  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
        No manager effectiveness rows found.
      </div>
    );
  }

  return (
    <div className="min-w-0">
      <div className="hidden overflow-x-auto rounded-2xl border bg-card md:block">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b bg-secondary/60 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Manager</th>
              <th className="px-4 py-3 font-medium">Direct Reports</th>
              <th className="px-4 py-3 font-medium">Check-ins</th>
              <th className="px-4 py-3 font-medium">Pending Approvals</th>
              <th className="px-4 py-3 font-medium">Avg Progress</th>
              <th className="px-4 py-3 font-medium">Effectiveness</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((row) => (
              <tr key={row.managerId}>
                <td className="px-4 py-4 align-top">
                  <div className="flex min-w-0 items-center gap-3">
                    <UserAvatar
                      name={row.managerName}
                      role={ROLES.MANAGER}
                      size={36}
                      userId={row.managerId}
                      className="h-9 w-9"
                    />
                    <span className="break-words font-medium">
                      {row.managerName}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 align-top">{row.directReports}</td>
                <td className="px-4 py-4 align-top">
                  {row.checkinsCompleted} completed -{" "}
                  {formatPercent(row.checkinCompletionRate, 0)}
                </td>
                <td className="px-4 py-4 align-top">{row.pendingApprovals}</td>
                <td className="px-4 py-4 align-top">
                  {formatPercent(
                    getDisplayProgressScore(row.averageProgressScore),
                    1
                  )}
                </td>
                <td className="px-4 py-4 align-top">
                  <Badge variant={getScoreVariant(row.effectivenessScore)}>
                    {formatPercent(row.effectivenessScore, 0)}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {rows.map((row) => (
          <article className="rounded-2xl border bg-card p-4" key={row.managerId}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <UserAvatar
                  name={row.managerName}
                  role={ROLES.MANAGER}
                  size={40}
                  userId={row.managerId}
                  className="h-10 w-10"
                />
                <p className="break-words font-medium">{row.managerName}</p>
              </div>
              <Badge variant={getScoreVariant(row.effectivenessScore)}>
                {formatPercent(row.effectivenessScore, 0)}
              </Badge>
            </div>
            <dl className="mt-4 grid gap-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Direct reports</dt>
                <dd>{row.directReports}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Check-ins</dt>
                <dd>{row.checkinsCompleted}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Pending approvals</dt>
                <dd>{row.pendingApprovals}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Avg progress</dt>
                <dd>
                  {formatPercent(
                    getDisplayProgressScore(row.averageProgressScore),
                    1
                  )}
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </div>
  );
}



