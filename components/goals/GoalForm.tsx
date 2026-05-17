"use client";

import { FormEvent, useMemo, useState } from "react";
import { Save, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { THRUST_AREAS, type ThrustArea } from "@/lib/constants/thrust-areas";
import {
  ALL_UOM_TYPES,
  requiresTargetDate,
  requiresTargetValue,
  UOM_TYPE_DIRECTION_LABELS,
  UOM_TYPE_LABELS,
  type UomType
} from "@/lib/constants/uom-types";
import {
  goalInputSchema,
  type GoalInput
} from "@/lib/validations/goal";
import { cn } from "@/lib/utils";

type GoalFormValues = {
  id?: string;
  title: string;
  description: string;
  thrustArea: ThrustArea | "";
  uomType: UomType | "";
  targetValue: string;
  targetDate: string;
  weightage: string;
};

type GoalFormProps = {
  initialGoal?: GoalInput;
  onCancel: () => void;
  onSave: (goal: GoalInput) => void;
};

function getInitialFormValues(goal?: GoalInput): GoalFormValues {
  return {
    id: goal?.id,
    title: goal?.title ?? "",
    description: goal?.description ?? "",
    thrustArea: goal?.thrustArea ?? "",
    uomType: goal?.uomType ?? "",
    targetValue: goal?.targetValue ? String(goal.targetValue) : "",
    targetDate: goal?.targetDate ?? "",
    weightage: goal?.weightage ? String(goal.weightage) : "10"
  };
}

function getFieldError(
  errors: Record<string, string>,
  fieldName: keyof GoalFormValues
) {
  return errors[fieldName] ? (
    <p className="text-xs text-destructive">{errors[fieldName]}</p>
  ) : null;
}

export function GoalForm({ initialGoal, onCancel, onSave }: GoalFormProps) {
  const [values, setValues] = useState<GoalFormValues>(() =>
    getInitialFormValues(initialGoal)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const selectedUomType = values.uomType || null;

  const targetLabel = useMemo(() => {
    if (!selectedUomType) {
      return "Target";
    }

    return requiresTargetDate(selectedUomType) ? "Target date" : "Target value";
  }, [selectedUomType]);

  function updateField(fieldName: keyof GoalFormValues, value: string) {
    setValues((currentValues) => ({
      ...currentValues,
      [fieldName]: value
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedGoal = goalInputSchema.safeParse({
      id: values.id,
      title: values.title,
      description: values.description,
      thrustArea: values.thrustArea,
      uomType: values.uomType,
      targetValue: values.targetValue ? Number(values.targetValue) : null,
      targetDate: values.targetDate || null,
      weightage: values.weightage ? Number(values.weightage) : 0
    });

    if (!parsedGoal.success) {
      const nextErrors: Record<string, string> = {};

      for (const issue of parsedGoal.error.issues) {
        const fieldName = String(issue.path[0] ?? "form");
        nextErrors[fieldName] = issue.message;
      }

      setErrors(nextErrors);
      return;
    }

    setErrors({});
    onSave(parsedGoal.data);
  }

  return (
    <Card className="border-slate-200 bg-white shadow-elevated">
      <CardHeader className="p-5 sm:p-6">
        <CardTitle className="text-xl text-slate-950">
          {initialGoal?.id ? "Edit goal" : "Add goal"}
        </CardTitle>
        <CardDescription>
          Define a measurable outcome, target, and weightage for the active cycle.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 lg:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">
                Thrust Area
              </span>
              <select
                value={values.thrustArea}
                onChange={(event) => updateField("thrustArea", event.target.value)}
                className={cn(
                  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
                  errors.thrustArea && "border-destructive"
                )}
              >
                <option value="">Select thrust area</option>
                {THRUST_AREAS.map((thrustArea) => (
                  <option value={thrustArea} key={thrustArea}>
                    {thrustArea}
                  </option>
                ))}
              </select>
              {getFieldError(errors, "thrustArea")}
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">
                Measurement
              </span>
              <select
                value={values.uomType}
                onChange={(event) => updateField("uomType", event.target.value)}
                className={cn(
                  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
                  errors.uomType && "border-destructive"
                )}
              >
                <option value="">Select measurement</option>
                {ALL_UOM_TYPES.map((uomType) => (
                  <option value={uomType} key={uomType}>
                    {UOM_TYPE_LABELS[uomType]}
                  </option>
                ))}
              </select>
              {selectedUomType ? (
                <p className="text-xs text-muted-foreground">
                  Scoring rule: {UOM_TYPE_DIRECTION_LABELS[selectedUomType]}
                </p>
              ) : null}
              {getFieldError(errors, "uomType")}
            </label>
          </div>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">
              Goal Title
            </span>
            <input
              value={values.title}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="Example: Improve dashboard performance"
              className={cn(
                "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
                errors.title && "border-destructive"
              )}
            />
            {getFieldError(errors, "title")}
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">
              Goal Description
            </span>
            <textarea
              value={values.description}
              onChange={(event) => updateField("description", event.target.value)}
              rows={3}
              placeholder="Add enough context for your manager to review the outcome."
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </label>

          <div className="grid gap-4 lg:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">
                {targetLabel}
              </span>
              {selectedUomType && requiresTargetDate(selectedUomType) ? (
                <input
                  type="date"
                  value={values.targetDate}
                  onChange={(event) => updateField("targetDate", event.target.value)}
                  className={cn(
                    "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
                    errors.targetDate && "border-destructive"
                  )}
                />
              ) : (
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={values.targetValue}
                  disabled={
                    selectedUomType === null || !requiresTargetValue(selectedUomType)
                  }
                  onChange={(event) => updateField("targetValue", event.target.value)}
                  placeholder={
                    selectedUomType ? "Enter target value" : "Select measurement first"
                  }
                  className={cn(
                    "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-100",
                    errors.targetValue && "border-destructive"
                  )}
                />
              )}
              {getFieldError(errors, "targetValue")}
              {getFieldError(errors, "targetDate")}
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">
                Weightage
              </span>
              <input
                type="number"
                min="10"
                max="100"
                step="1"
                value={values.weightage}
                onChange={(event) => updateField("weightage", event.target.value)}
                className={cn(
                  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
                  errors.weightage && "border-destructive"
                )}
              />
              <p className="text-xs text-slate-500">
                Each goal must have at least 10% weightage.
              </p>
              {getFieldError(errors, "weightage")}
            </label>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="h-4 w-4" aria-hidden="true" />
              Cancel
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4" aria-hidden="true" />
              Save goal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
