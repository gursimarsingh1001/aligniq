create extension if not exists pgcrypto;

create table departments (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table users (
  id uuid primary key default gen_random_uuid(),
  department_id uuid references departments(id),
  manager_id uuid references users(id),
  name text not null,
  email text not null unique,
  role text not null check (role in ('employee', 'manager', 'admin')),
  title text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table goal_cycles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  starts_on date not null,
  ends_on date not null,
  submission_deadline date not null,
  checkin_starts_on date not null,
  checkin_ends_on date not null,
  status text not null check (status in ('draft', 'active', 'closed', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (starts_on < ends_on),
  check (submission_deadline between starts_on and ends_on),
  check (checkin_starts_on between starts_on and ends_on),
  check (checkin_ends_on between checkin_starts_on and ends_on)
);

create table goal_submissions (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references users(id),
  manager_id uuid not null references users(id),
  cycle_id uuid not null references goal_cycles(id),
  status text not null check (
    status in ('draft', 'submitted', 'approved', 'returned', 'locked')
  ),
  submitted_at timestamptz,
  reviewed_at timestamptz,
  reviewed_by uuid references users(id),
  manager_comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (employee_id, cycle_id)
);

create table goals (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references goal_submissions(id) on delete cascade,
  employee_id uuid not null references users(id),
  cycle_id uuid not null references goal_cycles(id),
  title text not null,
  description text,
  thrust_area text not null,
  uom_type text not null check (
    uom_type in (
      'numeric_min',
      'numeric_max',
      'percentage_min',
      'percentage_max',
      'timeline',
      'zero_based'
    )
  ),
  target_value numeric,
  target_date date,
  weightage integer not null check (weightage between 10 and 100),
  status text not null check (
    status in ('draft', 'submitted', 'approved', 'returned', 'locked')
  ),
  locked_at timestamptz,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table goals is
  'Business rules: an employee may create at most 8 goals per cycle; each goal has at least 10% weightage; total weightage must equal 100% before submission; approved goals are locked from employee edits. Enforced in application validation and service layer before database writes.';

create table quarterly_updates (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references goals(id) on delete cascade,
  employee_id uuid not null references users(id),
  cycle_id uuid not null references goal_cycles(id),
  actual_value numeric,
  completion_date date,
  progress_score numeric not null default 0,
  employee_comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (goal_id)
);

create table checkins (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references users(id),
  manager_id uuid not null references users(id),
  cycle_id uuid not null references goal_cycles(id),
  quarter_label text not null,
  comment text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references users(id),
  entity_type text not null,
  entity_id uuid,
  action text not null,
  summary text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id),
  title text not null,
  body text not null,
  type text not null check (
    type in ('goal_submitted', 'goal_returned', 'goal_approved', 'checkin_added', 'cycle_update')
  ),
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table document_chunks (
  id uuid primary key default gen_random_uuid(),
  source_name text not null,
  source_type text not null,
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  embedding jsonb,
  created_at timestamptz not null default now()
);

comment on table document_chunks is
  'Reserved for future AI/RAG. Store embedding payloads as JSON in Phase 2; migrate to pgvector when the AI feature is implemented.';

create index idx_users_role on users(role);
create index idx_users_manager_id on users(manager_id);
create index idx_goal_cycles_status on goal_cycles(status);
create index idx_goal_submissions_manager_status on goal_submissions(manager_id, status);
create index idx_goal_submissions_employee_cycle on goal_submissions(employee_id, cycle_id);
create index idx_goals_employee_cycle on goals(employee_id, cycle_id);
create index idx_goals_submission_id on goals(submission_id);
create index idx_quarterly_updates_employee_cycle on quarterly_updates(employee_id, cycle_id);
create index idx_checkins_manager_cycle on checkins(manager_id, cycle_id);
create index idx_checkins_employee_cycle on checkins(employee_id, cycle_id);
create index idx_audit_logs_created_at on audit_logs(created_at desc);
create index idx_audit_logs_entity on audit_logs(entity_type, entity_id);
create index idx_notifications_user_read on notifications(user_id, read_at);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger departments_set_updated_at
before update on departments
for each row execute function set_updated_at();

create trigger users_set_updated_at
before update on users
for each row execute function set_updated_at();

create trigger goal_cycles_set_updated_at
before update on goal_cycles
for each row execute function set_updated_at();

create trigger goal_submissions_set_updated_at
before update on goal_submissions
for each row execute function set_updated_at();

create trigger goals_set_updated_at
before update on goals
for each row execute function set_updated_at();

create trigger quarterly_updates_set_updated_at
before update on quarterly_updates
for each row execute function set_updated_at();

create trigger checkins_set_updated_at
before update on checkins
for each row execute function set_updated_at();
