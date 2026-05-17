export const ROLES = {
  EMPLOYEE: "employee",
  MANAGER: "manager",
  ADMIN: "admin"
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ALL_ROLES = [
  ROLES.EMPLOYEE,
  ROLES.MANAGER,
  ROLES.ADMIN
] as const satisfies readonly Role[];

export const ROLE_LABELS: Record<Role, string> = {
  [ROLES.EMPLOYEE]: "Employee",
  [ROLES.MANAGER]: "Manager",
  [ROLES.ADMIN]: "Admin / HR"
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  [ROLES.EMPLOYEE]: "Own quarterly goals, submit check-ins, and track progress.",
  [ROLES.MANAGER]: "Review team progress, approve goals, and support check-ins.",
  [ROLES.ADMIN]: "Manage cycles, reporting, and audit visibility for HR."
};
