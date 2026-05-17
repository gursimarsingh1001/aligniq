"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { MIN_GOAL_WEIGHTAGE } from "@/lib/validations/goal";

type SharedGoalWeightageEditorProps = {
  disabled?: boolean;
  onSave: (weightage: number) => void;
  value: number;
};

export function SharedGoalWeightageEditor({
  disabled = false,
  onSave,
  value
}: SharedGoalWeightageEditorProps) {
  const [draftWeightage, setDraftWeightage] = useState(String(value));
  const parsedWeightage = Number(draftWeightage);
  const hasValidWeightage =
    Number.isInteger(parsedWeightage) &&
    parsedWeightage >= MIN_GOAL_WEIGHTAGE &&
    parsedWeightage <= 100;
  const hasChangedWeightage = hasValidWeightage && parsedWeightage !== value;

  return (
    <div className="flex items-end gap-2">
      <label className="min-w-0 flex-1 space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Weightage
        </span>
        <input
          type="number"
          min={MIN_GOAL_WEIGHTAGE}
          max="100"
          step="1"
          value={draftWeightage}
          disabled={disabled}
          onChange={(event) => setDraftWeightage(event.target.value)}
          className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-100"
        />
      </label>
      {hasChangedWeightage ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 shrink-0 border-slate-200 bg-white px-3"
          disabled={disabled}
          onClick={() => onSave(parsedWeightage)}
        >
          Update
        </Button>
      ) : null}
    </div>
  );
}
