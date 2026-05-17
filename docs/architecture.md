# Architecture

AlignIQ is structured as a Next.js App Router application with a clear separation between UI, domain services, validation, seeded data, and future database integration.

## High-Level Flow

```text
Browser UI
  -> Next.js App Router pages
  -> React components
  -> Domain service layer
  -> Seeded/local evaluation data
  -> localStorage evaluation state where persistence is needed
```

The current build runs fully in the browser and Next.js runtime without requiring a database connection. The service layer keeps data operations isolated so the same interfaces can later be backed by Supabase/PostgreSQL.

## Role-Based Routing

The app supports three roles:

- Employee
- Manager
- Admin / HR

Local session helpers store the active user session. `RoleGuard` protects role-specific routes and redirects users away from pages outside their role. Route definitions and role navigation live in `lib/constants/routes.ts`, avoiding duplicated route strings across layout components.

## Domain Modules

| Module | Purpose |
| --- | --- |
| Goals | Employee goal creation, validation, submission, and locking |
| Shared Goals | Manager/Admin assigned departmental goals with recipient weightage edits |
| Approvals | Manager review, inline target/weightage adjustment, approval, and return for rework |
| Check-ins | Quarterly employee achievement updates and manager comments |
| Reports | Planned vs actual achievement reporting and CSV export |
| Audit Logs | Governance activity trail |
| Cycles | Goal-setting and quarterly window visibility/enforcement |
| Analytics | Completion metrics, trends, distributions, manager effectiveness, heatmap |
| Escalations | Rule-based overdue workflow visibility |
| Notifications | In-app workflow alerts with read/unread state |
| Assistant | Local rule-based policy, goal drafting, and check-in summary support |

## Service Layer

Domain operations are placed under `lib/services/`. Services provide typed functions such as:

- `getGoalsByEmployeeId`
- `submitEmployeeGoals`
- `approveGoalSubmission`
- `returnGoalSubmission`
- `saveQuarterlyUpdate`
- `saveManagerCheckin`
- `getAchievementReportRows`
- `getEscalationLogs`
- `getNotificationsForUser`

This keeps business workflows out of page components and makes the project easier to review, test, and replace with database-backed implementations.

## Validation Layer

Zod schemas under `lib/validations/` enforce key BRD rules:

- Goal title, thrust area, measurement type, and target requirements
- Individual weightage range
- Maximum goal count
- Total weightage exactly 100% before submission
- Required manager return/check-in comments
- Shared goal creation and assignment requirements

## Database-Ready Path

The `db/` folder includes:

- `db/schema.sql`
- `db/seed.sql`
- `db/README.md`

The schema covers users, departments, goal cycles, goals, submissions, quarterly updates, check-ins, audit logs, notifications, and future document chunks. A production implementation can map service methods to Supabase/PostgreSQL queries while preserving the existing UI and domain contracts.

## Auth and Session Model

The evaluation build uses local email/password accounts. Session state is intentionally simple and stored locally for role-based routing. Passwords are not persisted in workflow state. Production can replace the local session helper with organization-approved identity infrastructure without changing role-specific screens.

## Evaluation State Persistence

Important workflow state is persisted through a versioned localStorage helper in `lib/storage/local-store.ts`. This allows actions such as submissions, approvals, check-ins, notification read status, and local evaluation state to survive page refreshes.

## AlignIQ Assistant Approach

The assistant is local and rule-based:

- HR policy answers are generated from local policy rules.
- Goal Copilot suggestions are deterministic based on keywords and measurement rules.
- Check-in summaries use existing seeded goal/check-in/report data.

No external AI APIs are used. In production, this can be connected to an organization-approved internal LLM or private RAG service.

## Production Upgrade Path

Recommended production path:

1. Replace local authentication with organization-approved SSO.
2. Connect the service layer to Supabase/PostgreSQL.
3. Persist audit logs, notifications, escalations, and check-ins server-side.
4. Add scheduled jobs for cycle windows and escalations.
5. Add server-side authorization checks.
6. Add observability, error tracking, and automated tests.
7. Optionally connect private AI/RAG infrastructure for assistant features.
