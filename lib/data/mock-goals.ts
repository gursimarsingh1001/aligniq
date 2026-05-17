import { GOAL_STATUSES } from "@/lib/constants/goal-status";
import { UOM_TYPES } from "@/lib/constants/uom-types";
import type {
  Goal,
  GoalCycle,
  GoalSubmission,
  QuarterlyUpdate
} from "@/lib/types/goal";

const CREATED_AT = "2026-04-01T00:00:00.000Z";

export const mockGoalCycles: GoalCycle[] = [
  {
    id: "cycle-fy26-q2",
    name: "FY26 Q2",
    startsOn: "2026-04-01",
    endsOn: "2026-06-30",
    submissionDeadline: "2026-04-15",
    checkinStartsOn: "2026-06-01",
    checkinEndsOn: "2026-06-30",
    status: "active",
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT
  }
];

export const mockGoalSubmissions: GoalSubmission[] = [
  {
    id: "submission-emma-q2",
    employeeId: "demo-employee",
    managerId: "demo-manager",
    cycleId: "cycle-fy26-q2",
    status: GOAL_STATUSES.DRAFT,
    submittedAt: null,
    reviewedAt: null,
    reviewedBy: null,
    managerComment: null,
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT
  },
  {
    id: "submission-noah-q2",
    employeeId: "employee-noah",
    managerId: "demo-manager",
    cycleId: "cycle-fy26-q2",
    status: GOAL_STATUSES.SUBMITTED,
    submittedAt: "2026-04-13T10:15:00.000Z",
    reviewedAt: null,
    reviewedBy: null,
    managerComment: null,
    createdAt: CREATED_AT,
    updatedAt: "2026-04-13T10:15:00.000Z"
  },
  {
    id: "submission-lina-q2",
    employeeId: "employee-lina",
    managerId: "demo-manager",
    cycleId: "cycle-fy26-q2",
    status: GOAL_STATUSES.RETURNED,
    submittedAt: "2026-04-11T08:45:00.000Z",
    reviewedAt: "2026-04-12T10:20:00.000Z",
    reviewedBy: "demo-manager",
    managerComment: "Please make the reliability target measurable.",
    createdAt: CREATED_AT,
    updatedAt: "2026-04-12T10:20:00.000Z"
  },
  {
    id: "submission-owen-q2",
    employeeId: "employee-owen",
    managerId: "manager-priya",
    cycleId: "cycle-fy26-q2",
    status: GOAL_STATUSES.APPROVED,
    submittedAt: "2026-04-09T12:00:00.000Z",
    reviewedAt: "2026-04-10T11:30:00.000Z",
    reviewedBy: "manager-priya",
    managerComment: "Approved. Strong analytics focus.",
    createdAt: CREATED_AT,
    updatedAt: "2026-04-10T11:30:00.000Z"
  },
  {
    id: "submission-sophia-q2",
    employeeId: "employee-sophia",
    managerId: "manager-priya",
    cycleId: "cycle-fy26-q2",
    status: GOAL_STATUSES.DRAFT,
    submittedAt: null,
    reviewedAt: null,
    reviewedBy: null,
    managerComment: null,
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT
  }
];

