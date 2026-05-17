import { ROLES } from "@/lib/constants/roles";
import { ROUTES } from "@/lib/constants/routes";
import type { Notification } from "@/lib/types/notification";

export const mockNotifications: Notification[] = [
  {
    id: "notification-goal-submitted-manager",
    title: "Goals submitted for review",
    message: "Noah Williams submitted Q2 goals and is waiting for manager review.",
    recipientRole: ROLES.MANAGER,
    eventType: "goal_submitted",
    isRead: false,
    createdAt: "2026-04-13T10:20:00.000Z",
    targetRoute: ROUTES.MANAGER_APPROVALS
  },
  {
    id: "notification-goal-approved-employee",
    title: "Goals approved",
    message: "Your Q2 goals were approved and are now locked for tracking.",
    recipientRole: ROLES.EMPLOYEE,
    eventType: "goal_approved",
    isRead: true,
    createdAt: "2026-04-12T14:05:00.000Z",
    targetRoute: ROUTES.EMPLOYEE_GOALS
  },
  {
    id: "notification-goal-returned-employee",
    title: "Goals returned for rework",
    message: "A manager returned a goal submission with comments for revision.",
    recipientRole: ROLES.EMPLOYEE,
    eventType: "goal_returned",
    isRead: false,
    createdAt: "2026-04-12T10:25:00.000Z",
    targetRoute: ROUTES.EMPLOYEE_GOALS
  },
  {
    id: "notification-quarterly-reminder-employee",
    title: "Quarterly check-in reminder",
    message: "Update actual achievement for approved goals before the check-in window closes.",
    recipientRole: ROLES.EMPLOYEE,
    eventType: "quarterly_checkin_reminder",
    isRead: false,
    createdAt: "2026-06-24T09:00:00.000Z",
    targetRoute: ROUTES.EMPLOYEE_CHECKINS
  },
  {
    id: "notification-manager-checkin-pending",
    title: "Manager check-in pending",
    message: "Some team members still need structured manager check-in comments.",
    recipientRole: ROLES.MANAGER,
    eventType: "manager_checkin_pending",
    isRead: false,
    createdAt: "2026-06-27T11:00:00.000Z",
    targetRoute: ROUTES.MANAGER_CHECKINS
  },
  {
    id: "notification-escalation-admin",
    title: "Escalation triggered",
    message: "A goal submission or quarterly check-in rule triggered an HR visibility item.",
    recipientRole: ROLES.ADMIN,
    eventType: "escalation_triggered",
    isRead: false,
    createdAt: "2026-06-29T15:05:00.000Z",
    targetRoute: ROUTES.ADMIN_ESCALATIONS
  },
  {
    id: "notification-report-ready-admin",
    title: "Achievement report ready",
    message: "The Q2 planned versus actual achievement report is available for review.",
    recipientRole: ROLES.ADMIN,
    eventType: "manager_checkin_pending",
    isRead: true,
    createdAt: "2026-06-30T09:30:00.000Z",
    targetRoute: ROUTES.ADMIN_REPORTS
  }
];
