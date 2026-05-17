truncate table
  document_chunks,
  notifications,
  audit_logs,
  checkins,
  quarterly_updates,
  goals,
  goal_submissions,
  goal_cycles,
  users,
  departments
restart identity cascade;

insert into departments (id, name) values
  ('11111111-1111-4111-8111-111111111111', 'Product & Engineering'),
  ('22222222-2222-4222-8222-222222222222', 'People Operations');

insert into users (id, department_id, manager_id, name, email, role, title) values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', '22222222-2222-4222-8222-222222222222', null, 'Ava Rodriguez', 'admin@aligniq.local', 'admin', 'People Operations Lead'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1', '11111111-1111-4111-8111-111111111111', null, 'Marcus Chen', 'manager@aligniq.local', 'manager', 'Engineering Manager'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2', '11111111-1111-4111-8111-111111111111', null, 'Priya Nair', 'priya.manager@aligniq.local', 'manager', 'Product Manager'),
  ('cccccccc-cccc-4ccc-8ccc-ccccccccccc1', '11111111-1111-4111-8111-111111111111', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 'Emma Patel', 'employee@aligniq.local', 'employee', 'Product Designer'),
  ('cccccccc-cccc-4ccc-8ccc-ccccccccccc2', '11111111-1111-4111-8111-111111111111', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 'Noah Williams', 'noah@aligniq.local', 'employee', 'Frontend Engineer'),
  ('cccccccc-cccc-4ccc-8ccc-ccccccccccc3', '11111111-1111-4111-8111-111111111111', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 'Lina Gomez', 'lina@aligniq.local', 'employee', 'Backend Engineer'),
  ('cccccccc-cccc-4ccc-8ccc-ccccccccccc4', '11111111-1111-4111-8111-111111111111', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2', 'Owen Miller', 'owen@aligniq.local', 'employee', 'Product Analyst'),
  ('cccccccc-cccc-4ccc-8ccc-ccccccccccc5', '22222222-2222-4222-8222-222222222222', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2', 'Sophia Lee', 'sophia@aligniq.local', 'employee', 'People Partner');

insert into goal_cycles (
  id,
  name,
  starts_on,
  ends_on,
  submission_deadline,
  checkin_starts_on,
  checkin_ends_on,
  status
) values (
  'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
  'FY26 Q2',
  '2026-04-01',
  '2026-06-30',
  '2026-04-15',
  '2026-06-01',
  '2026-06-30',
  'active'
);

insert into goal_submissions (
  id,
  employee_id,
  manager_id,
  cycle_id,
  status,
  submitted_at,
  reviewed_at,
  reviewed_by,
  manager_comment
) values
  ('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee1', 'cccccccc-cccc-4ccc-8ccc-ccccccccccc1', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'approved', '2026-04-10T09:30:00Z', '2026-04-12T14:00:00Z', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 'Approved with clear customer-facing outcomes.'),
  ('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee2', 'cccccccc-cccc-4ccc-8ccc-ccccccccccc2', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'submitted', '2026-04-13T10:15:00Z', null, null, null),
  ('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee3', 'cccccccc-cccc-4ccc-8ccc-ccccccccccc3', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'returned', '2026-04-11T08:45:00Z', '2026-04-12T10:20:00Z', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 'Please make the reliability target measurable.'),
  ('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee4', 'cccccccc-cccc-4ccc-8ccc-ccccccccccc4', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2', 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'approved', '2026-04-09T12:00:00Z', '2026-04-10T11:30:00Z', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2', 'Approved. Strong analytics focus.'),
  ('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee5', 'cccccccc-cccc-4ccc-8ccc-ccccccccccc5', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2', 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'draft', null, null, null, null);

insert into goals (
  id,
  submission_id,
  employee_id,
  cycle_id,
  title,
  description,
  thrust_area,
  uom_type,
  target_value,
  target_date,
  weightage,
  status,
  locked_at,
  sort_order
) values
  ('f0000000-0000-4000-8000-000000000001', 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee1', 'cccccccc-cccc-4ccc-8ccc-ccccccccccc1', 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'Complete quarterly goal review milestone', 'Finish the planned quarterly goal review activity before the target date.', 'Product Delivery', 'timeline', null, '2026-06-20', 35, 'approved', '2026-04-12T14:00:00Z', 1),
  ('f0000000-0000-4000-8000-000000000002', 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee1', 'cccccccc-cccc-4ccc-8ccc-ccccccccccc1', 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'Improve goal completion clarity', 'Increase task success rate in usability testing.', 'Customer Experience', 'percentage_min', 85, null, 35, 'approved', '2026-04-12T14:00:00Z', 2),
  ('f0000000-0000-4000-8000-000000000003', 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee1', 'cccccccc-cccc-4ccc-8ccc-ccccccccccc1', 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'Reduce design handoff defects', 'Lower defects found during implementation reviews.', 'Operational Excellence', 'numeric_max', 8, null, 30, 'approved', '2026-04-12T14:00:00Z', 3),
  ('f0000000-0000-4000-8000-000000000004', 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee2', 'cccccccc-cccc-4ccc-8ccc-ccccccccccc2', 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'Improve dashboard performance', 'Reduce dashboard interaction latency.', 'Engineering Quality', 'numeric_max', 250, null, 50, 'submitted', null, 1),
  ('f0000000-0000-4000-8000-000000000005', 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee2', 'cccccccc-cccc-4ccc-8ccc-ccccccccccc2', 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'Increase test coverage', 'Raise coverage for role guard and service functions.', 'Engineering Quality', 'percentage_min', 80, null, 50, 'submitted', null, 2),
  ('f0000000-0000-4000-8000-000000000006', 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee3', 'cccccccc-cccc-4ccc-8ccc-ccccccccccc3', 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'Improve API reliability', 'Reduce incident count after schema changes.', 'Operational Excellence', 'zero_based', 0, null, 100, 'returned', null, 1),
  ('f0000000-0000-4000-8000-000000000007', 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee4', 'cccccccc-cccc-4ccc-8ccc-ccccccccccc4', 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'Publish quarterly insights pack', 'Deliver reporting insights for HR and managers.', 'Business Impact', 'timeline', null, '2026-06-25', 40, 'approved', '2026-04-10T11:30:00Z', 1),
  ('f0000000-0000-4000-8000-000000000008', 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee4', 'cccccccc-cccc-4ccc-8ccc-ccccccccccc4', 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'Increase report adoption', 'Increase weekly report usage among managers.', 'Customer Experience', 'numeric_min', 25, null, 60, 'approved', '2026-04-10T11:30:00Z', 2);

insert into quarterly_updates (
  id,
  goal_id,
  employee_id,
  cycle_id,
  actual_value,
  completion_date,
  progress_score,
  employee_comment
) values
  ('99999999-0000-4000-8000-000000000001', 'f0000000-0000-4000-8000-000000000001', 'cccccccc-cccc-4ccc-8ccc-ccccccccccc1', 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', null, '2026-06-18', 100, 'Workflow shipped two days before target.'),
  ('99999999-0000-4000-8000-000000000002', 'f0000000-0000-4000-8000-000000000002', 'cccccccc-cccc-4ccc-8ccc-ccccccccccc1', 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', 78, null, 91.76, 'Testing improved, but two flows still need polish.'),
  ('99999999-0000-4000-8000-000000000003', 'f0000000-0000-4000-8000-000000000003', 'cccccccc-cccc-4ccc-8ccc-ccccccccccc1', 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', 6, null, 133.33, 'Reduced implementation defects below target.'),
  ('99999999-0000-4000-8000-000000000004', 'f0000000-0000-4000-8000-000000000007', 'cccccccc-cccc-4ccc-8ccc-ccccccccccc4', 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', null, '2026-06-27', 92.86, 'Pack is complete, delivered after target date.'),
  ('99999999-0000-4000-8000-000000000005', 'f0000000-0000-4000-8000-000000000008', 'cccccccc-cccc-4ccc-8ccc-ccccccccccc4', 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', 21, null, 84, 'Adoption improved steadily through June.');

insert into checkins (
  id,
  employee_id,
  manager_id,
  cycle_id,
  quarter_label,
  comment
) values
  ('88888888-0000-4000-8000-000000000001', 'cccccccc-cccc-4ccc-8ccc-ccccccccccc1', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'FY26 Q2', 'Strong progress. Keep design handoff notes tied to measurable outcomes.'),
  ('88888888-0000-4000-8000-000000000002', 'cccccccc-cccc-4ccc-8ccc-ccccccccccc2', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'FY26 Q2', 'Good engineering focus. Approval pending after performance baseline review.'),
  ('88888888-0000-4000-8000-000000000003', 'cccccccc-cccc-4ccc-8ccc-ccccccccccc4', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2', 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'FY26 Q2', 'Reporting work is on track. Add a concise readout for HR leaders.');

insert into audit_logs (
  id,
  actor_id,
  entity_type,
  entity_id,
  action,
  summary,
  metadata
) values
  ('77777777-0000-4000-8000-000000000001', 'cccccccc-cccc-4ccc-8ccc-ccccccccccc1', 'goal_submission', 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee1', 'submitted', 'Emma Patel submitted FY26 Q2 goals.', '{"goalCount": 3, "totalWeightage": 100}'),
  ('77777777-0000-4000-8000-000000000002', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 'goal_submission', 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee1', 'approved', 'Marcus Chen approved Emma Patel goals.', '{"status": "approved"}'),
  ('77777777-0000-4000-8000-000000000003', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 'goal_submission', 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee3', 'returned', 'Marcus Chen returned Lina Gomez goals for rework.', '{"reason": "Reliability target must be measurable"}'),
  ('77777777-0000-4000-8000-000000000004', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'goal_cycle', 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'cycle_opened', 'Ava Rodriguez opened FY26 Q2 goal cycle.', '{"cycle": "FY26 Q2"}');

insert into notifications (
  user_id,
  title,
  body,
  type
) values
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 'Goals awaiting approval', 'Noah Williams has submitted goals for manager approval.', 'goal_submitted'),
  ('cccccccc-cccc-4ccc-8ccc-ccccccccccc3', 'Goals returned for rework', 'Please update the reliability goal with a measurable target.', 'goal_returned');

insert into document_chunks (source_name, source_type, content, metadata) values
  ('AlignIQ BRD', 'requirements', 'Employees can create up to eight goals, each with at least ten percent weightage.', '{"section": "business-rules"}');
