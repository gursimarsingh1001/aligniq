"use client";

import { Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/UserAvatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import type { TeamCheckinSummary } from "@/lib/types/checkin";
import { cn } from "@/lib/utils";

type ManagerCheckinQueueProps = {
  items: TeamCheckinSummary[];
  selectedEmployeeId: string | null;
  onSelectEmployee: (employeeId: string) => void;
};

export function ManagerCheckinQueue({
  items,
  selectedEmployeeId,
  onSelectEmployee
}: ManagerCheckinQueueProps) {
  return (
    <Card className="h-fit border-slate-200 bg-white shadow-subtle xl:sticky xl:top-20">
      <CardHeader className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-xl text-slate-950">
              Team check-ins
            </CardTitle>
            <CardDescription>
              Select a team member to review planned vs actual progress.
            </CardDescription>
          </div>
          <Badge className="border-transparent bg-blue-50 text-blue-700">
            {items.length}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-0">
        {items.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
              <Users className="h-6 w-6 text-slate-500" aria-hidden="true" />
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-950">
              No team check-ins yet
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Approved team goals and quarterly updates will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => {
              const isSelected = item.employeeId === selectedEmployeeId;
              const isComplete = Boolean(item.managerCheckin);

              return (
                <button
                  type="button"
                  key={item.employeeId}
                  onClick={() => onSelectEmployee(item.employeeId)}
                  className={cn(
                    "w-full rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30",
                    isSelected
                      ? "border-blue-500 bg-blue-50/70 shadow-subtle"
                      : "border-slate-200 bg-slate-50/70 hover:border-blue-200 hover:bg-blue-50/50"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 gap-3">
                      <UserAvatar
                        name={item.employeeName}
                        size={40}
                        userId={item.employeeId}
                        className="h-10 w-10"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-950">
                          {item.employeeName}
                        </p>
                        <p className="mt-1 truncate text-xs text-slate-500">
                          {item.departmentName}
                        </p>
                      </div>
                    </div>
                    <Badge
                      className={cn(
                        "border-transparent",
                        isComplete
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      )}
                    >
                      {isComplete ? "Completed" : "Pending"}
                    </Badge>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200">
                      <p className="text-slate-500">Approved goals</p>
                      <p className="mt-1 font-semibold text-slate-950">
                        {item.approvedGoalCount}
                      </p>
                    </div>
                    <div className="rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200">
                      <p className="text-slate-500">Updated</p>
                      <p className="mt-1 font-semibold text-slate-950">
                        {item.updatedGoalCount}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
