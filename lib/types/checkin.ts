import type {
  CheckinProgressStatus,
  CheckinWindow
} from "@/lib/constants/checkin-windows";
import type { Goal } from "@/lib/types/goal";

export type ManagerCheckin = {
  id: string;
  employeeId: string;
  managerId: string;
  cycleId: string;
  quarterLabel: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
};

export type EmployeeQuarterlyAchievement = {
  id: string;
  goalId: string;
  employeeId: string;
  cycleId: string;
  checkinWindow: CheckinWindow;
  actualValue: number | null;
  completionDate: string | null;
  progressStatus: CheckinProgressStatus;
  progressScore: number;
  createdAt: string;
  updatedAt: string;
};

export type EmployeeAchievementInput = {
  goalId: string;
  actualValue?: number | null;
  completionDate?: string | null;
  progressStatus: CheckinProgressStatus;
};

export type SaveEmployeeAchievementsInput = {
  employeeId: string;
  cycleId: string;
  checkinWindow: CheckinWindow;
  achievements: EmployeeAchievementInput[];
};

export type PlannedVsActualRow = {
  goal: Goal;
  achievement: EmployeeQuarterlyAchievement | null;
};

export type TeamCheckinSummary = {
  employeeId: string;
  employeeName: string;
  departmentName: string;
  approvedGoalCount: number;
  updatedGoalCount: number;
  managerCheckin: ManagerCheckin | null;
};
