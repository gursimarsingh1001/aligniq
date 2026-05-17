import {
  ROLE_DESCRIPTIONS,
  ROLE_LABELS,
  ROLES,
  type Role
} from "@/lib/constants/roles";

export type DemoUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  title: string;
  department: string;
};

export type EvaluationCredentials = {
  email: string;
  password: string;
};

export type EvaluationAccount = {
  email: string;
  password: string;
  role: Role;
  name: string;
};

const EVALUATION_PASSWORD = "AlignIQ@123";
const LEGACY_EVALUATION_PASSWORD = "GoalSync@123";

const LEGACY_EMAIL_ALIASES: Record<string, string> = {
  "employee@demo.com": "employee@aligniq.local",
  "manager@demo.com": "manager@aligniq.local",
  "admin@demo.com": "admin@aligniq.local",
  "employee@goalsync.local": "employee@aligniq.local",
  "manager@goalsync.local": "manager@aligniq.local",
  "admin@goalsync.local": "admin@aligniq.local"
};

export const DEMO_USERS: DemoUser[] = [
  {
    id: "demo-employee",
    name: "Emma Patel",
    email: "employee@aligniq.local",
    role: ROLES.EMPLOYEE,
    title: "Product Designer",
    department: "Product"
  },
  {
    id: "demo-manager",
    name: "Marcus Chen",
    email: "manager@aligniq.local",
    role: ROLES.MANAGER,
    title: "Engineering Manager",
    department: "Engineering"
  },
  {
    id: "demo-admin",
    name: "Ava Rodriguez",
    email: "admin@aligniq.local",
    role: ROLES.ADMIN,
    title: "People Operations Lead",
    department: "People"
  }
];

export const EVALUATION_ACCOUNTS: EvaluationAccount[] = DEMO_USERS.map(
  (user) => ({
    email: user.email,
    password: EVALUATION_PASSWORD,
    role: user.role,
    name: user.name
  })
);

export function getEvaluationAccountByEmail(email: string) {
  const emailKey = email.trim().toLowerCase();
  const normalizedEmail = LEGACY_EMAIL_ALIASES[emailKey] ?? emailKey;
  return (
    EVALUATION_ACCOUNTS.find((account) => account.email === normalizedEmail) ??
    null
  );
}

export function isValidEvaluationPassword(password: string) {
  return password === EVALUATION_PASSWORD || password === LEGACY_EVALUATION_PASSWORD;
}

export function getDemoUserById(userId: string) {
  return DEMO_USERS.find((user) => user.id === userId) ?? null;
}

export function getDemoUserByEmail(email: string) {
  const emailKey = email.trim().toLowerCase();
  const normalizedEmail = LEGACY_EMAIL_ALIASES[emailKey] ?? emailKey;
  return DEMO_USERS.find((user) => user.email === normalizedEmail) ?? null;
}

export function getDemoRoleLabel(role: Role) {
  return ROLE_LABELS[role];
}

export function getDemoRoleDescription(role: Role) {
  return ROLE_DESCRIPTIONS[role];
}
