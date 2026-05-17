# Feature Checklist

| Requirement | Status | Where implemented | Notes |
| --- | --- | --- | --- |
| Role-based portal | Complete | `/login`, `components/layout/RoleGuard.tsx`, `lib/auth/session.ts` | Employee, Manager, and Admin / HR route protection |
| Employee goal creation | Complete | `/employee/goals`, `components/goals/*`, `lib/services/goal-service.ts` | Add/edit/delete before submission/approval |
| Maximum 8 goals | Complete | `lib/validations/goal.ts`, `lib/services/goal-service.ts` | Enforced before valid submission |
| Minimum 10% goal weightage | Complete | `lib/validations/goal.ts`, goal UI | Validation surfaced in the employee goal workflow |
| Total weightage exactly 100% | Complete | `components/goals/WeightageSummary.tsx`, validations/services | Submit disabled until balanced |
| Shared goals | Complete | `/manager/shared-goals`, `/admin/shared-goals`, `components/shared-goals/*` | Assigned goals, primary owner, recipient weightage edit |
| Recipient read-only shared goal fields | Complete | Employee goals and shared goal components | Recipients adjust weightage only |
| Manager approval workflow | Complete | `/manager/approvals`, `components/manager/*` | Approve, return for rework, inline target/weightage edits |
| Goal locking after approval | Complete | Goal service and Employee Goals UI | Approved goals cannot be edited by employee |
| Return for rework | Complete | Manager approvals workflow | Requires manager comment |
| Quarterly check-ins | Complete | `/employee/checkins`, `components/checkins/*` | Actual achievement, completion date, status |
| Schedule/window enforcement | Complete | `lib/utils/cycle-windows.ts`, `/admin/cycles`, check-in pages | Active quarter editable, inactive quarters read-only |
| Progress score formulas | Complete | `lib/utils/progress.ts` | Numeric/percentage min/max, timeline, zero target |
| Display progress cap at 100% | Complete | Progress badges, check-in/report UI | Raw formula remains intact while UI display is capped |
| Manager check-in comments | Complete | `/manager/checkins`, `ManagerCommentBox` | Comment required before save |
| Admin completion dashboard | Complete | `/admin/dashboard`, admin components | HR control center metrics and completion view |
| Achievement report | Complete | `/admin/reports`, `AchievementReportTable` | Planned target vs actual achievement |
| CSV export | Complete | `ReportExportButton`, `lib/utils/csv.ts` | Exports `aligniq-achievement-report.csv` |
| Audit trail | Complete | `/admin/audit-logs`, `lib/services/audit-service.ts` | Governance-focused event table |
| Goal cycles | Complete | `/admin/cycles`, `CycleTimeline` | Active window, closed/upcoming states, cycle overview |
| Analytics | Complete | `/admin/analytics`, `lib/services/analytics-service.ts` | Trends, distributions, manager effectiveness, at-risk goals |
| Analytics heatmap | Complete | `components/admin/CompletionHeatmap.tsx` | Department x Quarter completion health |
| Escalations | Complete | `/admin/escalations`, `lib/services/escalation-service.ts` | Rule-based overdue workflow visibility |
| Notifications | Complete | `/notifications`, `components/notifications/*` | Filters, deep links, read/unread actions |
| AlignIQ Assistant | Complete | `/ai-assistant`, `components/ai/*`, `lib/services/ai-service.ts` | Role-based local assistant tabs |
| Responsive UI | Complete | App shell, sidebar, mobile drawer, page components | Desktop and mobile navigation support |
| Bug handling | Complete | Form validation, disabled states, empty states, role guards | Prevents invalid submission and unauthorized route access |
| User friendliness | Complete | Business-friendly measurement labels and target display | Technical terms converted to user-facing language |
| Cost optimization | Complete | Local assistant, CSS-based charts, CSV export | Avoids unnecessary services and heavy dependencies |

## Evaluation Parameter Mapping

| Evaluation Parameter | Status | Where implemented | Notes |
| --- | --- | --- | --- |
| Functionality of portal | Complete | Role pages and modules across `app/` | End-to-end goal, approval, check-in, reporting, and governance flow |
| BRD adherence | Complete | Validations, services, check-in/cycle utilities | Core BRD rules implemented |
| User friendliness | Complete | Responsive UI, readable cards/tables, business labels | Designed for non-technical HR and manager users |
| Bug handling | Complete | Zod validation, guards, disabled actions, empty states | Prevents common invalid states |
| Good-to-have features | Mostly Complete | Shared goals, analytics heatmap, escalations, notifications, assistant | Analytics heatmap, escalations, in-app notifications, and assistant are implemented. Microsoft Entra ID SSO and real Email/Teams delivery are production future scope. |
| Cost optimization | Complete | See `docs/cost-optimization.md` | Lean stack and no paid AI calls |
