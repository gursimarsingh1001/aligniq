"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { useDemoSession, type DemoSession } from "@/lib/auth/session";
import {
  getAllowedRolesForPath,
  ROLE_DASHBOARD_PATHS,
  ROUTES
} from "@/lib/constants/routes";
import type { Role } from "@/lib/constants/roles";

type RoleGuardProps = {
  allowedRoles?: readonly Role[];
  children: ReactNode | ((session: DemoSession) => ReactNode);
};

function renderChildren(
  children: RoleGuardProps["children"],
  session: DemoSession
) {
  return typeof children === "function" ? children(session) : children;
}

function GuardState({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex items-start gap-3 p-5">
          <Loader2 className="mt-0.5 h-5 w-5 animate-spin text-primary" />
          <div>
            <p className="text-sm font-medium">{title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const sessionState = useDemoSession();
  const routeAllowedRoles = useMemo(
    () => allowedRoles ?? getAllowedRolesForPath(pathname),
    [allowedRoles, pathname]
  );

  const session =
    sessionState.status === "authenticated" ? sessionState.session : null;
  const isForbidden = session
    ? !routeAllowedRoles.includes(session.user.role)
    : false;

  useEffect(() => {
    if (sessionState.status === "unauthenticated") {
      router.replace(ROUTES.LOGIN);
      return;
    }

    if (session && isForbidden) {
      router.replace(ROLE_DASHBOARD_PATHS[session.user.role]);
    }
  }, [isForbidden, router, session, sessionState.status]);

  if (sessionState.status === "loading") {
    return (
      <GuardState
        title="Checking your session"
        description="AlignIQ is confirming the active user."
      />
    );
  }

  if (sessionState.status === "unauthenticated") {
    return (
      <GuardState
        title="Redirecting to login"
        description="Choose a workspace role to continue."
      />
    );
  }

  if (isForbidden) {
    return (
      <GuardState
        title="Redirecting to your dashboard"
        description="This page belongs to another AlignIQ role."
      />
    );
  }

  return <>{renderChildren(children, sessionState.session)}</>;
}
