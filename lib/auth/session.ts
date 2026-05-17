"use client";

import { useEffect, useState } from "react";

import {
  getDemoUserByEmail,
  getEvaluationAccountByEmail,
  isValidEvaluationPassword,
  type DemoUser,
  type EvaluationCredentials
} from "@/lib/auth/demo-users";

const DEMO_SESSION_STORAGE_KEY = "aligniq.session.v1";
const LEGACY_SESSION_STORAGE_KEY = "goalsync-ai.demo-session.v1";
const DEMO_SESSION_EVENT = "aligniq.session.changed";

export type DemoSession = {
  user: DemoUser;
  createdAt: string;
};

export type DemoSessionState =
  | {
      status: "loading";
      session: null;
    }
  | {
      status: "authenticated";
      session: DemoSession;
    }
  | {
      status: "unauthenticated";
      session: null;
    };

export type EvaluationSignInFailureReason =
  | "account_not_found"
  | "wrong_password";

export type EvaluationSignInResult =
  | {
      success: true;
      session: DemoSession;
    }
  | {
      success: false;
      reason: EvaluationSignInFailureReason;
    };

function canUseLocalStorage() {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return typeof window.localStorage !== "undefined";
  } catch {
    return false;
  }
}

function emitSessionChange() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(DEMO_SESSION_EVENT));
}

function normalizeSession(value: unknown): DemoSession | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const maybeSession = value as Partial<DemoSession>;
  const email = maybeSession.user?.email;

  if (!email || typeof email !== "string") {
    return null;
  }

  const user = getDemoUserByEmail(email);

  if (!user) {
    return null;
  }

  return {
    user,
    createdAt:
      typeof maybeSession.createdAt === "string"
        ? maybeSession.createdAt
        : new Date().toISOString()
  };
}

export function readDemoSession(): DemoSession | null {
  if (!canUseLocalStorage()) {
    return null;
  }

  const rawSession =
    window.localStorage.getItem(DEMO_SESSION_STORAGE_KEY) ??
    window.localStorage.getItem(LEGACY_SESSION_STORAGE_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    const session = normalizeSession(JSON.parse(rawSession));

    if (!session) {
      clearDemoSession();
    }

    return session;
  } catch {
    clearDemoSession();
    return null;
  }
}

export function createDemoSession(user: DemoUser): DemoSession {
  const session = {
    user,
    createdAt: new Date().toISOString()
  };

  if (canUseLocalStorage()) {
    window.localStorage.setItem(DEMO_SESSION_STORAGE_KEY, JSON.stringify(session));
    window.localStorage.removeItem(LEGACY_SESSION_STORAGE_KEY);
    emitSessionChange();
  }

  return session;
}

export function signInWithEvaluationCredentials({
  email,
  password
}: EvaluationCredentials): EvaluationSignInResult {
  const account = getEvaluationAccountByEmail(email);

  if (!account) {
    return {
      success: false,
      reason: "account_not_found"
    };
  }

  if (!isValidEvaluationPassword(password)) {
    return {
      success: false,
      reason: "wrong_password"
    };
  }

  const user = getDemoUserByEmail(account.email);

  if (!user) {
    return {
      success: false,
      reason: "account_not_found"
    };
  }

  return {
    success: true,
    session: createDemoSession(user)
  };
}

export function clearDemoSession() {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.removeItem(DEMO_SESSION_STORAGE_KEY);
  window.localStorage.removeItem(LEGACY_SESSION_STORAGE_KEY);
  emitSessionChange();
}

export function useDemoSession(): DemoSessionState {
  const [state, setState] = useState<DemoSessionState>({
    status: "loading",
    session: null
  });

  useEffect(() => {
    function syncSession() {
      const session = readDemoSession();

      setState(
        session
          ? {
              status: "authenticated",
              session
            }
          : {
              status: "unauthenticated",
              session: null
            }
      );
    }

    syncSession();

    window.addEventListener("storage", syncSession);
    window.addEventListener(DEMO_SESSION_EVENT, syncSession);

    return () => {
      window.removeEventListener("storage", syncSession);
      window.removeEventListener(DEMO_SESSION_EVENT, syncSession);
    };
  }, []);

  return state;
}
