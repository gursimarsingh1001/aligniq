"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  Activity,
  BadgeCheck,
  CheckCircle2,
  Eye,
  EyeOff,
  GitBranch,
  Loader2,
  RefreshCw,
  Scale,
  ShieldCheck
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  DEMO_USERS,
  EVALUATION_ACCOUNTS,
  getDemoRoleLabel
} from "@/lib/auth/demo-users";
import {
  signInWithEvaluationCredentials,
  useDemoSession,
  type EvaluationSignInFailureReason
} from "@/lib/auth/session";
import { BRAND_ASSETS } from "@/lib/constants/assets";
import { ROLE_DASHBOARD_PATHS } from "@/lib/constants/routes";

const signInErrorMessages: Record<EvaluationSignInFailureReason, string> = {
  account_not_found: "Account not found.",
  wrong_password: "Wrong password."
};

const capabilityCards = [
  {
    title: "Clarity",
    description:
      "Give every employee visibility into how daily work supports company objectives.",
    icon: Eye
  },
  {
    title: "Accountability",
    description:
      "Track ownership with transparent goals, approvals, and quarterly check-ins.",
    icon: ShieldCheck
  },
  {
    title: "Momentum",
    description:
      "Keep teams moving forward with timely review cycles and focused follow-ups.",
    icon: Activity
  },
  {
    title: "Scale",
    description:
      "Standardize performance workflows across departments as the organization grows.",
    icon: Scale
  }
];

