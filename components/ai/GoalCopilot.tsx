"use client";

import { FormEvent, useMemo, useState } from "react";
import { Copy, Sparkles } from "lucide-react";

import { AIResponseCard } from "@/components/ai/AIResponseCard";
import { Button } from "@/components/ui/button";
import {
  getGoalCopilotUomLabel,
  suggestGoalDraft
} from "@/lib/services/ai-service";
import type { GoalCopilotSuggestion } from "@/lib/types/ai";

const exampleIdeas = [
  "improve sales",
  "reduce defects",
  "complete training",
  "reduce turnaround time",
  "improve customer satisfaction",
  "zero safety incidents"
];

function formatSuggestionForCopy(suggestion: GoalCopilotSuggestion) {
  return [
    `Align title: ${suggestion.title}`,
    `Description: ${suggestion.description}`,
    `Thrust area: ${suggestion.thrustArea}`,
    `Measurement: ${getGoalCopilotUomLabel(suggestion.uomType)}`,
    `Suggested target: ${suggestion.targetExample}`,
    `Suggested weightage: ${suggestion.weightage}%`,
    `Why measurable: ${suggestion.measurableReason}`
  ].join("\n");
}

export function GoalCopilot() {
  const [roughGoal, setRoughGoal] = useState("");
  const [suggestion, setSuggestion] = useState<GoalCopilotSuggestion | null>(null);
  const [copied, setCopied] = useState(false);
  const copyText = useMemo(
    () => (suggestion ? formatSuggestionForCopy(suggestion) : ""),
    [suggestion]
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuggestion(suggestGoalDraft(roughGoal));
    setCopied(false);
  }

  function handleExampleClick(example: string) {
    setRoughGoal(example);
    setSuggestion(null);
    setCopied(false);
  }

  async function handleCopy() {
    if (!copyText || typeof navigator === "undefined") {
      return;
    }

    await navigator.clipboard.writeText(copyText);
    setCopied(true);
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_21rem]">
      <div className="space-y-5">
        <form
          className="rounded-3xl border border-slate-200 bg-white p-5 shadow-subtle"
          onSubmit={handleSubmit}
        >
          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-slate-950">
              Rough alignment idea
            </span>
            <textarea
              className="min-h-32 resize-y rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus-visible:ring-2 focus-visible:ring-blue-100"
              placeholder="Example: reduce turnaround time"
              value={roughGoal}
              onChange={(event) => {
                setRoughGoal(event.target.value);
                setSuggestion(null);
                setCopied(false);
              }}
            />
          </label>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-slate-500">
              The suggestion is a starting point; review target and weightage.
            </p>
            <Button
              type="submit"
              className="rounded-2xl"
              disabled={!roughGoal.trim()}
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Suggest alignment
            </Button>
          </div>
        </form>

        <AIResponseCard
          title={suggestion ? "Align Suggestion" : "No suggestion generated yet"}
          description="Use this suggestion as a starting point and adjust target/weightage before submission."
        >
          {suggestion ? (
            <div className="space-y-5">
              <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                  Align title
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-950">
                  {suggestion.title}
                </p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Description
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {suggestion.description}
                </p>
              </div>

              <dl className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <dt className="text-xs font-medium text-slate-500">
                    Thrust Area
                  </dt>
                  <dd className="mt-1 break-words text-sm font-semibold text-slate-950">
                    {suggestion.thrustArea}
                  </dd>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <dt className="text-xs font-medium text-slate-500">
                    Measurement
                  </dt>
                  <dd className="mt-1 break-words text-sm font-semibold text-slate-950">
                    {getGoalCopilotUomLabel(suggestion.uomType)}
                  </dd>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <dt className="text-xs font-medium text-slate-500">
                    Target Example
                  </dt>
                  <dd className="mt-1 break-words text-sm font-semibold text-slate-950">
                    {suggestion.targetExample}
                  </dd>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <dt className="text-xs font-medium text-slate-500">
                    Suggested Weightage
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-slate-950">
                    {suggestion.weightage}%
                  </dd>
                </div>
              </dl>

              <div>
                <p className="text-sm font-semibold text-slate-950">
                  Why this is measurable
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {suggestion.measurableReason}
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                className="rounded-2xl"
                onClick={handleCopy}
              >
                <Copy className="h-4 w-4" aria-hidden="true" />
                {copied ? "Copied" : "Copy suggestion"}
              </Button>
            </div>
          ) : (
            <p className="text-sm leading-6 text-slate-500">
              Enter a rough priority and the copilot will convert it into a
              structured, measurable alignment draft.
            </p>
          )}
        </AIResponseCard>
      </div>

      <AIResponseCard
        title="Example Ideas"
        description="Start with a common workplace priority."
      >
        <div className="flex flex-wrap gap-2">
          {exampleIdeas.map((item) => (
            <button
              type="button"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
              key={item}
              onClick={() => handleExampleClick(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </AIResponseCard>
    </div>
  );
}
