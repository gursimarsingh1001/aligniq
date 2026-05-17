"use client";

import { Edit2, Lock, Trash2 } from "lucide-react";

import { GoalStatusBadge } from "@/components/goals/GoalStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Goal } from "@/lib/types/goal";
import {
  formatDirectionLabel,
  formatTargetDisplay,
  formatUomLabel,
  formatWeightage
} from "@/lib/utils/formatters";

type GoalTableProps = {
  canEdit: boolean;
  goals: Goal[];
  onDeleteGoal: (goalId: string) => void;
  onEditGoal: (goal: Goal) => void;
};

export function GoalTable({
  canEdit,
  goals,
  onDeleteGoal,
  onEditGoal
}: GoalTableProps) {
  return (
    <div className="space-y-4">
      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white lg:block">
        <table className="w-full table-fixed text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="w-[26%] px-4 py-3 font-semibold">Goal</th>
              <th className="w-[17%] px-4 py-3 font-semibold">Thrust Area</th>
              <th className="w-[18%] px-4 py-3 font-semibold">Measurement</th>
              <th className="w-[12%] px-4 py-3 font-semibold">Target</th>
              <th className="w-[10%] px-4 py-3 font-semibold">Weight</th>
              <th className="w-[10%] px-4 py-3 font-semibold">Status</th>
              <th className="w-[7%] px-4 py-3 text-right font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {goals.map((goal) => (
              <tr className="transition hover:bg-slate-50/70" key={goal.id}>
                <td className="px-4 py-4 align-top">
                  <p className="break-words font-semibold text-slate-950">
                    {goal.title}
                  </p>
                  {goal.description ? (
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                      {goal.description}
                    </p>
                  ) : null}
                </td>
                <td className="break-words px-4 py-4 align-top text-slate-600">
                  {goal.thrustArea}
                </td>
                <td className="px-4 py-4 align-top">
                  <p className="font-medium text-slate-950">
                    {formatUomLabel(goal.uomType)}
                  </p>
                  <p className="mt-1 break-words text-xs text-slate-500">
                    {formatDirectionLabel(goal.uomType)}
                  </p>
                </td>
                <td className="px-4 py-4 align-top font-medium text-slate-950">
                  {formatTargetDisplay(goal)}
                </td>
                <td className="px-4 py-4 align-top">
                  <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                    {formatWeightage(goal.weightage)}
                  </span>
                </td>
                <td className="px-4 py-4 align-top">
                  <GoalStatusBadge status={goal.status} />
                </td>
                <td className="px-4 py-4 align-top">
                  <div className="flex justify-end gap-2">
                    {canEdit ? (
                      <>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-slate-500 hover:bg-blue-50 hover:text-blue-700"
                          aria-label={`Edit ${goal.title}`}
                          onClick={() => onEditGoal(goal)}
                        >
                          <Edit2 className="h-4 w-4" aria-hidden="true" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-slate-500 hover:bg-red-50 hover:text-red-700"
                          aria-label={`Delete ${goal.title}`}
                          onClick={() => onDeleteGoal(goal.id)}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </>
                    ) : (
                      <Lock className="ml-auto h-4 w-4 text-slate-400" />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 lg:hidden">
        {goals.map((goal) => (
          <Card className="border-slate-200 bg-white shadow-subtle" key={goal.id}>
            <CardContent className="space-y-4 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="break-words font-semibold text-slate-950">
                    {goal.title}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {goal.thrustArea}
                  </p>
                </div>
                <GoalStatusBadge status={goal.status} />
              </div>

              {goal.description ? (
                <p className="text-sm leading-6 text-slate-600">
                  {goal.description}
                </p>
              ) : null}

              <dl className="grid gap-3 text-sm sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <dt className="text-xs font-medium text-slate-500">
                    Measurement
                  </dt>
                  <dd className="mt-1 font-semibold text-slate-950">
                    {formatUomLabel(goal.uomType)}
                  </dd>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <dt className="text-xs font-medium text-slate-500">
                    Scoring rule
                  </dt>
                  <dd className="mt-1 break-words font-semibold text-slate-950">
                    {formatDirectionLabel(goal.uomType)}
                  </dd>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <dt className="text-xs font-medium text-slate-500">Target</dt>
                  <dd className="mt-1 font-semibold text-slate-950">
                    {formatTargetDisplay(goal)}
                  </dd>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <dt className="text-xs font-medium text-slate-500">Weightage</dt>
                  <dd className="mt-1 font-semibold text-slate-950">
                    {formatWeightage(goal.weightage)}
                  </dd>
                </div>
              </dl>

              {canEdit ? (
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-slate-200 bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                    onClick={() => onEditGoal(goal)}
                  >
                    <Edit2 className="h-4 w-4" aria-hidden="true" />
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-slate-200 bg-white text-slate-700 hover:bg-red-50 hover:text-red-700"
                    onClick={() => onDeleteGoal(goal.id)}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    Delete
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-500">
                  <Lock className="h-4 w-4" aria-hidden="true" />
                  Locked after submission or approval
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}



