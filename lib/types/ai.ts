import type {
  CheckinWindow
} from "@/lib/constants/checkin-windows";
import type { ThrustArea } from "@/lib/constants/thrust-areas";
import type { UomType } from "@/lib/constants/uom-types";

export type PolicyKnowledgeChunk = {
  id: string;
  title: string;
  content: string;
  keywords: string[];
};

export type PolicyAnswer = {
  question: string;
  answer: string;
  matchedChunks: PolicyKnowledgeChunk[];
  confidence: "matched" | "not_found";
  sourceNote: string;
};

export type GoalCopilotSuggestion = {
  sourceIdea: string;
  title: string;
  description: string;
  thrustArea: ThrustArea;
  uomType: UomType;
  targetExample: string;
  weightage: number;
  measurableReason: string;
};

export type ManagerSummaryEmployee = {
  employeeId: string;
  employeeName: string;
  departmentName: string;
};

export type ManagerCheckinSummaryInput = {
  managerId: string;
  employeeId: string;
  checkinWindow: CheckinWindow;
};

export type ManagerCheckinSummary = {
  employeeId: string;
  employeeName: string;
  quarterLabel: string;
  summary: string;
  keyAchievements: string[];
  risks: string[];
  suggestedManagerComment: string;
  reminder: string;
};
