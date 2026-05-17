import Link from "next/link";
import {
  BellRing,
  CheckCircle2,
  ClipboardCheck,
  RotateCcw,
  Send,
  Target,
  TriangleAlert,
  type LucideIcon
} from "lucide-react";

import { NotificationStatusBadge } from "@/components/notifications/NotificationStatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ROLE_LABELS } from "@/lib/constants/roles";
import { NOTIFICATION_EVENT_LABELS } from "@/lib/services/notification-service";
import type {
  Notification,
  NotificationEventType
} from "@/lib/types/notification";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils/formatters";

type NotificationCardProps = {
  notification: Notification;
  onMarkAsRead?: (notificationId: string) => void;
};

type EventPresentation = {
  icon: LucideIcon;
  iconClassName: string;
  badgeClassName: string;
};

const eventPresentation: Record<NotificationEventType, EventPresentation> = {
  escalation_triggered: {
    badgeClassName: "bg-red-50 text-red-700",
    icon: TriangleAlert,
    iconClassName: "bg-red-50 text-red-700"
  },
  goal_approved: {
    badgeClassName: "bg-emerald-50 text-emerald-700",
    icon: CheckCircle2,
    iconClassName: "bg-emerald-50 text-emerald-700"
  },
  goal_returned: {
    badgeClassName: "bg-amber-50 text-amber-700",
    icon: RotateCcw,
    iconClassName: "bg-amber-50 text-amber-700"
  },
  goal_submitted: {
    badgeClassName: "bg-blue-50 text-blue-700",
    icon: Send,
    iconClassName: "bg-blue-50 text-blue-700"
  },
  manager_checkin_pending: {
    badgeClassName: "bg-violet-50 text-violet-700",
    icon: ClipboardCheck,
    iconClassName: "bg-violet-50 text-violet-700"
  },
  quarterly_checkin_reminder: {
    badgeClassName: "bg-cyan-50 text-cyan-700",
    icon: BellRing,
    iconClassName: "bg-cyan-50 text-cyan-700"
  }
};

export function NotificationCard({
  notification,
  onMarkAsRead
}: NotificationCardProps) {
  const presentation = eventPresentation[notification.eventType];
  const EventIcon = presentation.icon;

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-subtle transition-colors",
        !notification.isRead && "border-blue-200 bg-blue-50/30",
        notification.isRead && "bg-slate-50/70"
      )}
    >
      {!notification.isRead ? (
        <span className="absolute inset-y-4 left-0 w-1 rounded-r-full bg-blue-600" />
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
            presentation.iconClassName
          )}
        >
          <EventIcon className="h-5 w-5" aria-hidden="true" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <NotificationStatusBadge isRead={notification.isRead} />
            <Badge
              variant="outline"
              className={cn("border-transparent", presentation.badgeClassName)}
            >
              {NOTIFICATION_EVENT_LABELS[notification.eventType]}
            </Badge>
            <span className="text-xs font-medium text-slate-500">
              {formatDate(notification.createdAt)}
            </span>
          </div>

          <div className="mt-3">
            <p className="font-semibold leading-6 text-slate-950">
              {notification.title}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {notification.message}
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <Target className="h-4 w-4 text-slate-400" aria-hidden="true" />
              <span>{ROLE_LABELS[notification.recipientRole]}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {!notification.isRead ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                  onClick={() => onMarkAsRead?.(notification.id)}
                >
                  Mark as read
                </Button>
              ) : null}
              <Button asChild variant="outline" size="sm" className="rounded-xl">
                <Link href={notification.targetRoute}>View details</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

