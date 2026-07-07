# ADR 0001: Phase 1 Stack

## Status

Accepted for Phase 1.

## Context

The workspace starts empty, while the PRD/TDD define a broad multi-product suite. We need an immediate, reviewable foundation without committing too early to final production framework versions or requiring dependency downloads.

## Decision

For Phase 1, use a dependency-light static web shell:

- HTML, CSS, and JavaScript in `apps/web`.
- Structured JSON seed data in `data`.
- Python HTTP server through `npm run dev`.
- Node verification script in `tools`.

The static shell is not the final production architecture. It is a bridge artifact used to validate content structure, visual direction, navigation, and public portfolio interactions before the framework scaffold.

## Consequences

Positive:

- Runs locally without installing packages.
- Keeps early design/content changes fast.
- Gives product and architecture discussions a concrete UI surface.
- Seed data can later feed API fixtures, database seeds, and tests.

Tradeoffs:

- No component framework yet.
- No real backend or persistence yet.
- Assistant behavior is deterministic demo retrieval, not a model-backed workflow.

## Next Decision

Before Phase 2, choose final versions for:

- Frontend framework.
- Backend framework.
- Database and migration tool.
- Auth strategy.
- Queue and file storage approach.
- AI model gateway/provider.
