import type { Role } from "@/lib/constants/roles";
import type { AppRoute } from "@/lib/constants/routes";

export type NotificationEventType =
  | "goal_submitted"
  | "goal_approved"
  | "goal_returned"
  | "quarterly_checkin_reminder"
  | "manager_checkin_pending"
  | "escalation_triggered";

export type Notification = {
  id: string;
  title: string;
  message: string;
  recipientRole: Role;
  eventType: NotificationEventType;
  isRead: boolean;
  createdAt: string;
  targetRoute: AppRoute;
};

export type NotificationFilter =
  | "all"
  | "unread"
  | "goal_events"
  | "checkin_events"
  | "escalations";
