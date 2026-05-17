import { mockNotifications } from "@/lib/data/mock-notifications";
import type { Role } from "@/lib/constants/roles";
import type {
  Notification,
  NotificationEventType,
  NotificationFilter
} from "@/lib/types/notification";

export const NOTIFICATION_EVENT_LABELS: Record<NotificationEventType, string> = {
  escalation_triggered: "Escalation",
  goal_approved: "Goal Approved",
  goal_returned: "Goal Returned",
  goal_submitted: "Goal Submitted",
  manager_checkin_pending: "Manager Check-in",
  quarterly_checkin_reminder: "Check-in Reminder"
};

function isGoalEvent(notification: Notification) {
  return [
    "goal_approved",
    "goal_returned",
    "goal_submitted"
  ].includes(notification.eventType);
}

function isCheckinEvent(notification: Notification) {
  return [
    "manager_checkin_pending",
    "quarterly_checkin_reminder"
  ].includes(notification.eventType);
}

export function getNotificationsForRole(role: Role) {
  return mockNotifications
    .filter((notification) => notification.recipientRole === role)
    .sort(
      (first, second) =>
        new Date(second.createdAt).getTime() -
        new Date(first.createdAt).getTime()
    );
}

export function filterNotifications(
  notifications: Notification[],
  filter: NotificationFilter
) {
  if (filter === "unread") {
    return notifications.filter((notification) => !notification.isRead);
  }

  if (filter === "goal_events") {
    return notifications.filter(isGoalEvent);
  }

  if (filter === "checkin_events") {
    return notifications.filter(isCheckinEvent);
  }

  if (filter === "escalations") {
    return notifications.filter(
      (notification) => notification.eventType === "escalation_triggered"
    );
  }

  return notifications;
}

export function getNotificationFilterCounts(notifications: Notification[]) {
  return {
    all: notifications.length,
    unread: notifications.filter((notification) => !notification.isRead).length,
    goal_events: notifications.filter(isGoalEvent).length,
    checkin_events: notifications.filter(isCheckinEvent).length,
    escalations: notifications.filter(
      (notification) => notification.eventType === "escalation_triggered"
    ).length
  } satisfies Record<NotificationFilter, number>;
}
