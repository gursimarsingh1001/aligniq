import type { PolicyKnowledgeChunk } from "@/lib/types/ai";

export const POLICY_KNOWLEDGE_BASE: PolicyKnowledgeChunk[] = [
  {
    id: "goal-count-weightage",
    title: "Goal count and weightage rules",
    content:
      "Employees can create a maximum of 8 goals. Each individual goal must have at least 10% weightage. Total weightage across submitted goals must equal exactly 100%.",
    keywords: [
      "maximum goals",
      "how many goals",
      "8 goals",
      "minimum weightage",
      "10%",
      "total weightage",
      "100%"
    ]
  },
  {
    id: "manager-approval",
    title: "Manager approval and locking",
    content:
      "Managers review submitted goals, may adjust target and weightage, approve goals, or return them for rework with comments. Once approved, goals are locked and employees cannot edit them.",
    keywords: [
      "manager approval",
      "approve goals",
      "return for rework",
      "locked",
      "unlock",
      "edit approved",
      "target",
      "weightage"
    ]
  },
  {
    id: "quarterly-windows",
    title: "Goal setting and check-in windows",
    content:
      "Goal setting opens on 1st May. Q1 check-in happens in July, Q2 in October, Q3 in January, and Q4 or Annual check-in happens in March or April.",
    keywords: [
      "goal setting",
      "1st may",
      "q1",
      "q2",
      "q3",
      "q4",
      "annual",
      "july",
      "october",
      "january",
      "march",
      "april"
    ]
  },
  {
    id: "uom-progress-formulas",
    title: "Measurement progress formulas",
    content:
      "Minimum number and minimum percentage goals use higher-value-is-better scoring, where progress equals achievement divided by target. Maximum number and maximum percentage goals use lower-value-is-better scoring, where progress equals target divided by achievement. Due date goals compare completion date against the deadline. Zero target goals score 100% when actual achievement is 0, otherwise 0%.",
    keywords: [
      "formula",
      "numeric min",
      "numeric max",
      "percentage min",
      "percentage max",
      "higher is better",
      "lower is better",
      "timeline",
      "zero based",
      "achievement",
      "target"
    ]
  },
  {
    id: "quarterly-updates",
    title: "Quarterly achievement updates",
    content:
      "Quarterly updates are entered only against approved and locked goals. Employees record actual achievement and status for each goal. Managers add structured check-in comments to document the quarterly discussion.",
    keywords: [
      "quarterly update",
      "actual achievement",
      "status",
      "not started",
      "on track",
      "completed",
      "manager comment",
      "check-in comment",
      "approved goals"
    ]
  },
  {
    id: "admin-reporting",
    title: "Admin reporting and governance",
    content:
      "Admin and HR oversee cycles, completion dashboards, achievement reports, audit logs, exception handling, and readiness for goal setting and check-in windows. Reports should show planned target versus actual achievement.",
    keywords: [
      "admin",
      "hr",
      "reports",
      "audit logs",
      "completion dashboard",
      "planned target",
      "actual achievement",
      "exception",
      "cycle readiness"
    ]
  },
  {
    id: "approved-goal-exceptions",
    title: "Approved goal exceptions",
    content:
      "The current workspace does not include an employee self-service unlock flow. Approved goals are locked for employees, and any exception should be handled through Admin or HR governance.",
    keywords: [
      "who can unlock",
      "unlock approved",
      "approved goals",
      "exception",
      "admin",
      "hr",
      "locked goals"
    ]
  }
];
