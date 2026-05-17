import {
  CHECKIN_PROGRESS_STATUSES,
  CHECKIN_WINDOWS
} from "@/lib/constants/checkin-windows";
import { mockCheckins } from "@/lib/data/mock-checkins";
import {
  mockGoals,
  mockGoalSubmissions,
  mockQuarterlyUpdates
} from "@/lib/data/mock-goals";
import { mockNotifications } from "@/lib/data/mock-notifications";
import type {
  EmployeeQuarterlyAchievement,
  ManagerCheckin
} from "@/lib/types/checkin";
import type { GoalSubmissionWithGoals } from "@/lib/types/goal";

const EVALUATION_STATE_KEY = "aligniq:evaluation-state:v1";

export type EvaluationState = {
  version: 1;
  goalSubmissions: GoalSubmissionWithGoals[];
  employeeAchievements: EmployeeQuarterlyAchievement[];
  managerCheckins: ManagerCheckin[];
  notificationReadIds: string[];
  updatedAt: string;
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function getProgressStatus(progressScore: number) {
  if (progressScore >= 100) {
    return CHECKIN_PROGRESS_STATUSES.COMPLETED;
  }

  if (progressScore >= 50) {
    return CHECKIN_PROGRESS_STATUSES.ON_TRACK;
  }

  return CHECKIN_PROGRESS_STATUSES.NOT_STARTED;
}

function getSeedGoalSubmissions(): GoalSubmissionWithGoals[] {
  return mockGoalSubmissions.map((submission) => ({
    ...submission,
    goals: mockGoals
      .filter((goal) => goal.submissionId === submission.id)
      .sort((firstGoal, secondGoal) => firstGoal.sortOrder - secondGoal.sortOrder)
  }));
}

function getSeedEmployeeAchievements(): EmployeeQuarterlyAchievement[] {
  return mockQuarterlyUpdates.map((update) => ({
    id: `achievement-${update.id}`,
    goalId: update.goalId,
    employeeId: update.employeeId,
    cycleId: update.cycleId,
    checkinWindow: CHECKIN_WINDOWS.Q2,
    actualValue: update.actualValue,
    completionDate: update.completionDate,
    progressStatus: getProgressStatus(update.progressScore),
    progressScore: update.progressScore,
    createdAt: update.createdAt,
    updatedAt: update.updatedAt
  }));
}

export function getInitialEvaluationState(): EvaluationState {
  return clone({
    version: 1,
    goalSubmissions: getSeedGoalSubmissions(),
    employeeAchievements: getSeedEmployeeAchievements(),
    managerCheckins: mockCheckins,
    notificationReadIds: mockNotifications
      .filter((notification) => notification.isRead)
      .map((notification) => notification.id),
    updatedAt: "2026-04-01T00:00:00.000Z"
  });
}

export function getStoredEvaluationState(): EvaluationState {
  if (typeof window === "undefined") {
    return getInitialEvaluationState();
  }

  const storedState = window.localStorage.getItem(EVALUATION_STATE_KEY);

  if (!storedState) {
    const initialState = getInitialEvaluationState();
    saveEvaluationState(initialState);
    return initialState;
  }

  try {
    const parsedState = JSON.parse(storedState) as EvaluationState;

    if (parsedState.version !== 1) {
      return getInitialEvaluationState();
    }

    return parsedState;
  } catch {
    return getInitialEvaluationState();
  }
}

export function saveEvaluationState(state: EvaluationState) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    EVALUATION_STATE_KEY,
    JSON.stringify({
      ...state,
      updatedAt: new Date().toISOString()
    })
  );
}

export function updateEvaluationState(
  updater: (state: EvaluationState) => EvaluationState
) {
  const nextState = updater(getStoredEvaluationState());
  saveEvaluationState(nextState);
  return nextState;
}

export function clearEvaluationState() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(EVALUATION_STATE_KEY);
}

export function upsertEvaluationGoalSubmission(
  submission: GoalSubmissionWithGoals
) {
  updateEvaluationState((state) => ({
    ...state,
    goalSubmissions: [
      ...state.goalSubmissions.filter((item) => item.id !== submission.id),
      clone(submission)
    ]
  }));
}

export function upsertEvaluationAchievements(
  achievements: EmployeeQuarterlyAchievement[]
) {
  updateEvaluationState((state) => {
    const nextAchievements = state.employeeAchievements.filter(
      (storedAchievement) =>
        !achievements.some(
          (achievement) =>
            achievement.goalId === storedAchievement.goalId &&
            achievement.employeeId === storedAchievement.employeeId &&
            achievement.checkinWindow === storedAchievement.checkinWindow
        )
    );

    return {
      ...state,
      employeeAchievements: [...nextAchievements, ...clone(achievements)]
    };
  });
}

export function upsertEvaluationManagerCheckin(checkin: ManagerCheckin) {
  updateEvaluationState((state) => ({
    ...state,
    managerCheckins: [
      ...state.managerCheckins.filter((item) => item.id !== checkin.id),
      clone(checkin)
    ]
  }));
}

export function saveEvaluationNotificationReadIds(readIds: string[]) {
  updateEvaluationState((state) => ({
    ...state,
    notificationReadIds: Array.from(new Set(readIds))
  }));
}
