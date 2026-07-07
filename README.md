# AI-Enabled Product Engineering Portfolio Suite

Phase-based build for a portfolio suite that showcases product discovery, product rebuilding, workflow automation, and practical AI enablement.

## Current Phase

Phase 1 foundation is in progress. The app now contains visible demo surfaces for every major product and cross-project requirement in the PRD, while deeper backend persistence, authentication, queueing, AI provider calls, and production exports remain Phase 2+ implementation work.

Implemented in this slice:

- Versioned source PRD/TDD copied into `docs/versions`.
- Execution plan and first architecture decision record.
- Sahara-inspired UI design baseline.
- Structured portfolio seed data.
- Runnable static suite demo covering the four PRD products.
- Local deterministic workflows for portfolio Q&A, product audit, MVP planning, and document intelligence.
- Mock admin/shared-platform controls for CMS, roles, templates, exports, privacy, audit logs, and AI safety.

## Run Locally

```bash
npm run dev
```

Then open:

```text
http://localhost:5173/apps/web/
```

## Verify

```bash
npm run verify
```

## Repository Map

```text
apps/web/              Public suite demo shell
data/                  Seed data for demo and future API work
docs/                  Execution, design, ADR, and versioned source docs
tools/                 Lightweight verification scripts
```

## Phase Direction

The next implementation target is turning the static suite demo into a production scaffold with routes, typed components, backend APIs, persistence, authentication, and real AI orchestration boundaries.