export function LoginForm() {
  const router = useRouter();
  const sessionState = useDemoSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionState.status === "authenticated") {
      router.replace(ROLE_DASHBOARD_PATHS[sessionState.session.user.role]);
    }
  }, [router, sessionState]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = signInWithEvaluationCredentials({ email, password });

    if (!result.success) {
      setError(signInErrorMessages[result.reason]);
      return;
    }

    setError(null);
    router.replace(ROLE_DASHBOARD_PATHS[result.session.user.role]);
  }

  function fillEvaluationAccount(emailValue: string, passwordValue: string) {
    setEmail(emailValue);
    setPassword(passwordValue);
    setError(null);
  }

  if (sessionState.status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-start gap-3 p-5">
            <Loader2 className="mt-0.5 h-5 w-5 animate-spin text-primary" />
            <div>
              <p className="text-sm font-medium">Checking session</p>
              <p className="mt-1 text-sm text-muted-foreground">
                AlignIQ is preparing the login options.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (DEMO_USERS.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No workspace users configured</CardTitle>
            <CardDescription>
              Add workspace users to enable sign-in.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-950">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Image
            src={BRAND_ASSETS.logoFull.src}
            alt={BRAND_ASSETS.logoFull.alt}
            width={1029}
            height={306}
            className="h-10 w-auto object-contain object-left sm:h-11 lg:h-12"
            priority
          />

          <div className="hidden items-center gap-7 lg:flex">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <BadgeCheck className="h-4 w-4" aria-hidden="true" />
              <span>For HR teams</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              <span>Secure workspace</span>
            </div>
            <span className="text-sm font-medium text-[#2563eb]">
              Need access? Contact HR
            </span>
          </div>
        </div>
      </header>

      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[720px] bg-[radial-gradient(circle_at_22%_18%,rgba(37,99,235,0.12),transparent_30%),radial-gradient(circle_at_78%_48%,rgba(148,163,184,0.16),transparent_32%)]" />

        <section className="relative mx-auto flex min-h-[80vh] w-full max-w-7xl flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-1.5 shadow-sm">
              <span className="mr-2.5 h-2 w-2 rounded-full bg-[#2563eb]" />
              <span className="text-sm font-semibold tracking-normal text-slate-600">
                Enterprise goal alignment
              </span>
            </div>
            <h1 className="text-4xl font-bold leading-[1.08] tracking-normal text-slate-950 sm:text-5xl lg:text-6xl">
              The Performance Alignment Workspace
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Create goals, approve workflows, and track quarterly performance
              across every team.
            </p>
          </div>

          <div
            className="mt-10 grid w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.12)] md:grid-cols-[0.78fr_1fr]"
            id="signin"
          >
            <aside className="relative overflow-hidden border-b border-slate-200 bg-slate-50 p-6 sm:p-8 md:border-b-0 md:border-r lg:p-10">
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(37,99,235,0.10),transparent_42%)]" />
              <div className="relative">
                <div className="mb-8 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-[#2563eb]">
                    <RefreshCw className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-950">
                    AlignIQ Sync
                  </h2>
                </div>

                <div className="grid gap-5">
                  <div className="flex gap-3">
                    <CheckCircle2
                      aria-hidden="true"
                      className="mt-0.5 h-5 w-5 shrink-0 text-[#2563eb]"
                    />
                    <div>
                      <p className="font-medium text-slate-950">
                        Real-time tracking
                      </p>
                      <p className="mt-1 text-sm leading-5 text-slate-500">
                        Monitor performance effortlessly.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <GitBranch
                      aria-hidden="true"
                      className="mt-0.5 h-5 w-5 shrink-0 text-[#2563eb]"
                    />
                    <div>
                      <p className="font-medium text-slate-950">
                        Automated alignment
                      </p>
                      <p className="mt-1 text-sm leading-5 text-slate-500">
                        Connect goals company-wide.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative mt-10 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Quarterly rhythm
                </p>
                <div className="mt-5 h-20">
                  <svg
                    aria-hidden="true"
                    className="h-full w-full overflow-visible"
                    viewBox="0 0 320 88"
                  >
                    <path
                      d="M22 50 L102 26 L198 58 L298 38"
                      fill="none"
                      stroke="#DBEAFE"
                      strokeLinecap="round"
                      strokeWidth="3"
                    />
                    <path
                      d="M22 58 C72 54 92 46 122 28 C156 10 194 18 224 40 C252 60 280 64 298 54"
                      fill="none"
                      stroke="#2563EB"
                      strokeLinecap="round"
                      strokeWidth="3"
                    />
                    {[22, 122, 224, 298].map((x, index) => {
                      const y = [58, 28, 40, 54][index];

                      return (
                        <circle
                          cx={x}
                          cy={y}
                          fill="white"
                          key={`${x}-${y}`}
                          r="5"
                          stroke={index === 0 ? "#2563EB" : "#CBD5E1"}
                          strokeWidth="2"
                        />
                      );
                    })}
                  </svg>
                </div>
                <div className="mt-3 grid grid-cols-4 gap-2 text-center text-[10px] font-medium uppercase tracking-[0.08em] text-slate-400">
                  <span>Goal setting</span>
                  <span>Approval</span>
                  <span>Check-ins</span>
                  <span>Review</span>
                </div>
              </div>
            </aside>

            <section className="bg-white p-6 sm:p-8 lg:p-12">
              <div className="mx-auto w-full max-w-md">
                <div className="mb-8 text-center">
                  <h2 className="text-3xl font-bold tracking-normal text-slate-950">
                    Sign in
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Welcome back to your workspace.
                  </p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label
                      className="text-sm font-semibold text-slate-800"
                      htmlFor="email"
                    >
                      Email address
                    </label>
                    <input
                      autoComplete="email"
                      className="h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-base outline-none transition-colors placeholder:text-slate-400 focus:border-[#2563eb] focus-visible:ring-2 focus-visible:ring-[#2563eb]/20"
                      id="email"
                      onChange={(event) => {
                        setEmail(event.target.value);
                        setError(null);
                      }}
                      placeholder="name@company.com"
                      required
                      type="email"
                      value={email}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      className="text-sm font-semibold text-slate-800"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        autoComplete="current-password"
                        className="h-12 w-full rounded-lg border border-slate-300 bg-white px-4 pr-12 text-base outline-none transition-colors placeholder:text-slate-400 focus:border-[#2563eb] focus-visible:ring-2 focus-visible:ring-[#2563eb]/20"
                        id="password"
                        onChange={(event) => {
                          setPassword(event.target.value);
                          setError(null);
                        }}
                        placeholder="Enter password"
                        required
                        type={showPassword ? "text" : "password"}
                        value={password}
                      />
                      <button
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]/20"
                        onClick={() => setShowPassword((isVisible) => !isVisible)}
                        type="button"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <Eye className="h-4 w-4" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </div>

                  {error ? (
                    <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                      {error}
                    </p>
                  ) : null}

                  <Button
                    className="h-12 w-full rounded-lg bg-[#2563eb] text-base font-semibold shadow-subtle hover:bg-[#1d4ed8]"
                    type="submit"
                  >
                    Sign in to AlignIQ
                  </Button>
                </form>

                <div className="mt-8 border-t border-slate-200 pt-6 text-center" id="evaluation-access">
                  <div className="text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Quick access for evaluation
                    </p>
                  </div>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {EVALUATION_ACCOUNTS.map((account) => (
                      <button
                        className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-[#2563eb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]/20"
                        key={account.email}
                        onClick={() =>
                          fillEvaluationAccount(account.email, account.password)
                        }
                        title={`${account.email} / ${account.password}`}
                        type="button"
                      >
                        {getDemoRoleLabel(account.role)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>

        <section
          className="relative border-t border-slate-200 bg-white py-14 sm:py-16"
          id="capabilities"
        >
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl">
                Empower your entire workforce
              </h2>
              <p className="mt-3 text-base leading-7 text-slate-600">
                The tools you need to build a high-performing, aligned, and
                engaged organization at scale.
              </p>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {capabilityCards.map((card) => {
                const Icon = card.icon;

                return (
                  <article
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-shadow hover:shadow-md"
                    key={card.title}
                  >
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-[#2563eb]">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-950">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {card.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 py-8 text-white">
        <div className="mx-auto flex w-full max-w-7xl justify-center px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-slate-400">
            Performance alignment workspace.
          </p>
        </div>
      </footer>
    </div>
  );
}
