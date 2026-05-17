import {
  CHECKIN_WINDOWS,
  type CheckinWindow
} from "@/lib/constants/checkin-windows";

export const CYCLE_WINDOWS = {
  GOAL_SETTING: "goal_setting",
  Q1: CHECKIN_WINDOWS.Q1,
  Q2: CHECKIN_WINDOWS.Q2,
  Q3: CHECKIN_WINDOWS.Q3,
  Q4: CHECKIN_WINDOWS.Q4
} as const;

export type CycleWindow = (typeof CYCLE_WINDOWS)[keyof typeof CYCLE_WINDOWS];

export type CycleWindowStatus = "active" | "closed" | "upcoming";

export const DEFAULT_ACTIVE_CYCLE_WINDOW: CycleWindow = CYCLE_WINDOWS.Q2;

export const ACTIVE_CYCLE_WINDOW_STORAGE_KEY = "aligniq-active-cycle-window";
const ACTIVE_CYCLE_WINDOW_CHANGE_EVENT = "aligniq-active-cycle-window-change";

export const CYCLE_WINDOW_ORDER = [
  CYCLE_WINDOWS.GOAL_SETTING,
  CYCLE_WINDOWS.Q1,
  CYCLE_WINDOWS.Q2,
  CYCLE_WINDOWS.Q3,
  CYCLE_WINDOWS.Q4
] as const satisfies readonly CycleWindow[];

export const CYCLE_WINDOW_DETAILS: Record<
  CycleWindow,
  {
    description: string;
    label: string;
    windowLabel: string;
  }
> = {
  [CYCLE_WINDOWS.GOAL_SETTING]: {
    label: "Goal Setting",
    windowLabel: "1st May",
    description:
      "Employees create goals, align weightage, and submit for manager approval."
  },
  [CYCLE_WINDOWS.Q1]: {
    label: "Q1 Check-in",
    windowLabel: "July",
    description: "Employees record Q1 achievement and managers add comments."
  },
  [CYCLE_WINDOWS.Q2]: {
    label: "Q2 Check-in",
    windowLabel: "October",
    description: "Mid-cycle review of planned targets, actuals, and blockers."
  },
  [CYCLE_WINDOWS.Q3]: {
    label: "Q3 Check-in",
    windowLabel: "January",
    description: "Progress review before annual closeout preparation."
  },
  [CYCLE_WINDOWS.Q4]: {
    label: "Q4 / Annual",
    windowLabel: "March / April",
    description: "Annual achievement capture and final cycle governance review."
  }
};

export function isCycleWindow(value: string): value is CycleWindow {
  return (CYCLE_WINDOW_ORDER as readonly string[]).includes(value);
}

export function getCycleWindowStatus(
  window: CycleWindow,
  activeWindow: CycleWindow
): CycleWindowStatus {
  if (window === activeWindow) {
    return "active";
  }

  return CYCLE_WINDOW_ORDER.indexOf(window) <
    CYCLE_WINDOW_ORDER.indexOf(activeWindow)
    ? "closed"
    : "upcoming";
}

export function isCheckinWindow(value: CycleWindow): value is CheckinWindow {
  return value !== CYCLE_WINDOWS.GOAL_SETTING;
}

export function getActiveCheckinWindow(
  activeWindow: CycleWindow = DEFAULT_ACTIVE_CYCLE_WINDOW
): CheckinWindow | null {
  return isCheckinWindow(activeWindow) ? activeWindow : null;
}

export function isQuarterEditable(
  quarter: CheckinWindow,
  activeWindow: CycleWindow = DEFAULT_ACTIVE_CYCLE_WINDOW
) {
  return activeWindow === quarter;
}

export function getQuarterWindowStatus(
  quarter: CheckinWindow,
  activeWindow: CycleWindow = DEFAULT_ACTIVE_CYCLE_WINDOW
) {
  return getCycleWindowStatus(quarter, activeWindow);
}

export function getStoredActiveCycleWindow() {
  if (typeof window === "undefined") {
    return DEFAULT_ACTIVE_CYCLE_WINDOW;
  }

  const storedWindow = window.localStorage.getItem(
    ACTIVE_CYCLE_WINDOW_STORAGE_KEY
  );

  return storedWindow && isCycleWindow(storedWindow)
    ? storedWindow
    : DEFAULT_ACTIVE_CYCLE_WINDOW;
}

export function setStoredActiveCycleWindow(activeWindow: CycleWindow) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ACTIVE_CYCLE_WINDOW_STORAGE_KEY, activeWindow);
  window.dispatchEvent(new Event(ACTIVE_CYCLE_WINDOW_CHANGE_EVENT));
}

export function subscribeToActiveCycleWindow(
  onStoreChange: () => void
): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener("storage", onStoreChange);
  window.addEventListener(ACTIVE_CYCLE_WINDOW_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(ACTIVE_CYCLE_WINDOW_CHANGE_EVENT, onStoreChange);
  };
}

export function getActiveCycleWindowSnapshot() {
  return getStoredActiveCycleWindow();
}

export function getActiveCycleWindowServerSnapshot() {
  return DEFAULT_ACTIVE_CYCLE_WINDOW;
}
