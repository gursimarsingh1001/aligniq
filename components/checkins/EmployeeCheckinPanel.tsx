"use client";

import { ClipboardCheck, Save } from "lucide-react";

import {
  AchievementDraft,
  AchievementUpdateForm
} from "@/components/checkins/AchievementUpdateForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import type { EmployeeQuarterlyAchievement } from "@/lib/types/checkin";
import type { Goal } from "@/lib/types/goal";

type EmployeeCheckinPanelProps = {
  drafts: Record<string, AchievementDraft>;
  goals: Goal[];
  isEditable: boolean;
  onChangeDraft: (goalId: string, draft: AchievementDraft) => void;
  onSave: () => void;
  progressScores: Record<string, number>;
  savedAchievements: EmployeeQuarterlyAchievement[];
};

export function EmployeeCheckinPanel({
  drafts,
  goals,
  isEditable,
  onChangeDraft,
  onSave,
  progressScores,
  savedAchievements
}: EmployeeCheckinPanelProps) {
  if (goals.length === 0) {
    return (
      <Card className="w-full border-dashed border-slate-300 bg-slate-50 shadow-none">
        <CardContent className="p-6 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
            <ClipboardCheck className="h-6 w-6" aria-hidden="true" />
          </span>
          <p className="mt-4 text-sm font-semibold text-slate-950">
            No approved goals yet
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Goals must be approved by your manager before quarterly updates can
            be entered.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full border-slate-200 bg-white shadow-subtle">
      <CardHeader className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-xl text-slate-950">
              Quarterly achievement updates
            </CardTitle>
            <CardDescription className="mt-1 leading-5">
              Enter actual achievement against approved goals. Progress score is
              for tracking only and is not a final rating.
            </CardDescription>
          </div>
          <p className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            {goals.length} approved goals
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-5 pt-0 sm:p-6 sm:pt-0">
        {goals.map((goal) => (
          <AchievementUpdateForm
            draft={drafts[goal.id]}
            goal={goal}
            isReadOnly={!isEditable}
            key={goal.id}
            onChange={onChangeDraft}
            progressScore={progressScores[goal.id] ?? 0}
            savedAchievement={
              savedAchievements.find((item) => item.goalId === goal.id) ?? null
            }
          />
        ))}

        <div className="flex justify-end border-t border-slate-200 pt-4">
          <Button
            className="w-full shadow-subtle sm:w-auto"
            disabled={!isEditable}
            onClick={onSave}
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            Save quarterly updates
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
