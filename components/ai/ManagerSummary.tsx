"use client";

import { useMemo, useState } from "react";
import { FileText } from "lucide-react";

import { AIResponseCard } from "@/components/ai/AIResponseCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { ROLES } from "@/lib/constants/roles";
import {
  ALL_CHECKIN_WINDOWS,
  CHECKIN_WINDOW_LABELS,
  CHECKIN_WINDOWS,
  type CheckinWindow
} from "@/lib/constants/checkin-windows";
import {
  generateManagerCheckinSummary,
  getManagerSummaryEmployees
} from "@/lib/services/ai-service";
import type {
  ManagerCheckinSummary,
  ManagerSummaryEmployee
} from "@/lib/types/ai";

type ManagerSummaryProps = {
  managerId: string;
};

export function ManagerSummary({ managerId }: ManagerSummaryProps) {
  const [selectedQuarter, setSelectedQuarter] = useState<CheckinWindow>(
    CHECKIN_WINDOWS.Q2
  );
  const employees = useMemo<ManagerSummaryEmployee[]>(
    () => getManagerSummaryEmployees(managerId, selectedQuarter),
    [managerId, selectedQuarter]
  );
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const selectedEmployee =
    employees.find((employee) => employee.employeeId === selectedEmployeeId) ??
    employees[0] ??
    null;
  const [summary, setSummary] = useState<ManagerCheckinSummary | null>(null);

  function handleGenerateSummary() {
    if (!selectedEmployee) {
      return;
    }

    setSummary(
      generateManagerCheckinSummary({
        managerId,
        employeeId: selectedEmployee.employeeId,
        checkinWindow: selectedQuarter
      })
    );
  }

  function handleQuarterChange(value: CheckinWindow) {
    setSelectedQuarter(value);
    setSelectedEmployeeId("");
    setSummary(null);
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[22rem_minmax(0,1fr)]">
      <AIResponseCard
        title="Summary Controls"
        description="Select a team member and quarter, then generate a check-in summary from current data."
      >
        {employees.length > 0 ? (
          <div className="space-y-4">
            <label className="grid gap-2 text-sm">
              <span className="font-semibold text-slate-950">Employee</span>
              <select
                className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none focus:border-blue-300 focus:bg-white focus-visible:ring-2 focus-visible:ring-blue-100"
                value={selectedEmployee?.employeeId ?? ""}
                onChange={(event) => {
                  setSelectedEmployeeId(event.target.value);
                  setSummary(null);
                }}
              >
                {employees.map((employee) => (
                  <option key={employee.employeeId} value={employee.employeeId}>
                    {employee.employeeName}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm">
              <span className="font-semibold text-slate-950">Quarter</span>
              <select
                className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none focus:border-blue-300 focus:bg-white focus-visible:ring-2 focus-visible:ring-blue-100"
                value={selectedQuarter}
                onChange={(event) =>
                  handleQuarterChange(event.target.value as CheckinWindow)
                }
              >
                {ALL_CHECKIN_WINDOWS.map((window) => (
                  <option key={window} value={window}>
                    {CHECKIN_WINDOW_LABELS[window]}
                  </option>
                ))}
              </select>
            </label>

            {selectedEmployee ? (
              <div className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-sm">
                <UserAvatar
                  name={selectedEmployee.employeeName}
                  role={ROLES.EMPLOYEE}
                  size={40}
                  userId={selectedEmployee.employeeId}
                  className="h-10 w-10"
                />
                <div className="min-w-0">
                  <p className="break-words font-semibold text-slate-950">
                    {selectedEmployee.employeeName}
                  </p>
                  <p className="mt-1 text-slate-600">
                    {selectedEmployee.departmentName}
                  </p>
                </div>
              </div>
            ) : null}

            <Button
              type="button"
              className="w-full rounded-2xl"
              onClick={handleGenerateSummary}
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
              Generate Summary
            </Button>
          </div>
        ) : (
          <p className="text-sm leading-6 text-slate-500">
            No team members with approved goals or check-in data were found.
          </p>
        )}
      </AIResponseCard>

      <AIResponseCard
        title={summary ? `${summary.employeeName} Summary` : "Generated Summary"}
        description="Creates a structured summary from planned target, actual achievement, and progress-score rules."
      >
        {summary ? (
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <Badge className="border-transparent bg-blue-50 text-blue-700">
                {summary.quarterLabel}
              </Badge>
              <Badge
                variant="outline"
                className="border-slate-200 bg-slate-50 text-slate-600"
              >
                Tracking-only summary
              </Badge>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-950">
                Short performance summary
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {summary.summary}
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
                <p className="text-sm font-semibold text-emerald-800">
                  Key achievements
                </p>
                <ul className="mt-3 grid gap-2 text-sm text-slate-700">
                  {summary.keyAchievements.map((item) => (
                    <li className="break-words" key={item}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-4">
                <p className="text-sm font-semibold text-amber-800">
                  Risks / attention areas
                </p>
                <ul className="mt-3 grid gap-2 text-sm text-slate-700">
                  {summary.risks.map((item) => (
                    <li className="break-words" key={item}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-950">
                Suggested check-in comment
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                {summary.suggestedManagerComment}
              </p>
            </div>

            <p className="text-xs leading-5 text-slate-500">
              {summary.reminder}
            </p>
          </div>
        ) : (
          <p className="text-sm leading-6 text-slate-500">
            Generate a summary to prepare for a structured quarterly discussion.
          </p>
        )}
      </AIResponseCard>
    </div>
  );
}

