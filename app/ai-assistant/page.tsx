import { Bot, FileQuestion, Lightbulb, MessageSquareText } from "lucide-react";

import { AIAssistantTabs } from "@/components/ai/AIAssistantTabs";
import { AppShell } from "@/components/layout/AppShell";

export default function AiAssistantPage() {
  return (
    <AppShell>
      <div className="w-full space-y-6">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-subtle">
          <div className="relative p-5 sm:p-7">
            <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-blue-100/70 blur-3xl" />
            <div className="absolute bottom-0 left-12 h-28 w-80 rounded-full bg-slate-100 blur-2xl" />
            <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
              <div className="max-w-3xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-subtle">
                  <Bot className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-blue-700">
                  Assistant workspace
                </p>
                <h1 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
                  AlignIQ Assistant
                </h1>
                <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                  Use the assistant to answer policy questions, draft alignment
                  suggestions, and prepare check-in summaries.
                </p>
              </div>

              <div className="grid gap-3 rounded-3xl border border-slate-200 bg-slate-50/80 p-4">
                <div className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-subtle">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                    <FileQuestion className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-950">
                      Policy answers
                    </p>
                    <p className="text-xs text-slate-500">
                      Goal rules and check-in guidance
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-subtle">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                    <Lightbulb className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-950">
                      Alignment drafting
                    </p>
                    <p className="text-xs text-slate-500">
                      Structured suggestions from rough ideas
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-subtle">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                    <MessageSquareText
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-950">
                      Check-in preparation
                    </p>
                    <p className="text-xs text-slate-500">
                      Review-ready quarterly summaries
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <AIAssistantTabs />
      </div>
    </AppShell>
  );
}
