"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  FileSpreadsheet,
  Filter,
  RotateCcw,
  TrendingUp
} from "lucide-react";

import { AchievementReportTable } from "@/components/admin/AchievementReportTable";
import { ReportExportButton } from "@/components/admin/ReportExportButton";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  CHECKIN_PROGRESS_STATUS_LABELS,
  CHECKIN_PROGRESS_STATUSES
} from "@/lib/constants/checkin-windows";
import {
  exportReportToCsv,
  getAchievementReportRows
} from "@/lib/services/report-service";
import type { AchievementReportRow } from "@/lib/types/report";
import { cn } from "@/lib/utils";
import { formatPercent } from "@/lib/utils/formatters";
import { getDisplayProgressScore } from "@/lib/utils/progress";

const ALL_FILTER_VALUE = "all";

function getUniqueValues(values: string[]) {
  return Array.from(new Set(values)).sort((first, second) =>
    first.localeCompare(second)
  );
}

function filterRows({
  department,
  quarter,
  rows,
  status
}: {
  department: string;
  quarter: string;
  rows: AchievementReportRow[];
  status: string;
}) {
  return rows
    .filter(
      (row) => department === ALL_FILTER_VALUE || row.departmentName === department
    )
    .filter((row) => quarter === ALL_FILTER_VALUE || row.quarterLabel === quarter)
    .filter((row) => {
      if (status === ALL_FILTER_VALUE) {
        return true;
      }

      if (status === "pending") {
        return row.employeeStatus === "pending";
      }

      return row.employeeStatus === status;
    });
}

function getAverageProgress(rows: AchievementReportRow[]) {
  if (rows.length === 0) {
    return 0;
  }

  const total = rows.reduce(
    (sum, row) => sum + getDisplayProgressScore(row.progressScore),
    0
  );

  return total / rows.length;
}

function MetricCard({
  helper,
  icon: Icon,
  label,
  tone,
  value
}: {
  helper: string;
  icon: typeof BarChart3;
  label: string;
  tone: "blue" | "emerald" | "amber" | "slate";
  value: string | number;
}) {
  const toneStyles = {
    blue: "bg-blue-50 text-blue-700 ring-blue-100",
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    slate: "bg-slate-100 text-slate-700 ring-slate-200"
  } as const;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {label}
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-normal text-slate-950">
            {value}
          </p>
        </div>
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ring-1",
            toneStyles[tone]
          )}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 text-sm leading-5 text-slate-600">{helper}</p>
    </div>
  );
}

