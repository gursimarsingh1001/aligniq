"use client";

import { FormEvent, useMemo, useState } from "react";
import { Plus, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/UserAvatar";
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
import type { AlignIQUser, Department } from "@/lib/types/user";
import type { SharedGoalCreateInput } from "@/lib/types/shared-goal";
import { cn } from "@/lib/utils";
import { sharedGoalInputSchema } from "@/lib/validations/shared-goal";

type SharedGoalFormProps = {
  departments: Department[];
  employees: AlignIQUser[];
  onCreate: (input: SharedGoalCreateInput) => void;
};

type SharedGoalFormValues = {
  assignedEmployeeIds: string[];
  departmentId: string;
  description: string;
  primaryOwnerId: string;
  targetDate: string;
  targetValue: string;
  thrustArea: ThrustArea | "";
  title: string;
  uomType: UomType | "";
};

const initialValues: SharedGoalFormValues = {
  assignedEmployeeIds: [],
  departmentId: "",
  description: "",
  primaryOwnerId: "",
  targetDate: "",
  targetValue: "",
  thrustArea: "",
  title: "",
  uomType: ""
};

function getFieldError(
  errors: Record<string, string>,
  fieldName: keyof SharedGoalFormValues
) {
  return errors[fieldName] ? (
    <p className="text-xs text-destructive">{errors[fieldName]}</p>
  ) : null;
}

export function SharedGoalForm({
  departments,
  employees,
  onCreate
}: SharedGoalFormProps) {
  const [values, setValues] = useState<SharedGoalFormValues>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const selectedUomType = values.uomType || null;
  const targetLabel = useMemo(() => {
    if (!selectedUomType) {
      return "Target";
    }

    return requiresTargetDate(selectedUomType) ? "Target date" : "Target value";
  }, [selectedUomType]);
  const assignedEmployees = employees.filter((employee) =>
    values.assignedEmployeeIds.includes(employee.id)
  );

  function updateField<K extends keyof SharedGoalFormValues>(
    fieldName: K,
    value: SharedGoalFormValues[K]
  ) {
    setValues((currentValues) => ({
      ...currentValues,
      [fieldName]: value
    }));
  }

  function toggleEmployee(employeeId: string) {
    setValues((currentValues) => {
      const assignedEmployeeIds = currentValues.assignedEmployeeIds.includes(employeeId)
        ? currentValues.assignedEmployeeIds.filter((id) => id !== employeeId)
        : [...currentValues.assignedEmployeeIds, employeeId];

      return {
        ...currentValues,
        assignedEmployeeIds,
        primaryOwnerId: assignedEmployeeIds.includes(currentValues.primaryOwnerId)
          ? currentValues.primaryOwnerId
          : ""
      };
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedGoal = sharedGoalInputSchema.safeParse({
      title: values.title,
      description: values.description,
      departmentId: values.departmentId,
      thrustArea: values.thrustArea,
      uomType: values.uomType,
      targetValue: values.targetValue ? Number(values.targetValue) : null,
      targetDate: values.targetDate || null,
      primaryOwnerId: values.primaryOwnerId,
      assignedEmployeeIds: values.assignedEmployeeIds
    });

    if (!parsedGoal.success) {
      const nextErrors: Record<string, string> = {};

      for (const issue of parsedGoal.error.issues) {
        nextErrors[String(issue.path[0] ?? "form")] = issue.message;
      }

      setErrors(nextErrors);
      return;
    }

    setErrors({});
    onCreate({
      ...parsedGoal.data,
      targetValue: parsedGoal.data.targetValue ?? null,
      targetDate: parsedGoal.data.targetDate ?? null
    });
    setValues(initialValues);
  }

  return (
    <Card className="border-slate-200 bg-white shadow-subtle xl:sticky xl:top-4">
      <CardHeader className="border-b border-slate-200 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-xl tracking-normal text-slate-950">
              Create shared goal
            </CardTitle>
            <CardDescription className="mt-2 leading-6 text-slate-600">
              Push a departmental KPI to linked employee goal sheets. Recipients
              can adjust weightage only.
            </CardDescription>
          </div>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
            <Plus className="h-5 w-5" aria-hidden="true" />
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 lg:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-800">
                Goal title
              </span>
              <input
                value={values.title}
                onChange={(event) => updateField("title", event.target.value)}
                placeholder="Example: Improve customer resolution turnaround"
                className={cn(
                  "h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
                  errors.title && "border-destructive"
                )}
              />
              {getFieldError(errors, "title")}
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-800">
                Department
              </span>
              <select
                value={values.departmentId}
                onChange={(event) => updateField("departmentId", event.target.value)}
                className={cn(
                  "h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
                  errors.departmentId && "border-destructive"
                )}
              >
                <option value="">Select department</option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>
              {getFieldError(errors, "departmentId")}
            </label>
          </div>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-800">Description</span>
            <textarea
              rows={3}
              value={values.description}
              onChange={(event) => updateField("description", event.target.value)}
              className={cn(
                "w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
                errors.description && "border-destructive"
              )}
              placeholder="Describe the shared KPI and expected outcome."
            />
            {getFieldError(errors, "description")}
          </label>

          <div className="grid gap-4 lg:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-800">
                Thrust Area
              </span>
              <select
                value={values.thrustArea}
                onChange={(event) => updateField("thrustArea", event.target.value as ThrustArea)}
                className={cn(
                  "h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
                  errors.thrustArea && "border-destructive"
                )}
              >
                <option value="">Select thrust area</option>
                {THRUST_AREAS.map((thrustArea) => (
                  <option key={thrustArea} value={thrustArea}>
                    {thrustArea}
                  </option>
                ))}
              </select>
              {getFieldError(errors, "thrustArea")}
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-800">
                Measurement
              </span>
              <select
                value={values.uomType}
                onChange={(event) => updateField("uomType", event.target.value as UomType)}
                className={cn(
                  "h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
                  errors.uomType && "border-destructive"
                )}
              >
                <option value="">Select measurement</option>
                {ALL_UOM_TYPES.map((uomType) => (
                  <option key={uomType} value={uomType}>
                    {UOM_TYPE_LABELS[uomType]}
                  </option>
                ))}
              </select>
              {selectedUomType ? (
                <p className="text-xs text-slate-500">
                  Scoring rule: {UOM_TYPE_DIRECTION_LABELS[selectedUomType]}
                </p>
              ) : null}
              {getFieldError(errors, "uomType")}
            </label>
          </div>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-800">
              {targetLabel}
            </span>
            {selectedUomType && requiresTargetDate(selectedUomType) ? (
              <input
                type="date"
                value={values.targetDate}
                onChange={(event) => updateField("targetDate", event.target.value)}
                className={cn(
                  "h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
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
                  "h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500",
                  errors.targetValue && "border-destructive"
                )}
              />
            )}
            {getFieldError(errors, "targetValue")}
            {getFieldError(errors, "targetDate")}
          </label>

          <section className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-950">
                  Assignment setup
                </h3>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Select linked employees, then choose one primary owner.
                </p>
              </div>
              <Badge className="border-transparent bg-blue-50 text-blue-700">
                {assignedEmployees.length} selected
              </Badge>
            </div>

            <fieldset className="space-y-2">
              <legend className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Assigned employees
              </legend>
              <div className="grid max-h-64 gap-2 overflow-y-auto pr-1">
                {employees.map((employee) => (
                  <label
                    key={employee.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-sm transition hover:border-blue-200 hover:bg-blue-50/40",
                      values.assignedEmployeeIds.includes(employee.id) &&
                        "border-blue-200 bg-blue-50/70"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={values.assignedEmployeeIds.includes(employee.id)}
                      onChange={() => toggleEmployee(employee.id)}
                      className="h-4 w-4 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <UserAvatar
                      name={employee.name}
                      role={employee.role}
                      size={34}
                      userId={employee.id}
                      className="h-[34px] w-[34px]"
                    />
                    <span className="min-w-0">
                      <span className="block break-words font-semibold text-slate-950">
                        {employee.name}
                      </span>
                      <span className="mt-0.5 block break-words text-xs text-slate-500">
                        {employee.title}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
              {getFieldError(errors, "assignedEmployeeIds")}
            </fieldset>

            <label className="block space-y-2 rounded-2xl border border-slate-200 bg-white p-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Primary owner
              </span>
              <select
                value={values.primaryOwnerId}
                onChange={(event) =>
                  updateField("primaryOwnerId", event.target.value)
                }
                className={cn(
                  "h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
                  assignedEmployees.length === 0 &&
                    "cursor-not-allowed bg-slate-100 text-slate-500",
                  errors.primaryOwnerId && "border-destructive"
                )}
                disabled={assignedEmployees.length === 0}
              >
                <option value="">
                  {assignedEmployees.length > 0
                    ? "Select primary owner"
                    : "Select employees first"}
                </option>
                {employees
                  .filter((employee) =>
                    values.assignedEmployeeIds.includes(employee.id)
                  )
                  .map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name}
                    </option>
                  ))}
              </select>
              <p className="text-xs leading-5 text-slate-500">
                Primary owner achievement syncs to linked goal sheets.
              </p>
              {getFieldError(errors, "primaryOwnerId")}
            </label>
          </section>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="border-slate-200 bg-white"
              onClick={() => setValues(initialValues)}
            >
              <X className="h-4 w-4" aria-hidden="true" />
              Clear
            </Button>
            <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Create shared goal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
