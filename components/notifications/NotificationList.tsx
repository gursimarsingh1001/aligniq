"use client";

import { Bell, CheckCheck, Filter } from "lucide-react";
import { useMemo, useState } from "react";

import { NotificationCard } from "@/components/notifications/NotificationCard";
import { Button } from "@/components/ui/button";
import {
  filterNotifications,
  getNotificationFilterCounts
} from "@/lib/services/notification-service";
import type {
  Notification,
  NotificationFilter
} from "@/lib/types/notification";
import { cn } from "@/lib/utils";

type NotificationListProps = {
  notifications: Notification[];
};

const filters: { label: string; value: NotificationFilter }[] = [
  { label: "All", value: "all" },
  { label: "Unread", value: "unread" },
  { label: "Goal events", value: "goal_events" },
  { label: "Check-in events", value: "checkin_events" },
  { label: "Escalations", value: "escalations" }
];

export function NotificationList({ notifications }: NotificationListProps) {
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>("all");
  const [readNotificationIds, setReadNotificationIds] = useState<Set<string>>(
    () => new Set()
  );
  const notificationsWithReadState = useMemo(
    () =>
      notifications.map((notification) =>
        readNotificationIds.has(notification.id)
          ? { ...notification, isRead: true }
          : notification
      ),
    [notifications, readNotificationIds]
  );
  const counts = useMemo(
    () => getNotificationFilterCounts(notificationsWithReadState),
    [notificationsWithReadState]
  );
  const filteredNotifications = useMemo(
    () => filterNotifications(notificationsWithReadState, activeFilter),
    [activeFilter, notificationsWithReadState]
  );

  function handleMarkAsRead(notificationId: string) {
    setReadNotificationIds((currentIds) => {
      const nextIds = new Set(currentIds);
      nextIds.add(notificationId);
      return nextIds;
    });
  }

  function handleMarkAllAsRead() {
    setReadNotificationIds((currentIds) => {
      const nextIds = new Set(currentIds);

      notificationsWithReadState.forEach((notification) => {
        if (!notification.isRead) {
          nextIds.add(notification.id);
        }
      });

      return nextIds;
    });
  }

  return (
    <section className="grid gap-5 lg:grid-cols-[300px_1fr]">
      <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-4 shadow-subtle lg:sticky lg:top-24">
        <div className="flex items-start gap-3 border-b border-slate-200 pb-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
            <Filter className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-semibold text-slate-950">Filter inbox</h2>
            <p className="mt-1 text-sm leading-5 text-slate-500">
              Focus on unread items, approvals, check-ins, or escalations.
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-2">
          {filters.map((filter) => {
            const isActive = activeFilter === filter.value;

            return (
              <button
                type="button"
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={cn(
                  "flex min-h-11 w-full items-center justify-between rounded-2xl border px-3 py-2 text-left text-sm font-medium transition-colors",
                  isActive
                    ? "border-blue-200 bg-blue-50 text-blue-700 shadow-subtle"
                    : "border-transparent bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                )}
              >
                <span>{filter.label}</span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-semibold",
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "bg-slate-100 text-slate-600"
                  )}
                >
                  {counts[filter.value]}
                </span>
              </button>
            );
          })}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-4 w-full rounded-2xl"
          disabled={counts.unread === 0}
          onClick={handleMarkAllAsRead}
        >
          <CheckCheck className="h-4 w-4" aria-hidden="true" />
          Mark all as read
        </Button>
      </aside>

      <div className="min-w-0 rounded-3xl border border-slate-200 bg-white p-4 shadow-subtle sm:p-5">
        <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
              <Bell className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-semibold text-slate-950">
                Notification feed
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {filteredNotifications.length} item
                {filteredNotifications.length === 1 ? "" : "s"} in this view
              </p>
            </div>
          </div>
          <p className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {counts.unread} unread
          </p>
        </div>

        {filteredNotifications.length > 0 ? (
          <div className="mt-4 grid gap-3">
            {filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
              />
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <p className="font-medium text-slate-900">
              No notifications in this view.
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Change the filter to review another workflow category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

