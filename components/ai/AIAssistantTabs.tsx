"use client";

import { useState } from "react";
import {
  FileQuestion,
  Lightbulb,
  MessageSquareText,
  type LucideIcon
} from "lucide-react";

import { GoalCopilot } from "@/components/ai/GoalCopilot";
import { ManagerSummary } from "@/components/ai/ManagerSummary";
import { PolicyChat } from "@/components/ai/PolicyChat";
import { useDemoSession } from "@/lib/auth/session";
import { ROLES } from "@/lib/constants/roles";
import { cn } from "@/lib/utils";

type AIAssistantTab = "policy" | "goal" | "summary";

const assistantTabs = [
  {
    id: "policy",
    label: "Ask HR Policy",
    description: "Ask goal and check-in policy questions.",
    icon: FileQuestion
  },
  {
    id: "goal",
    label: "Align Copilot",
    description: "Turn a rough idea into a measurable draft.",
    icon: Lightbulb
  },
  {
    id: "summary",
    label: "Check-in Summary",
    description: "Generate a discussion-ready team summary.",
    icon: MessageSquareText
  }
] as const satisfies readonly {
  id: AIAssistantTab;
  label: string;
  description: string;
  icon: LucideIcon;
}[];

function getAvailableTabs(
  sessionState: ReturnType<typeof useDemoSession>
) {
  if (sessionState.status !== "authenticated") {
    return assistantTabs.filter((tab) => tab.id === "policy");
  }

  if (sessionState.session.user.role === ROLES.EMPLOYEE) {
    return assistantTabs.filter((tab) => tab.id === "policy" || tab.id === "goal");
  }

  return assistantTabs.filter(
    (tab) => tab.id === "policy" || tab.id === "summary"
  );
}

function getManagerIdForSession(
  sessionState: ReturnType<typeof useDemoSession>
) {
  if (sessionState.status !== "authenticated") {
    return "demo-manager";
  }

  return sessionState.session.user.role === ROLES.MANAGER
    ? sessionState.session.user.id
    : "demo-manager";
}

export function AIAssistantTabs() {
  const [activeTab, setActiveTab] = useState<AIAssistantTab>("policy");
  const sessionState = useDemoSession();
  const managerId = getManagerIdForSession(sessionState);
  const availableTabs = getAvailableTabs(sessionState);
  const selectedTab = availableTabs.some((tab) => tab.id === activeTab)
    ? activeTab
    : "policy";

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-subtle">
        <div
          className={cn(
            "grid gap-3",
            availableTabs.length > 1 && "md:grid-cols-2"
          )}
        >
          {availableTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = selectedTab === tab.id;

            return (
              <button
                type="button"
                className={cn(
                  "group rounded-2xl border px-4 py-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
                  isActive
                    ? "border-blue-200 bg-blue-50 text-blue-700 shadow-subtle"
                    : "border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100"
                )}
                aria-pressed={isActive}
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition-colors",
                      isActive
                        ? "bg-blue-600 text-white"
                        : "bg-white text-slate-500 group-hover:text-blue-700"
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <span
                      className={cn(
                        "block font-semibold",
                        isActive ? "text-blue-700" : "text-slate-950"
                      )}
                    >
                      {tab.label}
                    </span>
                    <p
                      className={cn(
                        "mt-1 text-sm leading-5",
                        isActive ? "text-blue-700/80" : "text-slate-500"
                      )}
                    >
                      {tab.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedTab === "policy" ? <PolicyChat /> : null}
      {selectedTab === "goal" ? <GoalCopilot /> : null}
      {selectedTab === "summary" ? <ManagerSummary managerId={managerId} /> : null}
    </div>
  );
}

