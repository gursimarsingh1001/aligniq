"use client";

import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";

type ManagerCommentBoxProps = {
  comment: string;
  disabled?: boolean;
  error: string | null;
  onChange: (comment: string) => void;
  onSave: () => void;
};

export function ManagerCommentBox({
  comment,
  disabled = false,
  error,
  onChange,
  onSave
}: ManagerCommentBoxProps) {
  return (
    <div className="space-y-3">
      <label className="space-y-2">
        <span className="text-sm font-semibold text-slate-950">
          Structured check-in comment
        </span>
        <textarea
          value={comment}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          rows={4}
          className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-100"
          placeholder="Summarize progress, blockers, support needed, and next-quarter focus."
        />
      </label>
      <p className="text-sm leading-6 text-slate-600">
        Manager comments document the quarterly discussion.
      </p>
      {error ? (
        <p className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm font-medium text-destructive">
          {error}
        </p>
      ) : null}
      <div className="flex justify-end">
        <Button disabled={disabled} onClick={onSave}>
          <Save className="h-4 w-4" aria-hidden="true" />
          Save manager check-in
        </Button>
      </div>
    </div>
  );
}
