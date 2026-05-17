# AlignIQ Database

Phase 2 includes a PostgreSQL-ready schema and seed dataset for the future Supabase integration. The application does not connect to this database yet; services read from local TypeScript data for now.

## Files

- `schema.sql` creates the core tables, constraints, indexes, and `updated_at` triggers.
- `seed.sql` loads realistic sample data for admins, managers, employees, one active cycle, submissions, goals, updates, check-ins, audit logs, notifications, and one future AI/RAG document chunk.

## Business Rules Covered

- Employees can create at most 8 goals per cycle.
- Every goal must have a minimum 10% weightage.
- Total weightage must equal 100% before submission.
- Approved goals are locked from employee edits.
- Managers can approve submissions or return them for rework.
- Employees provide quarterly actual achievement.
- Managers provide quarterly check-in comments.

Some aggregate rules, such as maximum goal count and total weightage across a submission, are intentionally enforced in the validation and service layer first. They can later be mirrored with PostgreSQL triggers when Supabase writes are enabled.

## Running Locally Later

```sql
\i db/schema.sql
\i db/seed.sql
```

`document_chunks.embedding` is reserved for future pgvector usage. Enable pgvector before using that column in production.
