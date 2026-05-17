"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { X } from "lucide-react";

import { NavigationLink } from "@/components/layout/NavigationLink";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/UserAvatar";
import type { DemoUser } from "@/lib/auth/demo-users";
import { BRAND_ASSETS } from "@/lib/constants/assets";
import { ROLE_LABELS, type Role } from "@/lib/constants/roles";
import { NAVIGATION_BY_ROLE, ROLE_DASHBOARD_PATHS } from "@/lib/constants/routes";

type MobileSidebarProps = {
  isOpen: boolean;
  role: Role;
  user: DemoUser;
  onClose: () => void;
};

export function MobileSidebar({
  isOpen,
  role,
  user,
  onClose
}: MobileSidebarProps) {
  const navigationItems = NAVIGATION_BY_ROLE[role];
  const dashboardPath = ROLE_DASHBOARD_PATHS[role];

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/45"
        aria-label="Close navigation menu"
        onClick={onClose}
      />

      <aside
        className="absolute inset-y-0 left-0 flex w-[min(20rem,calc(100vw-2rem))] max-w-full flex-col border-r bg-card shadow-elevated"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="border-b bg-white/80 px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <Link
                href={dashboardPath}
                className="flex min-w-0 items-center gap-3 rounded-2xl p-1 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                aria-label="Go to dashboard"
                onClick={onClose}
              >
                <Image
                  src={BRAND_ASSETS.logoMark.src}
                  alt={BRAND_ASSETS.logoMark.alt}
                  width={40}
                  height={40}
                  className="h-11 w-11 shrink-0 rounded-2xl object-contain shadow-subtle ring-1 ring-slate-200/70"
                />
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-semibold leading-5 text-slate-950">
                    AlignIQ
                  </p>
                  <p className="max-w-36 text-[11px] leading-4 text-slate-500">
                    Performance alignment workspace
                  </p>
                </div>
              </Link>
              <Badge
                className="mt-3 border-transparent bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700"
                variant="secondary"
              >
                {ROLE_LABELS[role]}
              </Badge>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0 rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm hover:bg-slate-50 hover:text-slate-950"
              aria-label="Close navigation menu"
              onClick={onClose}
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </Button>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Primary">
          {navigationItems.length > 0 ? (
            navigationItems.map((item) => (
              <NavigationLink item={item} key={item.href} onClick={onClose} />
            ))
          ) : (
            <p className="px-3 py-2 text-sm text-muted-foreground">
              No navigation items configured.
            </p>
          )}
        </nav>

        <div className="border-t px-4 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <UserAvatar
              name={user.name}
              role={user.role}
              size={40}
              userId={user.id}
              className="h-10 w-10 shrink-0 rounded-full border border-border object-cover ring-2 ring-background"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

