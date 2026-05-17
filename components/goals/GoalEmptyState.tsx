import { Target } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type GoalEmptyStateProps = {
  canEdit: boolean;
  onAddGoal: () => void;
};

export function GoalEmptyState({ canEdit, onAddGoal }: GoalEmptyStateProps) {
  return (
    <Card className="border-dashed border-slate-300 bg-slate-50/70 shadow-none">
      <CardContent className="flex flex-col items-center p-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
          <Target className="h-7 w-7 text-blue-700" aria-hidden="true" />
        </div>
        <h2 className="mt-4 text-base font-semibold text-slate-950">
          No goals added yet
        </h2>
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
          Start by adding quarterly goals with measurable targets and weightage.
        </p>
        {canEdit ? (
          <Button className="mt-5" onClick={onAddGoal}>
            Add goal
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
