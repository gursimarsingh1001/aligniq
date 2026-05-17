import { ALL_ROLES, ROLES, type Role } from "@/lib/constants/roles";

export const ROUTES = {
  LOGIN: "/login",
  AI_ASSISTANT: "/ai-assistant",
  NOTIFICATIONS: "/notifications",
  EMPLOYEE_DASHBOARD: "/employee/dashboard",
  EMPLOYEE_GOALS: "/employee/goals",
  EMPLOYEE_CHECKINS: "/employee/checkins",
  MANAGER_DASHBOARD: "/manager/dashboard",
  MANAGER_APPROVALS: "/manager/approvals",
  MANAGER_CHECKINS: "/manager/checkins",
  MANAGER_SHARED_GOALS: "/manager/shared-goals",
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_AUDIT_LOGS: "/admin/audit-logs",
  ADMIN_REPORTS: "/admin/reports",
  ADMIN_CYCLES: "/admin/cycles",
  ADMIN_ANALYTICS: "/admin/analytics",
  ADMIN_ESCALATIONS: "/admin/escalations",
  ADMIN_SHARED_GOALS: "/admin/shared-goals"
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];

export type NavigationIcon =
  | "LayoutDashboard"
  | "Target"
  | "ClipboardCheck"
  | "CircleCheck"
  | "FileClock"
  | "BarChart3"
  | "CalendarRange"
  | "Bell"
  | "TriangleAlert"
  | "TrendingUp"
  | "Share2"
  | "Sparkles";

export type NavigationItem = {
  title: string;
  href: AppRoute;
  icon: NavigationIcon;
  description: string;
};

export const ROLE_DASHBOARD_PATHS: Record<Role, AppRoute> = {
  [ROLES.EMPLOYEE]: ROUTES.EMPLOYEE_DASHBOARD,
  [ROLES.MANAGER]: ROUTES.MANAGER_DASHBOARD,
  [ROLES.ADMIN]: ROUTES.ADMIN_DASHBOARD
};

const sharedNavigation = [
  {
    title: "Notifications",
    href: ROUTES.NOTIFICATIONS,
    icon: "Bell",
    description: "In-app workflow alerts and escalation notifications."
  },
  {
    title: "AlignIQ Assistant",
    href: ROUTES.AI_ASSISTANT,
    icon: "Sparkles",
    description: "A future assistant for goal writing and performance summaries."
  }
] as const satisfies readonly NavigationItem[];

export const NAVIGATION_BY_ROLE: Record<Role, NavigationItem[]> = {
  [ROLES.EMPLOYEE]: [
    {
      title: "Dashboard",
      href: ROUTES.EMPLOYEE_DASHBOARD,
      icon: "LayoutDashboard",
      description: "Quarterly focus, progress, and next actions."
    },
    {
      title: "Goals",
      href: ROUTES.EMPLOYEE_GOALS,
      icon: "Target",
      description: "Draft, submit, and manage personal goals."
    },
    {
      title: "Check-ins",
      href: ROUTES.EMPLOYEE_CHECKINS,
      icon: "ClipboardCheck",
      description: "Capture weekly progress and blockers."
    },
    ...sharedNavigation
  ],
  [ROLES.MANAGER]: [
    {
      title: "Dashboard",
      href: ROUTES.MANAGER_DASHBOARD,
      icon: "LayoutDashboard",
      description: "Team health, pending work, and quarterly trends."
    },
    {
      title: "Approvals",
      href: ROUTES.MANAGER_APPROVALS,
      icon: "CircleCheck",
      description: "Review submitted goals and revision requests."
    },
    {
      title: "Check-ins",
      href: ROUTES.MANAGER_CHECKINS,
      icon: "ClipboardCheck",
      description: "Monitor team check-ins and coaching needs."
    },
    {
      title: "Shared Goals",
      href: ROUTES.MANAGER_SHARED_GOALS,
      icon: "Share2",
      description: "Push shared KPIs to linked employee goal sheets."
    },
    ...sharedNavigation
  ],
  [ROLES.ADMIN]: [
    {
      title: "Dashboard",
      href: ROUTES.ADMIN_DASHBOARD,
      icon: "LayoutDashboard",
      description: "Program health, cycle status, and HR actions."
    },
    {
      title: "Audit Logs",
      href: ROUTES.ADMIN_AUDIT_LOGS,
      icon: "FileClock",
      description: "Trace sensitive actions and policy events."
    },
    {
      title: "Reports",
      href: ROUTES.ADMIN_REPORTS,
      icon: "BarChart3",
      description: "Export performance and goal completion reports."
    },
    {
      title: "Analytics",
      href: ROUTES.ADMIN_ANALYTICS,
      icon: "TrendingUp",
      description: "Review trends, distributions, and risk indicators."
    },
    {
      title: "Shared Goals",
      href: ROUTES.ADMIN_SHARED_GOALS,
      icon: "Share2",
      description: "Govern departmental KPIs and linked assignments."
    },
    {
      title: "Escalations",
      href: ROUTES.ADMIN_ESCALATIONS,
      icon: "TriangleAlert",
      description: "Monitor rule-based escalation triggers and follow-ups."
    },
    {
      title: "Cycles",
      href: ROUTES.ADMIN_CYCLES,
      icon: "CalendarRange",
      description: "Configure quarterly goal cycles and milestones."
    },
    ...sharedNavigation
  ]
};

export const PROTECTED_ROUTE_RULES = [
  {
    prefix: "/employee",
    roles: [ROLES.EMPLOYEE]
  },
  {
    prefix: "/manager",
    roles: [ROLES.MANAGER]
  },
  {
    prefix: "/admin",
    roles: [ROLES.ADMIN]
  },
  {
    prefix: ROUTES.AI_ASSISTANT,
    roles: [...ALL_ROLES]
  },
  {
    prefix: ROUTES.NOTIFICATIONS,
    roles: [...ALL_ROLES]
  }
] as const satisfies readonly { prefix: string; roles: readonly Role[] }[];

export function getAllowedRolesForPath(pathname: string): readonly Role[] {
  const rule = PROTECTED_ROUTE_RULES.find((routeRule) =>
    pathname.startsWith(routeRule.prefix)
  );

  return rule?.roles ?? ALL_ROLES;
}
