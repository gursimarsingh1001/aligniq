export const CHECKIN_WINDOWS = {
  Q1: "q1",
  Q2: "q2",
  Q3: "q3",
  Q4: "q4_annual"
} as const;

export type CheckinWindow =
  (typeof CHECKIN_WINDOWS)[keyof typeof CHECKIN_WINDOWS];

export const ALL_CHECKIN_WINDOWS = [
  CHECKIN_WINDOWS.Q1,
  CHECKIN_WINDOWS.Q2,
  CHECKIN_WINDOWS.Q3,
  CHECKIN_WINDOWS.Q4
] as const satisfies readonly CheckinWindow[];

export const CHECKIN_WINDOW_LABELS: Record<CheckinWindow, string> = {
  [CHECKIN_WINDOWS.Q1]: "Q1",
  [CHECKIN_WINDOWS.Q2]: "Q2",
  [CHECKIN_WINDOWS.Q3]: "Q3",
  [CHECKIN_WINDOWS.Q4]: "Q4 / Annual"
};

export const CHECKIN_WINDOW_HELPER_TEXT: Record<CheckinWindow, string> = {
  [CHECKIN_WINDOWS.Q1]: "Q1 check-in window: July",
  [CHECKIN_WINDOWS.Q2]: "Q2 check-in window: October",
  [CHECKIN_WINDOWS.Q3]: "Q3 check-in window: January",
  [CHECKIN_WINDOWS.Q4]: "Q4 / Annual check-in window: March / April"
};

export const CHECKIN_PROGRESS_STATUSES = {
  NOT_STARTED: "not_started",
  ON_TRACK: "on_track",
  COMPLETED: "completed"
} as const;

export type CheckinProgressStatus =
  (typeof CHECKIN_PROGRESS_STATUSES)[keyof typeof CHECKIN_PROGRESS_STATUSES];

export const ALL_CHECKIN_PROGRESS_STATUSES = [
  CHECKIN_PROGRESS_STATUSES.NOT_STARTED,
  CHECKIN_PROGRESS_STATUSES.ON_TRACK,
  CHECKIN_PROGRESS_STATUSES.COMPLETED
] as const satisfies readonly CheckinProgressStatus[];

export const CHECKIN_PROGRESS_STATUS_LABELS: Record<
  CheckinProgressStatus,
  string
> = {
  [CHECKIN_PROGRESS_STATUSES.NOT_STARTED]: "Not Started",
  [CHECKIN_PROGRESS_STATUSES.ON_TRACK]: "On Track",
  [CHECKIN_PROGRESS_STATUSES.COMPLETED]: "Completed"
};
