"use client";

import { useState, type ReactNode } from "react";

import { MobileSidebar } from "@/components/layout/MobileSidebar";
import { RoleGuard } from "@/components/layout/RoleGuard";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import type { DemoSession } from "@/lib/auth/session";
import { cn } from "@/lib/utils";

type AppShellProps = {
  children: ReactNode;
  contentClassName?: string;
  topbarContentClassName?: string;
};

export function AppShell({
  children,
  contentClassName,
  topbarContentClassName
}: AppShellProps) {
  return (
    <RoleGuard>
      {(session) => (
        <ShellContent
          contentClassName={contentClassName}
          session={session}
          topbarContentClassName={topbarContentClassName}
        >
          {children}
        </ShellContent>
      )}
    </RoleGuard>
  );
}

type ShellContentProps = {
  session: DemoSession;
  children: ReactNode;
  contentClassName?: string;
  topbarContentClassName?: string;
};

function ShellContent({
  session,
  children,
  contentClassName,
  topbarContentClassName
}: ShellContentProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] =
    useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <Sidebar
        isCollapsed={isDesktopSidebarCollapsed}
        onToggleCollapse={() =>
          setIsDesktopSidebarCollapsed((isCollapsed) => !isCollapsed)
        }
        role={session.user.role}
      />
      <MobileSidebar
        isOpen={isMobileNavOpen}
        role={session.user.role}
        user={session.user}
        onClose={() => setIsMobileNavOpen(false)}
      />
      <div
        className={cn(
          "min-w-0 transition-[padding] duration-200 lg:pl-64",
          isDesktopSidebarCollapsed && "lg:pl-20"
        )}
      >
        <Topbar
          contentClassName={topbarContentClassName}
          user={session.user}
          onMenuClick={() => setIsMobileNavOpen(true)}
        />
        <main
          className={cn(
            "mx-auto min-w-0 max-w-[1280px] px-4 py-5 sm:px-6 lg:px-8",
            contentClassName
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
