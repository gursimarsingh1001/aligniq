"use client";

import Link from "next/link";
import Image from "next/image";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { NavigationLink } from "@/components/layout/NavigationLink";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BRAND_ASSETS } from "@/lib/constants/assets";
import { ROLE_LABELS, type Role } from "@/lib/constants/roles";
import { NAVIGATION_BY_ROLE, ROLE_DASHBOARD_PATHS } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";

type SidebarProps = {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  role: Role;
};

export function Sidebar({ isCollapsed, onToggleCollapse, role }: SidebarProps) {
  const navigationItems = NAVIGATION_BY_ROLE[role];
  const dashboardPath = ROLE_DASHBOARD_PATHS[role];
  const CollapseIcon = isCollapsed ? PanelLeftOpen : PanelLeftClose;

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 hidden border-r bg-card shadow-subtle transition-[width] duration-200 lg:flex lg:flex-col",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div
        className={cn(
          "border-b bg-white/80 py-4",
          isCollapsed ? "px-3" : "px-4"
        )}
      >
        <div
          className={cn(
            "flex",
            isCollapsed
              ? "flex-col items-center gap-3"
              : "items-center justify-between gap-3"
          )}
        >
          <Link
            href={dashboardPath}
            className={cn(
              "group flex min-w-0 rounded-2xl transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
              isCollapsed
                ? "h-12 w-12 items-center justify-center"
                : "-ml-1 flex-1 items-center gap-3 p-1 hover:bg-slate-50"
            )}
            aria-label="Go to dashboard"
            title="Go to dashboard"
          >
            <Image
              src={BRAND_ASSETS.logoMark.src}
              alt={BRAND_ASSETS.logoMark.alt}
              width={40}
              height={40}
              className={cn(
                "shrink-0 rounded-2xl object-contain shadow-subtle ring-1 ring-slate-200/70",
                isCollapsed ? "h-11 w-11" : "h-11 w-11"
              )}
            />
            <div className={cn("min-w-0", isCollapsed && "sr-only")}>
              <p className="truncate text-[15px] font-semibold leading-5 text-slate-950">
                AlignIQ
              </p>
              <p className="max-w-32 text-[11px] leading-4 text-slate-500">
                Performance alignment workspace
              </p>
            </div>
          </Link>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              "shrink-0 rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm hover:bg-slate-50 hover:text-slate-950",
              isCollapsed ? "h-9 w-9" : "h-8 w-8"
            )}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={onToggleCollapse}
          >
            <CollapseIcon className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
        {!isCollapsed ? (
          <Badge
            className="mt-4 border-transparent bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700"
            variant="secondary"
          >
            {ROLE_LABELS[role]}
          </Badge>
        ) : null}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Primary">
        {navigationItems.length > 0 ? (
          navigationItems.map((item) => (
            <NavigationLink
              isCollapsed={isCollapsed}
              item={item}
              key={item.href}
            />
          ))
        ) : (
          <p className="px-3 py-2 text-sm text-muted-foreground">
            No navigation items configured.
          </p>
        )}
      </nav>

      {!isCollapsed ? (
        <div className="border-t px-4 py-4 text-xs text-muted-foreground">
          AlignIQ workspace
        </div>
      ) : null}
    </aside>
  );
}

