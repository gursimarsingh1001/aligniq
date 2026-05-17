"use client";

import {
  ALL_CHECKIN_WINDOWS,
  CHECKIN_WINDOW_HELPER_TEXT,
  CHECKIN_WINDOW_LABELS,
  type CheckinWindow
} from "@/lib/constants/checkin-windows";
import { cn } from "@/lib/utils";
import {
  getQuarterWindowStatus,
  type CycleWindow
} from "@/lib/utils/cycle-windows";

type QuarterSelectorProps = {
  activeWindow?: CycleWindow;
  value: CheckinWindow;
  onChange: (value: CheckinWindow) => void;
};

function getStatusLabel(status: ReturnType<typeof getQuarterWindowStatus>) {
  if (status === "active") {
    return "Active";
  }

  if (status === "closed") {
    return "Closed";
  }

  return "Upcoming";
}

export function QuarterSelector({
  activeWindow,
  value,
  onChange
}: QuarterSelectorProps) {
  return (
    <div className="w-full space-y-3">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-slate-950">Quarter window</p>
        <p className="text-sm text-slate-500">
          Select a quarter to view saved progress or update the active window.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 sm:grid-cols-4">
        {ALL_CHECKIN_WINDOWS.map((window) => {
          const status = activeWindow
            ? getQuarterWindowStatus(window, activeWindow)
            : null;

          return (
            <button
              type="button"
              key={window}
              onClick={() => onChange(window)}
              className={cn(
                "min-h-11 rounded-xl border px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20",
                value === window
                  ? "border-blue-600 bg-blue-600 text-white shadow-subtle"
                  : "border-transparent bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-700"
              )}
            >
              <span>{CHECKIN_WINDOW_LABELS[window]}</span>
              {status === "active" ? (
                <span
                  className={cn(
                    "ml-2 rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                    value === window
                      ? "bg-white/20 text-white"
                      : "bg-emerald-50 text-emerald-700"
                  )}
                >
                  {getStatusLabel(status)}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
      <p className="text-sm font-medium text-slate-600">
        {CHECKIN_WINDOW_HELPER_TEXT[value]}
      </p>
    </div>
  );
}
