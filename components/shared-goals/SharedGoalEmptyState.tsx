import { Target } from "lucide-react";

export function SharedGoalEmptyState({
  description,
  title
}: {
  description: string;
  title: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
        <Target className="h-5 w-5" aria-hidden="true" />
      </div>
      <p className="mt-4 text-sm font-semibold text-slate-950">{title}</p>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">
        {description}
      </p>
    </div>
  );
}
