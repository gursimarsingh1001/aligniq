# Assumptions and Limitations

## Assumptions

- The evaluation build uses seeded data and a local service layer.
- Evaluation accounts represent the three required roles: Employee, Manager, and Admin / HR.
- Browser localStorage is acceptable for preserving evaluation workflow state across refreshes.
- The included SQL schema represents the intended production persistence model.
- Organization-specific identity, email, Teams, and AI integrations require approved credentials and configuration outside this repository.

## Current Limitations

- The app is not connected to a production database.
- Local email/password authentication is used for evaluation accounts.
- Microsoft Entra ID SSO is future scope.
- Real Email/Teams notification delivery is future scope.
- Escalation evaluation is rule-based in the application layer and not backed by scheduled server jobs.
- The AlignIQ Assistant is local and rule-based, not an external LLM.
- External AI APIs are not used.
- Seeded data is designed to showcase workflows and does not represent a live organization directory.

## Production Persistence

Production database persistence can be connected using the SQL schema under `db/`. The recommended path is to map existing service-layer functions to database operations while keeping UI components and validation rules stable.

## Production Identity

Microsoft Entra ID SSO can be added in production through organization-approved app registration and role mapping. Manager hierarchy can later be synced through approved directory or HRIS integrations.

## Production Notifications

Email and Teams integrations can be added through approved organization channels. The current notification center focuses on in-app workflow visibility.

## Production AI Path

The assistant can later be connected to an organization-approved internal LLM or private RAG service. Employee and goal data should remain within approved enterprise boundaries.
