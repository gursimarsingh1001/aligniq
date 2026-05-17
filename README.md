# AlignIQ — Goal Setting & Performance Tracking Portal

AlignIQ is an internal enterprise portal for goal planning, manager approvals, quarterly achievement tracking, HR reporting, and governance workflows. The evaluation build focuses on a complete role-based experience for Employees, Managers, and Admin / HR users using a local service layer and seeded data.

## Product Summary

AlignIQ helps organizations align quarterly goals, enforce weightage rules, track achievement progress, manage manager check-ins, and give HR teams visibility into completion, exceptions, audit activity, and reporting.

## Core Features

- Role-based login for Employee, Manager, and Admin / HR
- Employee goal creation, editing, deletion, and submission
- Goal validation: maximum 8 goals, minimum 10% per goal, total weightage exactly 100%
- Shared goals assigned by managers/admins to multiple employees
- Manager approval and return-for-rework workflow
- Approved goal locking
- Quarterly achievement updates
- Quarterly schedule/window enforcement
- Progress score formulas with displayed progress capped at 100%
- Manager check-in comments
- Admin dashboard for completion visibility
- Achievement reports with CSV export
- Audit logs
- Goal cycle overview
- Analytics dashboard with Department x Quarter heatmap
- Rule-based escalations
- In-app notifications with read/unread actions
- AlignIQ Assistant with role-based tabs
- Responsive app shell with desktop sidebar and mobile drawer

## User Roles

- Employee: create goals, adjust shared goal weightage, submit goals, update quarterly achievement, use employee assistant tools.
- Manager: review and approve/return goals, manage shared goals, complete team check-ins, view team workflow alerts.
- Admin / HR: view organization dashboards, reports, audit logs, cycles, analytics, escalations, notifications, and shared goals.

## Evaluation Credentials

| Role | Email | Password |
| --- | --- | --- |
| Employee | `employee@aligniq.local` | `AlignIQ@123` |
| Manager | `manager@aligniq.local` | `AlignIQ@123` |
| Admin / HR | `admin@aligniq.local` | `AlignIQ@123` |

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style reusable components
- Zod validation
- Local service layer with seeded evaluation data
- Browser localStorage persistence for evaluation state
- PostgreSQL/Supabase-ready SQL schema included under `db/`

## Local Setup

```bash
npm install
npm run dev
```

Open the local development URL shown by Next.js, usually `http://localhost:3000`.

## Production Build

```bash
npm run build
npm start
```

## Validation Commands

```bash
npm run typecheck
npm run lint
npm run build
```

## Folder Structure Overview

```text
app/                 Next.js App Router pages by role and module
components/          Reusable UI, layout, goals, check-ins, admin, assistant components
lib/auth/            Local evaluation authentication and session helpers
lib/constants/       Roles, routes, statuses, measurement types, cycle windows
lib/data/            Seeded evaluation data
lib/services/        Typed service layer for domain workflows
lib/storage/         localStorage-backed evaluation state helpers
lib/types/           Domain TypeScript types
lib/utils/           Formatters, progress formulas, CSV, date/window utilities
lib/validations/     Zod validation schemas
db/                  PostgreSQL schema and seed SQL for production path
public/assets/       Local brand and profile assets
docs/                Submission documentation
```

## BRD Coverage Summary

- Employees can create and submit up to 8 goals.
- Each goal enforces minimum 10% weightage.
- Total goal weightage must equal exactly 100% before submission.
- Managers can approve or return goals for rework.
- Approved goals are locked for employees.
- Shared goals can be assigned to multiple employees with weightage-only recipient edits.
- Quarterly check-ins support actual achievement, completion date, status, and manager comments.
- Progress formulas support minimum/maximum numeric, minimum/maximum percentage, timeline, and zero-target goals.
- Admin / HR can review reports, audit logs, cycles, analytics, escalations, and completion dashboards.

## Bonus Features

- Shared goals with assignment and sync visibility
- Analytics dashboard with heatmap
- Rule-based escalation workspace
- In-app notification center
- Local, privacy-safe AlignIQ Assistant
- localStorage persistence for evaluation workflows
- Responsive desktop and mobile navigation

## Known Limitations

- The evaluation build uses a local service layer and seeded data rather than a connected production database.
- Authentication is local email/password for evaluation users.
- Microsoft Entra ID SSO can be added in production through organization-approved app registration and role mapping.
- Email and Teams delivery can be connected later through approved organization channels.
- AlignIQ Assistant is local and rule-based; no external AI APIs are used.

## Future Scope

- Connect Supabase PostgreSQL using the included SQL schema.
- Replace local evaluation auth with organization SSO.
- Add production-grade audit persistence and notification delivery.
- Add scheduled background jobs for escalations and cycle enforcement.
- Add private, organization-approved AI/RAG integration if required.
- Expand reporting filters, exports, and executive analytics.
