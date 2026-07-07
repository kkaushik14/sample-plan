# Execution Plan v1.0

## Build Strategy

Build the suite in phases, starting with a public portfolio foundation that can become the front door for all other product demos. Keep this first pass reviewable, demoable, and easy to revise while stack and versioning decisions settle.

## Phase 1: Foundation and Portfolio Shell

Objectives:

- Establish repository structure.
- Preserve PRD/TDD as versioned source documents.
- Define first implementation decisions.
- Convert the Sahara visual direction into a reusable UI baseline.
- Create structured seed data for portfolio content.
- Build a runnable public portfolio shell with filtering and assistant-style retrieval.

Deliverables:

- `docs/versions/Product_Portfolio_PRD_v1.0.md`
- `docs/versions/Product_Portfolio_TDD_v1.0.md`
- `docs/adr/0001-phase-1-stack.md`
- `docs/UI_DESIGN_DOCUMENT_v0.1.md`
- `data/portfolio.seed.json`
- `apps/web/index.html`
- `apps/web/styles.css`
- `apps/web/app.js`

Exit criteria:

- App runs locally without dependency installation.
- Public home, project, team, and assistant sections render from seed data.
- Project filtering works by sector.
- Assistant gives source-grounded demo answers from approved seed records.
- Verification script passes.

## Phase 2: Product 1 Production Skeleton

Objectives:

- Decide final frontend/backend framework versions.
- Move static portfolio shell into the chosen app framework.
- Add route structure for landing, team, profile, projects, case studies, and assistant.
- Define API contracts and mock service boundaries.
- Prepare admin CMS screen map.

Exit criteria:

- Framework scaffold runs locally.
- Public pages are route-based.
- Seed data can be served through an API-like service module.
- UI components are reusable across portfolio pages.

## Phase 3: Shared Backend Foundation

Objectives:

- Add backend API skeleton.
- Add persistence layer and migrations.
- Add auth/RBAC model.
- Add prompt template and generated output models.
- Add file/export placeholders.

Exit criteria:

- Health endpoint works.
- Public portfolio endpoints return seeded/persisted data.
- Admin-only route protection pattern exists.
- Migration strategy is verified locally.

## Phase 4: Portfolio Assistant

Objectives:

- Add approved-content indexing.
- Add deterministic local retrieval for development.
- Add AI model gateway abstraction.
- Add answer schema validation.
- Add unsupported-claim guardrails.

Exit criteria:

- Assistant answers only from approved records.
- Related projects and people are returned with source labels.
- Failure and unsupported states render clearly.

## Phase 5: Product Tool Modules

Build thin vertical slices in this order:

1. Product Audit and Rebuild Planner.
2. MVP Builder and Product Launch Kit.
3. AI Document and Workflow Automation Platform.

Each module should ship with intake, generation placeholder, editable output, markdown export, and one seeded demo path before the next module expands.

## Phase 6: Demo Readiness

Objectives:

- Add safe sample data for Technology, General Business, Consulting, and Finance.
- Add demo documents and output examples.
- Add QA checklist and smoke tests.
- Add deployment checklist.
- Prepare walkthrough script.

Exit criteria:

- Every product has one complete demo path.
- Public portfolio never exposes private/demo-only records unless explicitly approved.
- Exports work for core generated outputs.