function AdminReportsContent() {
  const rows = useMemo(() => getAchievementReportRows(), []);
  const [quarter, setQuarter] = useState(ALL_FILTER_VALUE);
  const [department, setDepartment] = useState(ALL_FILTER_VALUE);
  const [status, setStatus] = useState(ALL_FILTER_VALUE);
  const [highlightedId, setHighlightedId] = useState<string | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    return new URLSearchParams(window.location.search).get("highlight");
  });
  const quarters = useMemo(
    () => getUniqueValues(rows.map((row) => row.quarterLabel)),
    [rows]
  );
  const departments = useMemo(
    () => getUniqueValues(rows.map((row) => row.departmentName)),
    [rows]
  );
  const filteredRows = useMemo(
    () => filterRows({ department, quarter, rows, status }),
    [department, quarter, rows, status]
  );
  const csv = useMemo(() => exportReportToCsv(filteredRows), [filteredRows]);
  const completedRows = filteredRows.filter(
    (row) => row.checkinCompletionStatus === "completed"
  ).length;
  const pendingRows = filteredRows.length - completedRows;
  const sharedRows = filteredRows.filter((row) => row.goalType === "Shared").length;
  const averageProgress = getAverageProgress(filteredRows);
  const selectedFilterCount = [quarter, department, status].filter(
    (value) => value !== ALL_FILTER_VALUE
  ).length;

  useEffect(() => {
    if (!highlightedId) {
      return;
    }

    const scrollTimer = window.setTimeout(() => {
      const target = Array.from(
        document.querySelectorAll<HTMLElement>("[data-report-highlight-id]")
      ).find((element) => element.dataset.reportHighlightId === highlightedId);

      target?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }, 150);

    const clearTimer = window.setTimeout(() => {
      setHighlightedId(null);
    }, 6000);

    return () => {
      window.clearTimeout(scrollTimer);
      window.clearTimeout(clearTimer);
    };
  }, [filteredRows, highlightedId]);

  function resetFilters() {
    setQuarter(ALL_FILTER_VALUE);
    setDepartment(ALL_FILTER_VALUE);
    setStatus(ALL_FILTER_VALUE);
  }

  return (
    <div className="w-full space-y-6">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-subtle">
        <div className="grid xl:grid-cols-[minmax(0,1.3fr)_minmax(360px,0.7fr)]">
          <div className="relative overflow-hidden p-5 sm:p-7">
            <div className="absolute right-8 top-6 h-48 w-48 rounded-full bg-blue-100/70 blur-3xl" />
            <div className="absolute -bottom-12 left-8 h-36 w-80 rounded-full bg-slate-100 blur-2xl" />
            <div className="relative max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border-transparent bg-blue-50 text-blue-700">
                  Admin / HR
                </Badge>
                <Badge className="border-transparent bg-emerald-50 text-emerald-700">
                  Achievement report
                </Badge>
              </div>
              <h1 className="mt-5 text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
                Achievement Report
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                Review planned target versus actual achievement across employees,
                departments, goals, and quarterly check-in status.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <ReportExportButton
                  csv={csv}
                  disabled={filteredRows.length === 0}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetFilters}
                  disabled={selectedFilterCount === 0}
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Reset filters
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 bg-slate-50/70 p-5 sm:p-7 xl:border-l xl:border-t-0">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-subtle">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Export package
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-slate-950">
                    {filteredRows.length} report rows
                  </h2>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <FileSpreadsheet className="h-5 w-5" aria-hidden="true" />
                </span>
              </div>
              <dl className="mt-5 grid gap-3 text-sm">
                <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-3 py-2">
                  <dt className="text-slate-500">Quarter</dt>
                  <dd className="text-right font-medium text-slate-950">
                    {quarter === ALL_FILTER_VALUE ? "All quarters" : quarter}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-3 py-2">
                  <dt className="text-slate-500">Department</dt>
                  <dd className="text-right font-medium text-slate-950">
                    {department === ALL_FILTER_VALUE
                      ? "All departments"
                      : department}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-3 py-2">
                  <dt className="text-slate-500">Progress health</dt>
                  <dd className="text-right font-medium text-slate-950">
                    {formatPercent(averageProgress, 1)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          helper="Rows included in the current report view."
          icon={BarChart3}
          label="Report rows"
          tone="blue"
          value={filteredRows.length}
        />
        <MetricCard
          helper="Rows with quarterly updates recorded."
          icon={CheckCircle2}
          label="Completed updates"
          tone="emerald"
          value={completedRows}
        />
        <MetricCard
          helper="Rows still missing employee update data."
          icon={Filter}
          label="Pending rows"
          tone={pendingRows > 0 ? "amber" : "slate"}
          value={pendingRows}
        />
        <MetricCard
          helper={`${sharedRows} shared goal rows included.`}
          icon={TrendingUp}
          label="Avg progress"
          tone={averageProgress >= 85 ? "emerald" : "blue"}
          value={formatPercent(averageProgress, 1)}
        />
      </section>

      <Card className="border-slate-200 bg-white shadow-subtle">
        <CardHeader className="border-b border-slate-200 bg-slate-50/70 p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="text-xl text-slate-950">
                Report Filters
              </CardTitle>
              <CardDescription className="mt-1">
                Filter by quarter, department, or employee update status.
              </CardDescription>
            </div>
            <Badge variant="outline" className="w-fit bg-white">
              {selectedFilterCount} active
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-5 sm:p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="grid gap-2 text-sm">
              <span className="font-semibold text-slate-950">Quarter</span>
              <select
                className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition focus:border-blue-300 focus:bg-white focus-visible:ring-2 focus-visible:ring-blue-100"
                value={quarter}
                onChange={(event) => setQuarter(event.target.value)}
              >
                <option value={ALL_FILTER_VALUE}>All quarters</option>
                {quarters.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm">
              <span className="font-semibold text-slate-950">Department</span>
              <select
                className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition focus:border-blue-300 focus:bg-white focus-visible:ring-2 focus-visible:ring-blue-100"
                value={department}
                onChange={(event) => setDepartment(event.target.value)}
              >
                <option value={ALL_FILTER_VALUE}>All departments</option>
                {departments.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm">
              <span className="font-semibold text-slate-950">
                Employee Status
              </span>
              <select
                className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition focus:border-blue-300 focus:bg-white focus-visible:ring-2 focus-visible:ring-blue-100"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                <option value={ALL_FILTER_VALUE}>All statuses</option>
                <option value={CHECKIN_PROGRESS_STATUSES.NOT_STARTED}>
                  {CHECKIN_PROGRESS_STATUS_LABELS.not_started}
                </option>
                <option value={CHECKIN_PROGRESS_STATUSES.ON_TRACK}>
                  {CHECKIN_PROGRESS_STATUS_LABELS.on_track}
                </option>
                <option value={CHECKIN_PROGRESS_STATUSES.COMPLETED}>
                  {CHECKIN_PROGRESS_STATUS_LABELS.completed}
                </option>
                <option value="pending">Pending</option>
              </select>
            </label>
          </div>
        </CardContent>
      </Card>

      <AchievementReportTable highlightedId={highlightedId} rows={filteredRows} />
    </div>
  );
}

export default function AdminReportsPage() {
  return (
    <AppShell contentClassName="mx-0 w-full max-w-none py-4">
      <AdminReportsContent />
    </AppShell>
  );
}
