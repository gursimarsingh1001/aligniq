"use client";

import { FormEvent, useState } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

type ReturnForReworkDialogProps = {
  employeeName: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (comment: string) => void;
};

export function ReturnForReworkDialog({
  employeeName,
  isOpen,
  onClose,
  onSubmit
}: ReturnForReworkDialogProps) {
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) {
    return null;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!comment.trim()) {
      setError("Return comment is required.");
      return;
    }

    onSubmit(comment.trim());
    setComment("");
    setError(null);
  }

  function handleClose() {
    setComment("");
    setError(null);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/45"
        aria-label="Close return for rework dialog"
        onClick={handleClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="return-dialog-title"
        className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-elevated"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-slate-50/70 p-5">
          <div>
            <h2
              id="return-dialog-title"
              className="text-base font-semibold text-slate-950"
            >
              Return for rework
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Add clear guidance for {employeeName}.
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Close return for rework dialog"
            onClick={handleClose}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>

        <form className="space-y-4 p-5" onSubmit={handleSubmit}>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-950">
              Manager comment
            </span>
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows={4}
              className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="Explain what the employee should revise before resubmitting."
            />
          </label>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Return submission</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