export const mockGoals: Goal[] = [
  {
    id: "goal-emma-approval-workflow",
    submissionId: "submission-emma-q2",
    employeeId: "demo-employee",
    cycleId: "cycle-fy26-q2",
    title: "Complete quarterly goal review milestone",
    description:
      "Finish the planned quarterly goal review activity before the target date.",
    thrustArea: "Product Delivery",
    uomType: UOM_TYPES.TIMELINE,
    targetValue: null,
    targetDate: "2026-06-20",
    weightage: 35,
    status: GOAL_STATUSES.DRAFT,
    lockedAt: null,
    sortOrder: 1,
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT
  },
  {
    id: "goal-emma-completion-clarity",
    submissionId: "submission-emma-q2",
    employeeId: "demo-employee",
    cycleId: "cycle-fy26-q2",
    title: "Improve goal completion clarity",
    description: "Increase task success rate in usability testing.",
    thrustArea: "Customer Experience",
    uomType: UOM_TYPES.PERCENTAGE_MIN,
    targetValue: 85,
    targetDate: null,
    weightage: 35,
    status: GOAL_STATUSES.DRAFT,
    lockedAt: null,
    sortOrder: 2,
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT
  },
  {
    id: "goal-emma-handoff-defects",
    submissionId: "submission-emma-q2",
    employeeId: "demo-employee",
    cycleId: "cycle-fy26-q2",
    title: "Reduce design handoff defects",
    description: "Lower defects found during implementation reviews.",
    thrustArea: "Operational Excellence",
    uomType: UOM_TYPES.NUMERIC_MAX,
    targetValue: 8,
    targetDate: null,
    weightage: 20,
    status: GOAL_STATUSES.DRAFT,
    lockedAt: null,
    sortOrder: 3,
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT
  },
  {
    id: "goal-noah-dashboard-performance",
    submissionId: "submission-noah-q2",
    employeeId: "employee-noah",
    cycleId: "cycle-fy26-q2",
    title: "Improve dashboard performance",
    description: "Reduce dashboard interaction latency.",
    thrustArea: "Engineering Quality",
    uomType: UOM_TYPES.NUMERIC_MAX,
    targetValue: 250,
    targetDate: null,
    weightage: 50,
    status: GOAL_STATUSES.SUBMITTED,
    lockedAt: null,
    sortOrder: 1,
    createdAt: CREATED_AT,
    updatedAt: "2026-04-13T10:15:00.000Z"
  },
  {
    id: "goal-noah-test-coverage",
    submissionId: "submission-noah-q2",
    employeeId: "employee-noah",
    cycleId: "cycle-fy26-q2",
    title: "Increase test coverage",
    description: "Raise coverage for role guard and service functions.",
    thrustArea: "Engineering Quality",
    uomType: UOM_TYPES.PERCENTAGE_MIN,
    targetValue: 80,
    targetDate: null,
    weightage: 50,
    status: GOAL_STATUSES.SUBMITTED,
    lockedAt: null,
    sortOrder: 2,
    createdAt: CREATED_AT,
    updatedAt: "2026-04-13T10:15:00.000Z"
  },
  {
    id: "goal-lina-api-reliability",
    submissionId: "submission-lina-q2",
    employeeId: "employee-lina",
    cycleId: "cycle-fy26-q2",
    title: "Improve API reliability",
    description: "Reduce incident count after schema changes.",
    thrustArea: "Operational Excellence",
    uomType: UOM_TYPES.ZERO_BASED,
    targetValue: 0,
    targetDate: null,
    weightage: 100,
    status: GOAL_STATUSES.RETURNED,
    lockedAt: null,
    sortOrder: 1,
    createdAt: CREATED_AT,
    updatedAt: "2026-04-12T10:20:00.000Z"
  },
  {
    id: "goal-owen-insights-pack",
    submissionId: "submission-owen-q2",
    employeeId: "employee-owen",
    cycleId: "cycle-fy26-q2",
    title: "Publish quarterly insights pack",
    description: "Deliver reporting insights for HR and managers.",
    thrustArea: "Business Impact",
    uomType: UOM_TYPES.TIMELINE,
    targetValue: null,
    targetDate: "2026-06-25",
    weightage: 40,
    status: GOAL_STATUSES.APPROVED,
    lockedAt: "2026-04-10T11:30:00.000Z",
    sortOrder: 1,
    createdAt: CREATED_AT,
    updatedAt: "2026-04-10T11:30:00.000Z"
  },
  {
    id: "goal-owen-report-adoption",
    submissionId: "submission-owen-q2",
    employeeId: "employee-owen",
    cycleId: "cycle-fy26-q2",
    title: "Increase report adoption",
    description: "Increase weekly report usage among managers.",
    thrustArea: "Customer Experience",
    uomType: UOM_TYPES.NUMERIC_MIN,
    targetValue: 25,
    targetDate: null,
    weightage: 60,
    status: GOAL_STATUSES.APPROVED,
    lockedAt: "2026-04-10T11:30:00.000Z",
    sortOrder: 2,
    createdAt: CREATED_AT,
    updatedAt: "2026-04-10T11:30:00.000Z"
  }
];

export const mockQuarterlyUpdates: QuarterlyUpdate[] = [
  {
    id: "update-emma-approval-workflow",
    goalId: "goal-emma-approval-workflow",
    employeeId: "demo-employee",
    cycleId: "cycle-fy26-q2",
    actualValue: null,
    completionDate: "2026-06-18",
    progressScore: 100,
    employeeComment: "Workflow shipped two days before target.",
    createdAt: "2026-06-28T10:00:00.000Z",
    updatedAt: "2026-06-28T10:00:00.000Z"
  },
  {
    id: "update-emma-completion-clarity",
    goalId: "goal-emma-completion-clarity",
    employeeId: "demo-employee",
    cycleId: "cycle-fy26-q2",
    actualValue: 78,
    completionDate: "2026-06-20",
    progressScore: 91.76,
    employeeComment: "Testing improved, but two flows still need polish.",
    createdAt: "2026-06-28T10:05:00.000Z",
    updatedAt: "2026-06-28T10:05:00.000Z"
  },
  {
    id: "update-emma-handoff-defects",
    goalId: "goal-emma-handoff-defects",
    employeeId: "demo-employee",
    cycleId: "cycle-fy26-q2",
    actualValue: 6,
    completionDate: "2026-06-21",
    progressScore: 133.33,
    employeeComment: "Reduced implementation defects below target.",
    createdAt: "2026-06-28T10:10:00.000Z",
    updatedAt: "2026-06-28T10:10:00.000Z"
  },
  {
    id: "update-owen-insights-pack",
    goalId: "goal-owen-insights-pack",
    employeeId: "employee-owen",
    cycleId: "cycle-fy26-q2",
    actualValue: null,
    completionDate: "2026-06-27",
    progressScore: 90,
    employeeComment: "Pack is complete, delivered after target date.",
    createdAt: "2026-06-29T09:00:00.000Z",
    updatedAt: "2026-06-29T09:00:00.000Z"
  },
  {
    id: "update-owen-report-adoption",
    goalId: "goal-owen-report-adoption",
    employeeId: "employee-owen",
    cycleId: "cycle-fy26-q2",
    actualValue: 21,
    completionDate: "2026-06-26",
    progressScore: 84,
    employeeComment: "Adoption improved steadily through June.",
    createdAt: "2026-06-29T09:05:00.000Z",
    updatedAt: "2026-06-29T09:05:00.000Z"
  }
];
