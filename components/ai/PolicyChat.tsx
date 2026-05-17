"use client";

import { FormEvent, useState } from "react";
import { Search, Send } from "lucide-react";

import { AIResponseCard } from "@/components/ai/AIResponseCard";
import { Button } from "@/components/ui/button";
import { answerPolicyQuestion } from "@/lib/services/ai-service";
import type { PolicyAnswer } from "@/lib/types/ai";

const suggestedQuestions = [
  "What is the minimum goal weightage?",
  "How many goals can an employee create?",
  "When does Q1 check-in happen?",
  "What happens after manager approval?",
  "What is the formula for lower-is-better goals?",
  "What are zero-based goals?",
  "Who can unlock approved goals?",
  "What reports are required?"
];

export function PolicyChat() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<PolicyAnswer | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAnswer(answerPolicyQuestion(question));
  }

  function handleSuggestedQuestion(nextQuestion: string) {
    setQuestion(nextQuestion);
    setAnswer(null);
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
              Ask an AlignIQ policy question
            </span>
            <textarea
              className="min-h-32 resize-y rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus-visible:ring-2 focus-visible:ring-blue-100"
              placeholder="Example: What is the formula for lower-is-better goals?"
              value={question}
              onChange={(event) => {
                setQuestion(event.target.value);
                setAnswer(null);
              }}
            />
          </label>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-slate-500">
              Use precise questions for the clearest response.
            </p>
            <Button
              type="submit"
              className="rounded-2xl"
              disabled={!question.trim()}
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              Ask policy
            </Button>
          </div>
        </form>

        <AIResponseCard
          title={answer ? "Policy Answer" : "Ready for a policy question"}
        >
          {answer ? (
            <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-600 text-white">
                <Search className="h-4 w-4" aria-hidden="true" />
              </div>
              <p className="text-sm leading-6 text-slate-700">
                {answer.answer}
              </p>
            </div>
          ) : (
            <p className="text-sm leading-6 text-slate-500">
              Ask about goal weightage, check-in windows, progress formulas,
              approvals, reports, or admin governance.
            </p>
          )}
        </AIResponseCard>
      </div>

      <AIResponseCard
        title="Try These"
        description="Common questions for stakeholder walkthroughs."
      >
        <div className="grid gap-2">
          {suggestedQuestions.map((item) => (
            <button
              type="button"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-left text-sm leading-5 text-slate-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
              key={item}
              onClick={() => handleSuggestedQuestion(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </AIResponseCard>
    </div>
  );
}
