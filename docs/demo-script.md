# Judge Walkthrough Script

This script is designed for a 5-7 minute evaluation walkthrough.

## 1. Employee Login

Sign in as:

- Email: `employee@aligniq.local`
- Password: `AlignIQ@123`

Show the Employee dashboard and explain that the employee can manage goals, shared goals, check-ins, notifications, and assistant support.

## 2. Employee Goal Creation

Open `Employee > Goals`.

Show:

- Goal list
- Add/edit goal form
- Weightage summary
- Validation rules

Explain the BRD rules:

- Maximum 8 goals
- Minimum 10% per goal
- Total weightage must equal exactly 100% before submission

## 3. Shared Goal Behavior

On the same Goals page, show assigned shared goals.

Point out:

- Shared badge
- Read-only title, description, measurement, and target
- Weightage-only recipient adjustment
- Shared goals count toward total weightage

## 4. Submit Goals

Submit goals once the weightage is valid.

Show that the submission state changes and the manager approval workflow is now relevant.

## 5. Manager Login

Sign out and sign in as:

- Email: `manager@aligniq.local`
- Password: `AlignIQ@123`

Open `Manager > Approvals`.

Show:

- Pending approval queue
- Selected employee submission
- Editable target and weightage
- Weightage summary
- Approve and return-for-rework actions

Explain that approval locks goals for the employee, while return for rework allows edits again.

## 6. Approved and Locked Goals

Sign back in as the Employee.

Open `Employee > Goals` and show that approved goals are locked and cannot be edited like draft goals.

## 7. Employee Quarterly Check-in

Open `Employee > Check-ins`.

Show:

- Active quarter badge
- Quarterly window selector
- Read-only inactive quarters
- Actual achievement input
- Timeline goals using completion date as actual achievement
- Progress score display capped at 100%

Save quarterly updates.

## 8. Manager Check-in Comment

Sign in as Manager and open `Manager > Check-ins`.

Show:

- Team member queue
- Planned vs actual table
- Progress score status
- Required manager comment box

Save a manager check-in comment.

## 9. Admin / HR Login

Sign in as:

- Email: `admin@aligniq.local`
- Password: `AlignIQ@123`

Open `Admin > Dashboard`.

Show high-level completion and governance metrics.

## 10. Reports and CSV Export

Open `Admin > Reports`.

Show:

- Achievement report rows
- Planned target vs actual achievement
- Quarter, department, and status filters
- CSV export button

Explain that export produces `aligniq-achievement-report.csv`.

## 11. Audit Logs and Cycles

Open:

- `Admin > Audit Logs`
- `Admin > Cycles`

Show governance trail, active cycle, active window, and quarter statuses.

## 12. Analytics Heatmap

Open `Admin > Analytics`.

Show:

- Metric cards
- Trend and distribution charts
- Department x Quarter completion heatmap
- At-risk goals table

## 13. Escalations and Notifications

Open:

- `Admin > Escalations`
- `Notifications`

Show:

- Rule-based escalation cards
- Escalation log with View details deep links
- Notification filters
- Mark as read and mark all as read actions

## 14. AlignIQ Assistant

Open `AlignIQ Assistant`.

Show role-based tabs:

- Employee: Ask HR Policy, Goal Copilot
- Manager/Admin: Ask HR Policy, Check-in Summary

Ask a policy question, generate a goal suggestion, and generate a check-in summary when using a manager/admin account.

## Closing Message

AlignIQ covers the core BRD flow end-to-end: goal creation, approval, locking, quarterly updates, manager check-ins, HR reporting, auditability, analytics, escalations, notifications, and assistant support.
