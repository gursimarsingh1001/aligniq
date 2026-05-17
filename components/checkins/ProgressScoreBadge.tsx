import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatPercent } from "@/lib/utils/formatters";
import { getDisplayProgressScore } from "@/lib/utils/progress";

type ProgressScoreBadgeProps = {
  score: number;
};

function getProgressLabel(score: number) {
  if (score >= 100) {
    return "Completed";
  }

  if (score >= 50) {
    return "On Track";
  }

  return "Needs Attention";
}

export function ProgressScoreBadge({ score }: ProgressScoreBadgeProps) {
  const displayScore = getDisplayProgressScore(score);

  return (
    <Badge
      variant="outline"
      className={cn(
        "whitespace-nowrap border-transparent",
        displayScore >= 100
          ? "bg-emerald-50 text-emerald-700"
          : displayScore >= 50
            ? "bg-amber-50 text-amber-700"
            : "bg-red-50 text-red-700"
      )}
    >
      {formatPercent(displayScore, 1)} - {getProgressLabel(displayScore)}
    </Badge>
  );
}
