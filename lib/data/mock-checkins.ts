import type { ManagerCheckin } from "@/lib/types/checkin";

export const mockCheckins: ManagerCheckin[] = [
  {
    id: "checkin-emma-q2",
    employeeId: "demo-employee",
    managerId: "demo-manager",
    cycleId: "cycle-fy26-q2",
    quarterLabel: "FY26 Q2",
    comment:
      "Strong progress. Keep design handoff notes tied to measurable outcomes.",
    createdAt: "2026-06-15T11:00:00.000Z",
    updatedAt: "2026-06-15T11:00:00.000Z"
  },
  {
    id: "checkin-noah-q2",
    employeeId: "employee-noah",
    managerId: "demo-manager",
    cycleId: "cycle-fy26-q2",
    quarterLabel: "FY26 Q2",
    comment:
      "Good engineering focus. Approval pending after performance baseline review.",
    createdAt: "2026-06-15T11:30:00.000Z",
    updatedAt: "2026-06-15T11:30:00.000Z"
  },
  {
    id: "checkin-owen-q2",
    employeeId: "employee-owen",
    managerId: "manager-priya",
    cycleId: "cycle-fy26-q2",
    quarterLabel: "FY26 Q2",
    comment:
      "Reporting work is on track. Add a concise readout for HR leaders.",
    createdAt: "2026-06-16T09:15:00.000Z",
    updatedAt: "2026-06-16T09:15:00.000Z"
  }
];
