import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type SharedGoalMetricCardProps = {
  helper: string;
  icon: LucideIcon;
  label: string;
  tone: "blue" | "emerald" | "amber" | "slate";
  value: string;
};

const toneStyles: Record<SharedGoalMetricCardProps["tone"], string> = {
  amber: "bg-amber-50 text-amber-700",
  blue: "bg-blue-50 text-blue-700",
  emerald: "bg-emerald-50 text-emerald-700",
  slate: "bg-slate-100 text-slate-700"
};

export function SharedGoalMetricCard({
  helper,
  icon: Icon,
  label,
  tone,
  value
}: SharedGoalMetricCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-subtle">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {label}
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-normal text-slate-950">
            {value}
          </p>
        </div>
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
            toneStyles[tone]
          )}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 text-sm leading-5 text-slate-600">{helper}</p>
    </div>
  );
}
