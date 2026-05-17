"use client";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";

type ReportExportButtonProps = {
  csv: string;
  disabled?: boolean;
  filename?: string;
};

export function ReportExportButton({
  csv,
  disabled = false,
  filename = "aligniq-achievement-report.csv"
}: ReportExportButtonProps) {
  function handleExport() {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <Button type="button" onClick={handleExport} disabled={disabled || !csv}>
      <Download className="h-4 w-4" aria-hidden="true" />
      Export CSV
    </Button>
  );
}
