"use client";

import {
  Bell,
  ClipboardCheck,
  Target,
  TriangleAlert,
  type LucideIcon
} from "lucide-react";

import { NotificationList } from "@/components/notifications/NotificationList";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useDemoSession } from "@/lib/auth/session";
import {
  getNotificationFilterCounts,
  getNotificationsForRole
} from "@/lib/services/notification-service";
import { ROLE_LABELS, ROLES } from "@/lib/constants/roles";

type NotificationMetricProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  helper: string;
  tone: "blue" | "emerald" | "amber" | "red";
};

const metricToneStyles: Record<NotificationMetricProps["tone"], string> = {
  blue: "bg-blue-50 text-blue-700",
  emerald: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  red: "bg-red-50 text-red-700"
};

function NotificationMetric({
  helper,
  icon: Icon,
  label,
  tone,
  value
}: NotificationMetricProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-subtle">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {label}
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-normal text-slate-950">
            {value}
          </p>
        </div>
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${metricToneStyles[tone]}`}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 text-sm leading-5 text-slate-600">{helper}</p>
    </div>
  );
}

function NotificationsContent() {
  const sessionState = useDemoSession();

  if (sessionState.status === "loading") {
    return (
      <Card>
        <CardContent className="p-5 text-sm text-muted-foreground">
          Loading notifications...
        </CardContent>
      </Card>
    );
  }

  if (sessionState.status !== "authenticated") {
    return null;
  }

  const notifications = getNotificationsForRole(sessionState.session.user.role);
  const counts = getNotificationFilterCounts(notifications);
  const userRole = sessionState.session.user.role;
  const shouldShowEscalationMetric =
    userRole !== ROLES.EMPLOYEE || counts.escalations > 0;
  const escalationMetricHelper =
    userRole === ROLES.ADMIN
      ? "Items requiring HR visibility"
      : userRole === ROLES.MANAGER
        ? "Team items requiring follow-up"
        : "Items requiring follow-up";

  return (
    <div className="w-full space-y-6">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-subtle">
        <div className="relative p-5 sm:p-7">
          <div className="absolute right-8 top-8 h-44 w-44 rounded-full bg-blue-100/70 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-24 w-72 rounded-full bg-slate-100 blur-2xl" />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border-transparent bg-blue-50 text-blue-700">
                  Workflow inbox
                </Badge>
                <Badge className="border-transparent bg-slate-100 text-slate-700">
                  {ROLE_LABELS[userRole]}
                </Badge>
              </div>
              <h1 className="mt-5 text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
                Notifications
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                Review goal approvals, check-in reminders, and escalation alerts
                in one focused workspace.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:w-72">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Inbox state
              </p>
              <div className="mt-3 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <Bell className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-semibold text-slate-950">
                    {counts.unread} unread
                  </p>
                  <p className="text-sm text-slate-500">
                    {counts.all} total alerts
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 border-t border-slate-200 bg-slate-50/70 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-4">
          <NotificationMetric
            icon={Bell}
            label="Unread"
            value={`${counts.unread}`}
            helper="Items needing attention"
            tone={counts.unread > 0 ? "amber" : "emerald"}
          />
          <NotificationMetric
            icon={Target}
            label="Goal events"
            value={`${counts.goal_events}`}
            helper="Submissions, approvals, and returns"
            tone="blue"
          />
          <NotificationMetric
            icon={ClipboardCheck}
            label="Check-ins"
            value={`${counts.checkin_events}`}
            helper="Quarterly progress workflow alerts"
            tone="emerald"
          />
          {shouldShowEscalationMetric ? (
            <NotificationMetric
              icon={TriangleAlert}
              label="Escalations"
              value={`${counts.escalations}`}
              helper={escalationMetricHelper}
              tone={counts.escalations > 0 ? "red" : "blue"}
            />
          ) : null}
        </div>
      </section>

      <NotificationList notifications={notifications} />
    </div>
  );
}

export default function NotificationsPage() {
  return (
    <AppShell>
      <NotificationsContent />
    </AppShell>
  );
}


