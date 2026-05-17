"use client";

import { LogOut, Menu } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { clearDemoSession } from "@/lib/auth/session";
import type { DemoUser } from "@/lib/auth/demo-users";
import { ROLE_LABELS } from "@/lib/constants/roles";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";

type TopbarProps = {
  user: DemoUser;
  onMenuClick: () => void;
  contentClassName?: string;
};

export function Topbar({ contentClassName, user, onMenuClick }: TopbarProps) {
  const router = useRouter();

  function handleLogout() {
    clearDemoSession();
    router.replace(ROUTES.LOGIN);
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div
        className={cn(
          "flex min-h-14 w-full min-w-0 items-center justify-between gap-3 px-3 sm:px-6 lg:px-8",
          contentClassName
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-10 w-10 shrink-0 rounded-xl border border-transparent text-muted-foreground hover:bg-secondary hover:text-foreground lg:hidden"
            aria-label="Open navigation menu"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </Button>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-950">
              {ROLE_LABELS[user.role]} workspace
            </p>
            <p className="truncate text-xs text-slate-500">{user.department}</p>
          </div>
        </div>

        <div className="flex min-w-0 shrink-0 items-center justify-end gap-2 sm:gap-3">
          <div className="hidden max-w-[15rem] items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1 shadow-subtle sm:flex">
            <UserAvatar
              name={user.name}
              role={user.role}
              size={32}
              userId={user.id}
              className="h-8 w-8 ring-slate-200"
            />
            <div className="min-w-0 pr-1 text-right">
              <p className="truncate text-sm font-semibold text-slate-950">
                {user.name}
              </p>
              <p className="truncate text-xs text-slate-500">{user.email}</p>
            </div>
          </div>
          <UserAvatar
            name={user.name}
            role={user.role}
            size={34}
            userId={user.id}
            className="h-[34px] w-[34px] ring-slate-200 sm:hidden"
          />
          <Button
            variant="outline"
            size="sm"
            className="h-9 shrink-0 rounded-xl border-slate-200 bg-white px-3 shadow-subtle"
            aria-label="Logout"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            <span className="hidden md:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
