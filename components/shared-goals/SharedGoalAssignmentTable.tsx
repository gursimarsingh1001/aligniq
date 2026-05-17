"use client";

import { Badge } from "@/components/ui/badge";
import { SharedGoalWeightageEditor } from "@/components/shared-goals/SharedGoalWeightageEditor";
import { UserAvatar } from "@/components/ui/UserAvatar";
import type { AlignIQUser, Department } from "@/lib/types/user";
import type {
  SharedGoalAssignment,
  SharedGoalWithAssignments
} from "@/lib/types/shared-goal";
import { cn } from "@/lib/utils";

type SharedGoalAssignmentTableProps = {
  departments: Department[];
  employees: AlignIQUser[];
  goal: SharedGoalWithAssignments;
  onChangeWeightage?: (employeeId: string, weightage: number) => void;
};

function getEmployee(employees: AlignIQUser[], employeeId: string) {
  return employees.find((employee) => employee.id === employeeId) ?? null;
}

function getDepartmentName(departments: Department[], departmentId: string | null) {
  if (!departmentId) {
    return "Unassigned";
  }

  return (
    departments.find((department) => department.id === departmentId)?.name ??
    "Unassigned"
  );
}

function SyncStatusBadge({
  assignment
}: {
  assignment: SharedGoalAssignment;
}) {
  const statusLabel: Record<SharedGoalAssignment["syncStatus"], string> = {
    conflict: "Conflict",
    pending: "Pending",
    synced: "Synced"
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "border-transparent font-medium",
        assignment.syncStatus === "synced" && "bg-emerald-50 text-emerald-700",
        assignment.syncStatus === "pending" && "bg-amber-50 text-amber-700",
        assignment.syncStatus === "conflict" && "bg-red-50 text-red-700"
      )}
    >
      {statusLabel[assignment.syncStatus]}
    </Badge>
  );
}

export function SharedGoalAssignmentTable({
  departments,
  employees,
  goal,
  onChangeWeightage
}: SharedGoalAssignmentTableProps) {
  return (
    <section className="min-w-0 rounded-2xl border border-slate-200 bg-white shadow-subtle">
      <div className="border-b border-slate-200 px-4 py-3 sm:px-5">
        <h3 className="text-base font-semibold tracking-normal text-slate-950">
          Assignment plan
        </h3>
        <p className="mt-1 text-sm leading-5 text-slate-600">
          Review linked employees, ownership, weightage, and sync status.
        </p>
      </div>

      <div className="hidden overflow-hidden lg:block">
        <table className="w-full table-fixed text-left text-sm">
          <colgroup>
            <col className="w-[24%]" />
            <col className="w-[23%]" />
            <col className="w-[24%]" />
            <col className="w-[15%]" />
            <col className="w-[14%]" />
          </colgroup>
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2.5 font-medium">Employee</th>
              <th className="px-3 py-2.5 font-medium">Department</th>
              <th className="px-3 py-2.5 font-medium">Weightage</th>
              <th className="px-3 py-2.5 font-medium">Owner</th>
              <th className="px-3 py-2.5 font-medium">Sync</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {goal.assignments.map((assignment) => {
              const employee = getEmployee(employees, assignment.employeeId);

              return (
                <tr key={assignment.id} className="bg-white">
                  <td className="px-3 py-3 align-top">
                    <div className="flex min-w-0 gap-2.5">
                      <UserAvatar
                        name={employee?.name ?? assignment.employeeId}
                        role={employee?.role}
                        size={34}
                        userId={employee?.id ?? assignment.employeeId}
                        className="h-[34px] w-[34px]"
                      />
                      <div className="min-w-0">
                        <p className="break-words font-medium text-slate-950">
                          {employee?.name ?? assignment.employeeId}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {employee?.title ?? "Employee"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="break-words px-3 py-3 align-top text-slate-700">
                    {getDepartmentName(departments, employee?.departmentId ?? null)}
                  </td>
                  <td className="px-3 py-3 align-top">
                    {onChangeWeightage ? (
                      <SharedGoalWeightageEditor
                        value={assignment.weightage}
                        onSave={(weightage) =>
                          onChangeWeightage(assignment.employeeId, weightage)
                        }
                      />
                    ) : (
                      <span className="font-medium text-slate-950">
                        {assignment.weightage}%
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3 align-top text-slate-700">
                    {assignment.isPrimaryOwner ? (
                      <Badge className="border-transparent bg-blue-50 text-blue-700">
                        Primary
                      </Badge>
                    ) : (
                      "Recipient"
                    )}
                  </td>
                  <td className="px-3 py-3 align-top">
                    <SyncStatusBadge assignment={assignment} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 p-4 lg:hidden">
        {goal.assignments.map((assignment) => {
          const employee = getEmployee(employees, assignment.employeeId);

          return (
            <article
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              key={assignment.id}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex min-w-0 gap-3">
                    <UserAvatar
                      name={employee?.name ?? assignment.employeeId}
                      role={employee?.role}
                      size={40}
                      userId={employee?.id ?? assignment.employeeId}
                      className="h-10 w-10"
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-slate-950">
                        {employee?.name ?? assignment.employeeId}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {getDepartmentName(
                          departments,
                          employee?.departmentId ?? null
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <SyncStatusBadge assignment={assignment} />
              </div>
              <div className="mt-4 grid gap-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Role</span>
                  <span className="font-medium text-slate-950">
                    {assignment.isPrimaryOwner ? "Primary owner" : "Recipient"}
                  </span>
                </div>
                {onChangeWeightage ? (
                  <SharedGoalWeightageEditor
                    value={assignment.weightage}
                    onSave={(weightage) =>
                      onChangeWeightage(assignment.employeeId, weightage)
                    }
                  />
                ) : (
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Weightage</span>
                    <span className="font-medium text-slate-950">
                      {assignment.weightage}%
                    </span>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
