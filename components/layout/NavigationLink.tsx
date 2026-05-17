"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  CalendarRange,
  CircleCheck,
  ClipboardCheck,
  FileClock,
  LayoutDashboard,
  Share2,
  Sparkles,
  Target,
  TrendingUp,
  TriangleAlert,
  type LucideIcon
} from "lucide-react";

import type {
  NavigationIcon,
  NavigationItem
} from "@/lib/constants/routes";
import { cn } from "@/lib/utils";

const iconMap: Record<NavigationIcon, LucideIcon> = {
  LayoutDashboard,
  Target,
  ClipboardCheck,
  CircleCheck,
  FileClock,
  BarChart3,
  CalendarRange,
  Bell,
  TriangleAlert,
  TrendingUp,
  Share2,
  Sparkles
};

type NavigationLinkProps = {
  isCollapsed?: boolean;
  item: NavigationItem;
  onClick?: () => void;
};

export function NavigationLink({
  isCollapsed = false,
  item,
  onClick
}: NavigationLinkProps) {
  const pathname = usePathname();
  const Icon = iconMap[item.icon];
  const isActive = pathname === item.href;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      aria-label={item.title}
      title={item.title}
      className={cn(
        "group relative flex w-full items-center rounded-xl py-2.5 text-sm font-medium transition-colors",
        isCollapsed ? "justify-center px-2" : "gap-3 px-3",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      )}
    >
      {isActive && !isCollapsed ? (
        <span
          className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-primary"
          aria-hidden="true"
        />
      ) : null}
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span className={cn("truncate", isCollapsed && "sr-only")}>
        {item.title}
      </span>
    </Link>
  );
}
