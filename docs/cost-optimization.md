# Cost Optimization

AlignIQ is designed to keep the evaluation build and production path cost-conscious without sacrificing the BRD workflow.

## Lean Application Architecture

- Next.js monolith keeps hosting and deployment simple.
- Role-based pages, services, and components live in one codebase.
- No separate backend service is required for the current evaluation build.
- Vercel deployment is a low-cost production path for the web layer.

## Database-Ready Without Early Cost

- The app currently uses seeded data and a local service layer.
- Supabase/PostgreSQL can be connected later using the included SQL schema.
- The service layer reduces migration cost because UI components do not need direct database knowledge.

## No External AI API Calls

- AlignIQ Assistant runs locally with deterministic rules and seeded policy knowledge.
- No paid AI API is required for the evaluation build.
- Production can adopt an approved internal LLM or private RAG service only if needed.

## Lightweight Analytics

- The analytics heatmap is CSS-based and does not require a charting library.
- Existing chart-style components use simple HTML/CSS rendering.
- Avoiding heavy chart libraries keeps bundle size and dependency maintenance lower.

## Efficient Export Strategy

- CSV export is implemented with a small utility.
- No heavy spreadsheet package is required.
- The exported report covers the required planned-vs-actual achievement data.

## Reusable Service Layer

- Shared service functions reduce repeated implementation across pages.
- Reports, analytics, dashboards, and assistant summaries reuse existing domain data.
- This keeps future database integration scoped to service replacements.

## Future Caching Strategy

For production-scale data:

- Cache dashboard summaries and analytics aggregates per cycle/quarter.
- Precompute report rows for large organizations.
- Use incremental revalidation or server-side cache tags for admin reporting.
- Keep CSV generation server-side for large exports.
- Index database tables by cycle, department, manager, employee, status, and quarter.
